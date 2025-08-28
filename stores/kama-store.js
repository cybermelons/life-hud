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
        
        // Kamas mapped to threads (1:1 relationship)
        kamas: {},
        threadIdToKamaId: {},
        
        // Kama collection stats
        kamaStats: {},
        
        // Extraction history
        extractions: [],
        
        // Initialize Kama store
        init() {
            this.loadKamas();
            this.loadKamaStats();
            this.loadExtractions();
        },
        
        // Save Kamas to localStorage
        saveKamas() {
            try {
                localStorage.setItem('lilaya_kamas', JSON.stringify({
                    kamas: this.kamas,
                    threadIdToKamaId: this.threadIdToKamaId
                }));
            } catch (e) {
                console.error('Failed to save Kamas:', e);
            }
        },
        
        // Load Kamas from localStorage
        loadKamas() {
            try {
                const stored = localStorage.getItem('lilaya_kamas');
                if (stored) {
                    const data = JSON.parse(stored);
                    this.kamas = data.kamas || {};
                    this.threadIdToKamaId = data.threadIdToKamaId || {};
                }
            } catch (e) {
                console.error('Failed to load Kamas:', e);
                this.kamas = {};
                this.threadIdToKamaId = {};
            }
        },
        
        // Verify that Kama queues exactly equal thread NUTs
        verifyKamaInvariant(kama) {
            const threadStore = Alpine.store('threads');
            const thread = threadStore.getThread(kama.threadId);
            if (!thread) return false;
            
            const kamaSet = new Set([...kama.kleshaNutIds, ...kama.samskaraNutIds]);
            const threadSet = new Set(thread.nutIds);
            
            if (kamaSet.size !== threadSet.size) {
                console.error("Kama queues don't match thread NUTs");
                return false;
            }
            
            for (const nutId of threadSet) {
                if (!kamaSet.has(nutId)) {
                    console.error(`Thread NUT ${nutId} missing from Kama queues`);
                    return false;
                }
            }
            
            return true;
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
        
        // Get or create Kama for tainted thread
        ensureKamaForThread(threadId) {
            const threadStore = Alpine.store('threads');
            const thread = threadStore.getThread(threadId);
            if (!thread) return null;
            
            // Check if thread is tainted
            if (!threadStore.isThreadTainted(threadId)) return null;
            
            // Check if Kama already exists
            let kamaId = this.threadIdToKamaId[threadId];
            if (kamaId) return this.kamas[kamaId];
            
            // Create new Kama with all NUTs in klesha queue initially
            const kama = {
                id: `kama_${Date.now()}`,
                threadId: threadId,
                kleshaNutIds: [...thread.nutIds],  // Start with all as problems
                samskaraNutIds: [],                // Empty solution queue
                rootDesire: null,
                state: 'unidentified'
            };
            
            this.kamas[kama.id] = kama;
            this.threadIdToKamaId[threadId] = kama.id;
            this.saveKamas();
            
            return kama;
        },
        
        // Identify root desire for a Kama
        identifyRootDesire(kamaId, desireId) {
            const kama = this.kamas[kamaId];
            const desire = this.rootDesires.find(d => d.id === desireId);
            
            if (kama && desire) {
                kama.rootDesire = desire;
                kama.state = 'identified';
                this.saveKamas();
                return true;
            }
            return false;
        },
        
        // Move NUT from klesha to samskara queue
        moveToSamskara(kamaId, nutId) {
            const kama = this.kamas[kamaId];
            if (!kama) throw new Error("Kama not found");
            if (!kama.rootDesire) throw new Error("Must identify root desire first");
            
            // Remove from klesha queue
            const index = kama.kleshaNutIds.indexOf(nutId);
            if (index > -1) {
                kama.kleshaNutIds.splice(index, 1);
                
                // Add to samskara queue if not already there
                if (!kama.samskaraNutIds.includes(nutId)) {
                    kama.samskaraNutIds.push(nutId);
                }
                
                // Update state if building
                if (kama.state === 'identified') {
                    kama.state = 'building';
                }
                
                this.saveKamas();
                this.verifyKamaInvariant(kama);
                return true;
            }
            return false;
        },
        
        // Move NUT back to klesha queue
        moveToKlesha(kamaId, nutId) {
            const kama = this.kamas[kamaId];
            if (!kama) throw new Error("Kama not found");
            
            // Remove from samskara queue
            const index = kama.samskaraNutIds.indexOf(nutId);
            if (index > -1) {
                kama.samskaraNutIds.splice(index, 1);
                
                // Add back to klesha queue if not already there
                if (!kama.kleshaNutIds.includes(nutId)) {
                    kama.kleshaNutIds.push(nutId);
                }
                
                this.saveKamas();
                this.verifyKamaInvariant(kama);
                return true;
            }
            return false;
        },
        
        // Check if Kama has complete samskara chain
        hasCompleteSamskara(kamaId) {
            const kama = this.kamas[kamaId];
            if (!kama || kama.samskaraNutIds.length === 0) return false;
            
            const appStore = Alpine.store('app');
            const samskaraNuts = kama.samskaraNutIds.map(id => 
                appStore.nuts.find(n => n.id === id)
            ).filter(Boolean);
            
            const types = samskaraNuts.map(n => n.type);
            return types.includes('note') && 
                   types.includes('urge') && 
                   types.includes('task');
        },
        
        // Get samskara nuts for a Kama
        getSamskaraNuts(kamaId) {
            const kama = this.kamas[kamaId];
            if (!kama) return [];
            
            const appStore = Alpine.store('app');
            return kama.samskaraNutIds.map(id => 
                appStore.nuts.find(n => n.id === id)
            ).filter(Boolean);
        },
        
        // Get klesha nuts for a Kama
        getKleshaNuts(kamaId) {
            const kama = this.kamas[kamaId];
            if (!kama) return [];
            
            const appStore = Alpine.store('app');
            return kama.kleshaNutIds.map(id => 
                appStore.nuts.find(n => n.id === id)
            ).filter(Boolean);
        },
        
        // Create seal for Kama
        createSeal(kamaId) {
            const kama = this.kamas[kamaId];
            if (!kama || !this.hasCompleteSamskara(kamaId)) {
                return { success: false, message: 'Incomplete samskara chain' };
            }
            
            const appStore = Alpine.store('app');
            
            // Find the task in samskara chain
            const task = this.getSamskaraNuts(kamaId).find(n => n.type === 'task');
            
            if (task) {
                // Mark task as extraction trigger
                task.extractionReady = true;
                kama.sealCreated = true;
                kama.sealTask = task.id;
                kama.state = 'sealed';
                
                appStore.saveNuts();
                this.saveKamas();
                
                return { 
                    success: true, 
                    message: `Seal created! Complete "${task.content}" to extract the ${kama.rootDesire.name} Kama.`,
                    task: task
                };
            }
            
            return { success: false, message: 'No task found in samskara chain' };
        },
        
        // Complete extraction
        completeExtraction(taskId) {
            const appStore = Alpine.store('app');
            const task = appStore.nuts.find(n => n.id === taskId);
            
            if (!task || !task.extractionReady) {
                return { success: false, message: 'Task not ready for extraction' };
            }
            
            // Find Kama by seal task
            const kama = Object.values(this.kamas).find(k => k.sealTask === taskId);
            
            if (kama) {
                // Mark Kama as extracted
                kama.state = 'extracted';
                kama.completedAt = new Date().toISOString();
                
                // Track extraction
                const extraction = {
                    id: Date.now().toString(),
                    kamaId: kama.id,
                    threadId: kama.threadId,
                    kamaType: kama.rootDesire.id,
                    kamaName: kama.rootDesire.name,
                    extractedAt: new Date().toISOString()
                };
                
                this.extractions.push(extraction);
                this.saveExtractions();
                
                // Update Kama stats
                this.updateKamaStats(kama.rootDesire.id);
                
                // Mark task as completed
                task.completed = true;
                
                // Mark thread as completed
                const threadStore = Alpine.store('threads');
                const thread = threadStore.getThread(kama.threadId);
                if (thread) {
                    thread.completed = true;
                    thread.completedAt = new Date().toISOString();
                    threadStore.saveThreads();
                }
                
                this.saveKamas();
                appStore.saveNuts();
                
                return {
                    success: true,
                    message: `${kama.rootDesire.name} Kama has been satisfied!`,
                    extraction: extraction
                };
            }
            
            return { success: false, message: 'Kama not found' };
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