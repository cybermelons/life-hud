// Kama Store - Battle Mechanics and Extraction Logic
// This store manages Kama-specific game mechanics, NOT UI state

document.addEventListener('alpine:init', () => {
    Alpine.store('kama', {
        // Root desire types
        rootDesires: [
            { id: 'vishaya', name: 'Vishaya', description: 'Sensory pleasure - "I just want stimulation"' },
            { id: 'kirti', name: 'Kirti', description: 'Recognition/validation - "I need to feel seen and valued"' },
            { id: 'bhoga', name: 'Bhoga', description: 'Comfort/avoidance - "I\'m avoiding something painful"' },
            { id: 'aishvarya', name: 'Aishvarya', description: 'Power/control - "I need to feel in control"' },
            { id: 'iccha', name: 'Iccha', description: 'Endless craving - "Nothing is ever enough"' }
        ],
        
        // Kama collection stats
        kamaStats: {},
        
        // Extraction history
        extractions: [],
        
        // Initialize Kama store
        init() {
            this.loadKamaStats();
            this.loadExtractions();
        },
        
        // Load Kama stats from localStorage
        loadKamaStats() {
            try {
                const stored = localStorage.getItem('lilaya_kama_stats');
                if (stored) {
                    this.kamaStats = JSON.parse(stored);
                }
            } catch (e) {
                console.error('Failed to load Kama stats:', e);
                this.kamaStats = {};
            }
        },
        
        // Save Kama stats to localStorage
        saveKamaStats() {
            try {
                localStorage.setItem('lilaya_kama_stats', JSON.stringify(this.kamaStats));
            } catch (e) {
                console.error('Failed to save Kama stats:', e);
            }
        },
        
        // Load extraction history
        loadExtractions() {
            try {
                const stored = localStorage.getItem('lilaya_extractions');
                if (stored) {
                    this.extractions = JSON.parse(stored);
                }
            } catch (e) {
                console.error('Failed to load extractions:', e);
                this.extractions = [];
            }
        },
        
        // Save extraction history
        saveExtractions() {
            try {
                localStorage.setItem('lilaya_extractions', JSON.stringify(this.extractions));
            } catch (e) {
                console.error('Failed to save extractions:', e);
            }
        },
        
        // Identify root desire for a thread
        identifyRootDesire(threadId, desireId) {
            const threadStore = Alpine.store('threads');
            const thread = threadStore.getThread(threadId);
            const desire = this.rootDesires.find(d => d.id === desireId);
            
            if (thread && desire) {
                thread.rootDesire = desire;
                threadStore.saveThreads();
                return true;
            }
            return false;
        },
        
        // Move NUT to samskara lane
        moveToSamskara(nutId, threadId) {
            const threadStore = Alpine.store('threads');
            const appStore = Alpine.store('app');
            const thread = threadStore.getThread(threadId);
            const nut = appStore.nuts.find(n => n.id === nutId);
            
            if (thread && nut && thread.rootDesire) {
                // Update NUT properties
                nut.samskara = true;
                nut.klesha = false;
                
                // Add to thread's samskara list
                if (!thread.samskaraNuts) {
                    thread.samskaraNuts = [];
                }
                if (!thread.samskaraNuts.includes(nutId)) {
                    thread.samskaraNuts.push(nutId);
                }
                
                appStore.saveNuts();
                threadStore.saveThreads();
                return true;
            }
            return false;
        },
        
        // Move NUT back to klesha lane
        moveToKlesha(nutId, threadId) {
            const threadStore = Alpine.store('threads');
            const appStore = Alpine.store('app');
            const thread = threadStore.getThread(threadId);
            const nut = appStore.nuts.find(n => n.id === nutId);
            
            if (thread && nut) {
                // Update NUT properties
                nut.samskara = false;
                nut.klesha = true;
                
                // Remove from samskara list
                if (thread.samskaraNuts) {
                    thread.samskaraNuts = thread.samskaraNuts.filter(id => id !== nutId);
                }
                
                appStore.saveNuts();
                threadStore.saveThreads();
                return true;
            }
            return false;
        },
        
        // Check if thread has complete samskara chain
        hasCompleteSamskara(threadId) {
            const threadStore = Alpine.store('threads');
            const appStore = Alpine.store('app');
            const thread = threadStore.getThread(threadId);
            
            if (!thread || !thread.samskaraNuts) return false;
            
            const samskaraNuts = appStore.nuts.filter(n => 
                thread.samskaraNuts.includes(n.id)
            );
            
            const types = samskaraNuts.map(n => n.type);
            return types.includes('note') && 
                   types.includes('urge') && 
                   types.includes('task');
        },
        
        // Get samskara nuts for a thread
        getSamskaraNuts(threadId) {
            const threadStore = Alpine.store('threads');
            const appStore = Alpine.store('app');
            const thread = threadStore.getThread(threadId);
            
            if (!thread || !thread.samskaraNuts) return [];
            
            return appStore.nuts.filter(n => 
                thread.samskaraNuts.includes(n.id)
            );
        },
        
        // Get klesha nuts for a thread
        getKleshaNuts(threadId) {
            const threadStore = Alpine.store('threads');
            const nuts = threadStore.getThreadNuts(threadId);
            return nuts.filter(n => n.klesha && !n.samskara);
        },
        
        // Create seal for thread
        createSeal(threadId) {
            const threadStore = Alpine.store('threads');
            const appStore = Alpine.store('app');
            const thread = threadStore.getThread(threadId);
            
            if (!thread || !this.hasCompleteSamskara(threadId)) {
                return { success: false, message: 'Incomplete samskara chain' };
            }
            
            // Find the task in samskara chain
            const task = appStore.nuts.find(n => 
                thread.samskaraNuts.includes(n.id) && 
                n.type === 'task'
            );
            
            if (task) {
                // Mark task as extraction trigger
                task.extractionReady = true;
                thread.sealCreated = true;
                thread.sealTask = task.id;
                
                appStore.saveNuts();
                threadStore.saveThreads();
                
                return { 
                    success: true, 
                    message: `Seal created! Complete "${task.content}" to extract the ${thread.rootDesire.name} Kama.`,
                    task: task
                };
            }
            
            return { success: false, message: 'No task found in samskara chain' };
        },
        
        // Complete extraction
        completeExtraction(taskId) {
            const threadStore = Alpine.store('threads');
            const appStore = Alpine.store('app');
            const task = appStore.nuts.find(n => n.id === taskId);
            
            if (!task || !task.extractionReady) {
                return { success: false, message: 'Task not ready for extraction' };
            }
            
            const thread = threadStore.threads.find(t => 
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
                
                this.extractions.push(extraction);
                this.saveExtractions();
                
                // Update Kama stats
                this.updateKamaStats(thread.rootDesire.id);
                
                // Mark task as completed
                task.completed = true;
                
                threadStore.saveThreads();
                appStore.saveNuts();
                
                return {
                    success: true,
                    message: `${thread.rootDesire.name} Kama has been satisfied!`,
                    extraction: extraction
                };
            }
            
            return { success: false, message: 'Thread not found' };
        },
        
        // Update Kama stats after extraction
        updateKamaStats(kamaType) {
            if (!this.kamaStats[kamaType]) {
                this.kamaStats[kamaType] = {
                    encounters: 0,
                    extractions: 0,
                    lastExtraction: null,
                    bond: 0,
                    hunger: 50
                };
            }
            
            const stats = this.kamaStats[kamaType];
            stats.encounters++;
            stats.extractions++;
            stats.lastExtraction = new Date().toISOString();
            stats.bond = Math.min(100, stats.bond + 20);
            stats.hunger = Math.max(0, stats.hunger - 50);
            
            // Check for totem creation (5 extractions)
            if (stats.extractions === 5) {
                stats.totemCreated = true;
                stats.totemCreatedAt = new Date().toISOString();
            }
            
            this.saveKamaStats();
        },
        
        // Get Kama hunger level (increases over time)
        getKamaHunger(kamaType) {
            if (!this.kamaStats[kamaType]) return 50;
            
            const stats = this.kamaStats[kamaType];
            if (!stats.lastExtraction) return 50;
            
            const hoursSinceExtraction = 
                (Date.now() - new Date(stats.lastExtraction).getTime()) / (1000 * 60 * 60);
            
            // Hunger increases by 10% per day
            const hungerIncrease = Math.floor(hoursSinceExtraction / 24) * 10;
            return Math.min(100, stats.hunger + hungerIncrease);
        },
        
        // Get all Kama types encountered
        getEncounteredKama() {
            return Object.keys(this.kamaStats).map(kamaType => {
                const desire = this.rootDesires.find(d => d.id === kamaType);
                return {
                    ...desire,
                    ...this.kamaStats[kamaType],
                    currentHunger: this.getKamaHunger(kamaType)
                };
            });
        }
    });
});