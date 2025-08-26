// Supabase Configuration
const SUPABASE_URL = 'https://rgjndmuhnnpnhxfppmpd.supabase.co';
// You need to get the anon key from your Supabase dashboard:
// Go to: https://supabase.com/dashboard/project/rgjndmuhnnpnhxfppmpd/settings/api
// Copy the "anon public" key and replace below
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnam5kbXVobm5wbmh4ZnBwbXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNTYwMzMsImV4cCI6MjA3MTczMjAzM30.cZCuYG9kDLjvGKtZlCeuLeEpGolq1EeZChqtaItK4Ts'; // Get from Supabase dashboard > Settings > API

let supabase = null;

// Alpine.js App Store
document.addEventListener('alpine:init', () => {
    Alpine.store('app', {
        // State
        nuts: [],
        captureOpen: false,
        nutType: 'note',
        nutContent: '',
        isOnline: navigator.onLine,
        
        // Auth state
        user: null,
        showLoginModal: false,
        syncStatus: 'idle', // idle, syncing, synced, error
        lastSyncTime: null,
        emailForLogin: '',
        
        // Initialize
        init() {
            // Load from localStorage
            this.loadNuts();
            
            // Check for auth errors in URL
            const urlParams = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.slice(1));
            const error = urlParams.get('error') || hashParams.get('error');
            const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
            
            if (error) {
                console.error('Auth error:', error, errorDescription);
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // Only show OAuth errors, not email verification pending
                if (errorDescription?.includes('Error getting user profile')) {
                    // OAuth not configured - silently ignore since we're using email
                    console.log('OAuth not configured, use email login instead');
                }
            }
            
            // Check if this is a successful auth callback
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            
            if (accessToken && refreshToken) {
                console.log('Auth callback detected, processing tokens...');
                // Don't clean URL yet - let Supabase process it first
                // Supabase will handle the tokens when we call getSession()
            }
            
            // Initialize Supabase and check auth state immediately
            // This is important for OAuth redirects
            if (typeof window.supabase !== 'undefined') {
                this.initSupabase();
            } else {
                // Wait for Supabase to load then init
                window.addEventListener('load', () => {
                    this.initSupabase();
                });
            }
            
            // Set up online/offline detection
            window.addEventListener('online', () => {
                this.isOnline = true;
                this.sync();
            });
            
            window.addEventListener('offline', () => {
                this.isOnline = false;
            });
            
            // Auto-focus input when capture opens
            Alpine.effect(() => {
                if (this.captureOpen) {
                    // Wait for transition to complete
                    setTimeout(() => {
                        const input = document.querySelector('[x-ref="nutInput"]');
                        if (input) {
                            input.focus();
                            // Also scroll into view on mobile
                            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 250);
                }
            });
        },
        
        // Initialize Supabase (lazy - only when needed)
        async initSupabase() {
            if (typeof window.supabase === 'undefined') {
                console.log('Supabase not loaded yet');
                return;
            }
            
            if (!supabase) {
                console.log('Initializing Supabase client');
                supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                
                // Listen for auth changes FIRST
                supabase.auth.onAuthStateChange((event, session) => {
                    console.log('Auth state change:', event, session);
                    this.user = session?.user || null;
                    this.showLoginModal = false;
                    
                    if (event === 'SIGNED_IN' && session) {
                        console.log('User signed in:', session.user.email);
                        // Clean up URL after successful auth
                        if (window.location.hash.includes('access_token')) {
                            window.history.replaceState({}, document.title, window.location.pathname);
                        }
                        // First sync after login - upload local data
                        this.syncToSupabase().then(() => {
                            this.syncFromSupabase();
                        });
                    } else if (event === 'SIGNED_OUT') {
                        console.log('User signed out');
                        this.syncStatus = 'idle';
                    }
                });
            }
            
            // Now check for existing session (this will trigger the auth state change)
            const { data: { session }, error } = await supabase.auth.getSession();
            console.log('Session check:', session, error);
            
            if (session) {
                console.log('User logged in:', session.user.email);
                this.user = session.user;
                this.showLoginModal = false;
                // Sync on login
                this.syncFromSupabase();
            }
        },
        
        // Sign in with OAuth provider
        async signInWith(provider) {
            await this.initSupabase();
            if (!supabase) {
                alert('Supabase not loaded. Please try again.');
                return;
            }
            
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/inventory`
                }
            });
            
            if (error) {
                console.error('Auth error:', error);
                alert('Login failed: ' + error.message);
            }
        },
        
        // Sign in with email (magic link)
        async signInWithEmail() {
            await this.initSupabase();
            if (!supabase || !this.emailForLogin) {
                alert('Please enter your email address');
                return;
            }
            
            const { error } = await supabase.auth.signInWithOtp({
                email: this.emailForLogin,
                options: {
                    emailRedirectTo: `${window.location.origin}/inventory`
                }
            });
            
            if (error) {
                console.error('Email auth error:', error);
                alert('Failed to send magic link: ' + error.message);
            } else {
                alert('Check your email for the magic link!');
                this.showLoginModal = false;
                this.emailForLogin = '';
            }
        },
        
        // Sign out
        async signOut() {
            if (supabase) {
                await supabase.auth.signOut();
                this.user = null;
                this.syncStatus = 'idle';
            }
        },
        
        // Sync from Supabase to local
        async syncFromSupabase() {
            if (!supabase || !this.user) return;
            
            this.syncStatus = 'syncing';
            try {
                const { data, error } = await supabase
                    .from('nuts')
                    .select('*')
                    .eq('user_id', this.user.id)
                    .order('timestamp', { ascending: false });
                
                if (error) throw error;
                
                // Merge with local data (prefer newer)
                const merged = this.mergeNuts(this.nuts, data || []);
                this.nuts = merged;
                this.saveNuts();
                
                this.syncStatus = 'synced';
                this.lastSyncTime = new Date();
            } catch (error) {
                console.error('Sync error:', error);
                this.syncStatus = 'error';
            }
        },
        
        // Sync local changes to Supabase
        async syncToSupabase() {
            if (!supabase || !this.user) return;
            
            this.syncStatus = 'syncing';
            try {
                // Prepare nuts for Supabase (add user_id)
                const nutsToSync = this.nuts.map(nut => ({
                    ...nut,
                    user_id: this.user.id
                }));
                
                // Upsert all nuts
                const { error } = await supabase
                    .from('nuts')
                    .upsert(nutsToSync, { onConflict: 'id' });
                
                if (error) throw error;
                
                this.syncStatus = 'synced';
                this.lastSyncTime = new Date();
            } catch (error) {
                console.error('Sync error:', error);
                this.syncStatus = 'error';
            }
        },
        
        // Merge nuts arrays, preferring newer versions
        mergeNuts(local, remote) {
            const nutMap = new Map();
            
            // Add remote nuts
            remote.forEach(nut => {
                nutMap.set(nut.id, nut);
            });
            
            // Add/update with local nuts (prefer local if newer)
            local.forEach(nut => {
                const existing = nutMap.get(nut.id);
                if (!existing || new Date(nut.timestamp) > new Date(existing.timestamp)) {
                    nutMap.set(nut.id, nut);
                }
            });
            
            return Array.from(nutMap.values())
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        },
        
        // Manual sync trigger
        async sync() {
            if (this.user) {
                await this.syncToSupabase();
                await this.syncFromSupabase();
            }
        },
        
        // Load NUTs from localStorage
        loadNuts() {
            try {
                const stored = localStorage.getItem('lilaya_nuts');
                if (stored) {
                    this.nuts = JSON.parse(stored);
                }
            } catch (e) {
                console.error('Failed to load NUTs:', e);
                this.nuts = [];
            }
        },
        
        // Save NUTs to localStorage
        saveNuts() {
            try {
                localStorage.setItem('lilaya_nuts', JSON.stringify(this.nuts));
            } catch (e) {
                console.error('Failed to save NUTs:', e);
            }
        },
        
        // Add a new NUT
        addNut() {
            if (!this.nutContent.trim()) return;
            
            const nut = {
                id: Date.now().toString(),
                type: this.nutType,
                content: this.nutContent.trim(),
                timestamp: new Date().toISOString(),
                kingdom: null,
                zone: null,
                synced: false
            };
            
            this.nuts.unshift(nut);
            this.saveNuts();
            
            // Reset form
            this.nutContent = '';
            this.captureOpen = false;
            
            // Queue for sync
            this.queueSync(nut.id);
            
            // Haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        },
        
        // Delete a NUT
        deleteNut(id) {
            this.nuts = this.nuts.filter(n => n.id !== id);
            this.saveNuts();
        },
        
        // Assign NUT to kingdom/zone
        assignNut(id, kingdom, zone) {
            const nut = this.nuts.find(n => n.id === id);
            if (nut) {
                nut.kingdom = kingdom;
                nut.zone = zone;
                this.saveNuts();
                this.queueSync(id);
            }
        },
        
        // Get today's NUT count
        getTodayCount() {
            const today = new Date().toDateString();
            return this.nuts.filter(n => {
                return new Date(n.timestamp).toDateString() === today;
            }).length;
        },
        
        // Get unassigned NUTs (inventory)
        getInventory() {
            return this.nuts.filter(n => !n.kingdom);
        },
        
        // Get NUTs by kingdom
        getNutsByKingdom(kingdom) {
            return this.nuts.filter(n => n.kingdom === kingdom);
        },
        
        // Queue for sync
        queueSync(nutId) {
            // If user is logged in and online, sync immediately
            if (this.user && this.isOnline) {
                this.syncToSupabase();
            }
        },
        
        // Export data
        exportData() {
            const data = {
                version: 1,
                exported: new Date().toISOString(),
                nuts: this.nuts
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `lilaya-backup-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },
        
        // Import data
        importData(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.version === 1 && Array.isArray(data.nuts)) {
                        this.nuts = data.nuts;
                        this.saveNuts();
                        alert('Data imported successfully!');
                    } else {
                        alert('Invalid backup file');
                    }
                } catch (err) {
                    alert('Failed to import data');
                    console.error(err);
                }
            };
            reader.readAsText(file);
        },
        
        // Clear all data
        clearAllData() {
            if (confirm('This will delete all your NUTs. Are you sure?')) {
                this.nuts = [];
                localStorage.clear();
                location.reload();
            }
        }
    });
});

// Initialize app when Alpine is ready
document.addEventListener('alpine:initialized', () => {
    Alpine.store('app').init();
});
