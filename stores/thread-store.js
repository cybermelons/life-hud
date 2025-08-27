// Thread Store - Business Logic and Data Management
// This store manages thread data and operations, NOT UI state

document.addEventListener('alpine:init', () => {
    Alpine.store('threads', {
        // Thread data
        threads: [],
        
        // Initialize thread store
        init() {
            this.loadThreads();
            this.autoThreadNuts();
        },
        
        // Load threads from localStorage
        loadThreads() {
            try {
                const stored = localStorage.getItem('lilaya_threads');
                if (stored) {
                    this.threads = JSON.parse(stored);
                }
            } catch (e) {
                console.error('Failed to load threads:', e);
                this.threads = [];
            }
        },
        
        // Save threads to localStorage
        saveThreads() {
            try {
                localStorage.setItem('lilaya_threads', JSON.stringify(this.threads));
            } catch (e) {
                console.error('Failed to save threads:', e);
            }
        },
        
        // Get thread by ID
        getThread(threadId) {
            return this.threads.find(t => t.id === threadId);
        },
        
        // Get nuts for a thread
        getThreadNuts(threadId) {
            const appStore = Alpine.store('app');
            return appStore.nuts.filter(n => n.threadId === threadId);
        },
        
        // Create a new thread
        createThread(nutIds = []) {
            const thread = {
                id: Date.now().toString(),
                nutIds: nutIds,
                klesha: false,
                rootDesire: null,
                samskaraNuts: [],
                createdAt: new Date().toISOString(),
                completed: false
            };
            
            this.threads.push(thread);
            this.saveThreads();
            return thread;
        },
        
        // Add NUT to thread
        addNutToThread(nutId, threadId) {
            const appStore = Alpine.store('app');
            const nut = appStore.nuts.find(n => n.id === nutId);
            const thread = this.getThread(threadId);
            
            if (nut && thread) {
                nut.threadId = threadId;
                if (!thread.nutIds.includes(nutId)) {
                    thread.nutIds.push(nutId);
                }
                appStore.saveNuts();
                this.saveThreads();
            }
        },
        
        // Remove NUT from thread
        removeNutFromThread(nutId, threadId) {
            const appStore = Alpine.store('app');
            const nut = appStore.nuts.find(n => n.id === nutId);
            const thread = this.getThread(threadId);
            
            if (nut && thread) {
                nut.threadId = null;
                thread.nutIds = thread.nutIds.filter(id => id !== nutId);
                appStore.saveNuts();
                this.saveThreads();
            }
        },
        
        // Mark thread as klesha
        markThreadKlesha(threadId) {
            const thread = this.getThread(threadId);
            if (thread) {
                thread.klesha = true;
                
                // Mark all NUTs in thread as klesha
                const appStore = Alpine.store('app');
                appStore.nuts.forEach(nut => {
                    if (nut.threadId === threadId) {
                        nut.klesha = true;
                    }
                });
                
                this.saveThreads();
                appStore.saveNuts();
            }
        },
        
        // Auto-create threads from temporal proximity
        autoThreadNuts() {
            const appStore = Alpine.store('app');
            const unthreaded = appStore.nuts.filter(n => !n.threadId);
            const timeGroups = [];
            
            unthreaded.forEach(nut => {
                const nutTime = new Date(nut.timestamp).getTime();
                let added = false;
                
                for (let group of timeGroups) {
                    const groupTime = new Date(group[0].timestamp).getTime();
                    if (Math.abs(nutTime - groupTime) < 10 * 60 * 1000) { // 10 minutes
                        group.push(nut);
                        added = true;
                        break;
                    }
                }
                
                if (!added) {
                    timeGroups.push([nut]);
                }
            });
            
            // Create threads for groups with 2+ NUTs
            timeGroups.forEach(group => {
                if (group.length >= 2) {
                    const thread = this.createThread(group.map(n => n.id));
                    group.forEach(nut => {
                        nut.threadId = thread.id;
                    });
                }
            });
            
            appStore.saveNuts();
            this.saveThreads();
        },
        
        // Get thread statistics
        getThreadStats(threadId) {
            const nuts = this.getThreadNuts(threadId);
            const types = nuts.map(n => n.type);
            
            return {
                totalNuts: nuts.length,
                hasNote: types.includes('note'),
                hasUrge: types.includes('urge'),
                hasTask: types.includes('task'),
                isComplete: types.includes('note') && types.includes('urge') && types.includes('task')
            };
        },
        
        // Delete thread
        deleteThread(threadId) {
            // Remove thread association from nuts
            const appStore = Alpine.store('app');
            appStore.nuts.forEach(nut => {
                if (nut.threadId === threadId) {
                    nut.threadId = null;
                    nut.klesha = false;
                    nut.samskara = false;
                }
            });
            
            // Remove thread
            this.threads = this.threads.filter(t => t.id !== threadId);
            
            appStore.saveNuts();
            this.saveThreads();
        }
    });
});