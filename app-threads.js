// Thread Management Extension for Life HUD
// This extends the main app.js with thread and Kama battle functionality

document.addEventListener('alpine:init', () => {
    // Extend the main app store with thread functionality
    const appStore = Alpine.store('app');
    
    // Add thread-specific properties
    Object.assign(appStore, {
        // Thread state
        threads: [],
        selectedThread: null,
        threadFilter: 'all',
        
        // Kama battle state
        rootDesires: [
            { id: 'vishaya', name: 'Vishaya', description: 'Sensory pleasure - "I just want stimulation"' },
            { id: 'kirti', name: 'Kirti', description: 'Recognition/validation - "I need to feel seen and valued"' },
            { id: 'bhoga', name: 'Bhoga', description: 'Comfort/avoidance - "I\'m avoiding something painful"' },
            { id: 'aishvarya', name: 'Aishvarya', description: 'Power/control - "I need to feel in control"' },
            { id: 'iccha', name: 'Iccha', description: 'Endless craving - "Nothing is ever enough"' }
        ],
        
        // Initialize threads
        initThreads() {
            this.loadThreads();
            // Auto-create threads from existing NUTs
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
        
        // Auto-create threads from unthreaded NUTs
        autoThreadNuts() {
            // Group NUTs by temporal proximity (within 10 minutes)
            const unthreaded = this.nuts.filter(n => !n.threadId);
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
                    const thread = this.createThread(group);
                    group.forEach(nut => {
                        nut.threadId = thread.id;
                    });
                }
            });
            
            this.saveNuts();
            this.saveThreads();
        },
        
        // Create a new thread
        createThread(nuts = []) {
            const thread = {
                id: Date.now().toString(),
                nutIds: nuts.map(n => n.id),
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
        addToThread(nutId, threadId) {
            const nut = this.nuts.find(n => n.id === nutId);
            const thread = this.threads.find(t => t.id === threadId);
            
            if (nut && thread) {
                nut.threadId = threadId;
                if (!thread.nutIds.includes(nutId)) {
                    thread.nutIds.push(nutId);
                }
                this.saveNuts();
                this.saveThreads();
            }
        },
        
        // Mark thread as klesha
        markThreadKlesha(threadId) {
            const thread = this.threads.find(t => t.id === threadId);
            if (thread) {
                thread.klesha = true;
                // Mark all NUTs in thread as klesha
                this.nuts.forEach(nut => {
                    if (nut.threadId === threadId) {
                        nut.klesha = true;
                    }
                });
                this.saveThreads();
                this.saveNuts();
            }
        },
        
        // Identify root desire for klesha thread
        identifyRootDesire(threadId, desireId) {
            const thread = this.threads.find(t => t.id === threadId);
            const desire = this.rootDesires.find(d => d.id === desireId);
            
            if (thread && desire) {
                thread.rootDesire = desire;
                this.saveThreads();
            }
        },
        
        // Move NUT to samskara lane
        moveToSamskara(nutId, threadId) {
            const thread = this.threads.find(t => t.id === threadId);
            const nut = this.nuts.find(n => n.id === nutId);
            
            if (thread && nut && thread.rootDesire) {
                nut.samskara = true;
                nut.klesha = false;
                
                if (!thread.samskaraNuts.includes(nutId)) {
                    thread.samskaraNuts.push(nutId);
                }
                
                this.saveNuts();
                this.saveThreads();
            }
        },
        
        // Check if thread has complete samskara chain
        hasCompleteSamskara(threadId) {
            const thread = this.threads.find(t => t.id === threadId);
            if (!thread) return false;
            
            const samskaraNuts = this.nuts.filter(n => 
                thread.samskaraNuts.includes(n.id)
            );
            
            const types = samskaraNuts.map(n => n.type);
            return types.includes('note') && 
                   types.includes('urge') && 
                   types.includes('task');
        },
        
        // Create seal and complete extraction
        createSeal(threadId) {
            const thread = this.threads.find(t => t.id === threadId);
            if (!thread || !this.hasCompleteSamskara(threadId)) return;
            
            // Find the task in samskara chain
            const task = this.nuts.find(n => 
                thread.samskaraNuts.includes(n.id) && 
                n.type === 'task'
            );
            
            if (task) {
                // Mark task as extraction trigger
                task.extractionReady = true;
                thread.sealCreated = true;
                thread.sealTask = task.id;
                
                this.saveNuts();
                this.saveThreads();
                
                // Show success message
                alert(`Seal created! Complete "${task.content}" to extract the ${thread.rootDesire.name} Kama.`);
            }
        },
        
        // Complete task and trigger extraction
        completeExtraction(taskId) {
            const task = this.nuts.find(n => n.id === taskId);
            if (!task || !task.extractionReady) return;
            
            const thread = this.threads.find(t => 
                t.sealTask === taskId
            );
            
            if (thread) {
                // Mark thread as completed
                thread.completed = true;
                thread.completedAt = new Date().toISOString();
                
                // Track extraction
                const extraction = {
                    id: Date.now().toString(),
                    threadId: thread.id,
                    kamaType: thread.rootDesire.id,
                    kamaName: thread.rootDesire.name,
                    extractedAt: new Date().toISOString()
                };
                
                // Save to extraction history
                const extractions = JSON.parse(localStorage.getItem('lilaya_extractions') || '[]');
                extractions.push(extraction);
                localStorage.setItem('lilaya_extractions', JSON.stringify(extractions));
                
                // Update stats
                this.updateKamaStats(thread.rootDesire.id);
                
                this.saveThreads();
                
                // Show extraction animation (placeholder)
                alert(`💥 EXTRACTION SUCCESSFUL! 💥\n\n${thread.rootDesire.name} Kama has been satisfied!\n\n"That was... intense..."`);
            }
        },
        
        // Update Kama collection stats
        updateKamaStats(kamaType) {
            const stats = JSON.parse(localStorage.getItem('lilaya_kama_stats') || '{}');
            
            if (!stats[kamaType]) {
                stats[kamaType] = {
                    encounters: 0,
                    extractions: 0,
                    lastExtraction: null,
                    bond: 0
                };
            }
            
            stats[kamaType].encounters++;
            stats[kamaType].extractions++;
            stats[kamaType].lastExtraction = new Date().toISOString();
            stats[kamaType].bond = Math.min(100, stats[kamaType].bond + 20);
            
            localStorage.setItem('lilaya_kama_stats', JSON.stringify(stats));
        },
        
        // Get thread preview text
        getThreadPreview(threadId) {
            const thread = this.threads.find(t => t.id === threadId);
            if (!thread) return '';
            
            const firstNut = this.nuts.find(n => n.id === thread.nutIds[0]);
            return firstNut ? firstNut.content.substring(0, 50) + '...' : '';
        },
        
        // Get filtered threads
        getFilteredThreads() {
            if (this.threadFilter === 'all') return this.threads;
            if (this.threadFilter === 'kleshas') return this.threads.filter(t => t.klesha);
            if (this.threadFilter === 'completed') return this.threads.filter(t => t.completed);
            return this.threads;
        }
    });
    
    // Initialize threads when app initializes
    const originalInit = appStore.init.bind(appStore);
    appStore.init = function() {
        originalInit();
        this.initThreads();
    };
});