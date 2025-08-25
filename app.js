// Alpine.js App Store
document.addEventListener('alpine:init', () => {
    Alpine.store('app', {
        // State
        nuts: [],
        captureOpen: false,
        nutType: 'note',
        nutContent: '',
        isOnline: navigator.onLine,
        
        // Initialize
        init() {
            // Load from localStorage
            this.loadNuts();
            
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
                    setTimeout(() => {
                        const input = document.querySelector('[x-ref="nutInput"]');
                        if (input) input.focus();
                    }, 100);
                }
            });
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
            if (!this.isOnline) {
                // Store in queue for later
                let queue = JSON.parse(localStorage.getItem('lilaya_sync_queue') || '[]');
                if (!queue.includes(nutId)) {
                    queue.push(nutId);
                    localStorage.setItem('lilaya_sync_queue', JSON.stringify(queue));
                }
            } else {
                // Sync immediately if online
                this.syncNut(nutId);
            }
        },
        
        // Sync a single NUT (placeholder for future Supabase integration)
        syncNut(nutId) {
            // TODO: Implement Supabase sync
            console.log('Would sync NUT:', nutId);
        },
        
        // Sync all pending changes
        sync() {
            if (!this.isOnline) return;
            
            const queue = JSON.parse(localStorage.getItem('lilaya_sync_queue') || '[]');
            queue.forEach(nutId => {
                this.syncNut(nutId);
            });
            
            // Clear queue after sync
            localStorage.removeItem('lilaya_sync_queue');
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