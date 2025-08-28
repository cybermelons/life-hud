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
        
        // Get samskara chain analysis
        getSamskaraChainStatus(kamaId) {
            const kama = this.kamas[kamaId];
            if (!kama) return { complete: false, missing: ['note', 'urge', 'task'] };
            
            const appStore = Alpine.store('app');
            const samskaraNuts = kama.samskaraNutIds.map(id => 
                appStore.nuts.find(n => n.id === id)
            ).filter(Boolean);
            
            const hasNote = samskaraNuts.some(n => n.type === 'note');
            const hasUrge = samskaraNuts.some(n => n.type === 'urge');
            const hasTask = samskaraNuts.some(n => n.type === 'task');
            
            const missing = [];
            if (!hasNote) missing.push('note');
            if (!hasUrge) missing.push('urge');
            if (!hasTask) missing.push('task');
            
            return {
                complete: hasNote && hasUrge && hasTask,
                hasNote,
                hasUrge,
                hasTask,
                missing,
                nuts: samskaraNuts,
                pattern: `${hasNote ? 'N' : '_'}→${hasUrge ? 'U' : '_'}→${hasTask ? 'T' : '_'}`
            };
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
            const chainStatus = this.getSamskaraChainStatus(kamaId);
            
            if (!kama || !chainStatus.complete) {
                return { 
                    success: false, 
                    message: `Incomplete samskara chain. Missing: ${chainStatus.missing.join(', ')}`,
                    chainStatus
                };
            }
            
            const appStore = Alpine.store('app');
            
            // Find the NUTs in samskara chain
            const note = chainStatus.nuts.find(n => n.type === 'note');
            const urge = chainStatus.nuts.find(n => n.type === 'urge');
            const task = chainStatus.nuts.find(n => n.type === 'task');
            
            if (task) {
                // Create seal data
                const seal = {
                    id: `seal_${Date.now()}`,
                    kamaId: kamaId,
                    createdAt: new Date().toISOString(),
                    noteContent: note?.content || '',
                    urgeContent: urge?.content || '',
                    taskContent: task.content,
                    taskId: task.id,
                    pattern: chainStatus.pattern,
                    rootDesire: kama.rootDesire
                };
                
                // Mark task as extraction trigger
                task.extractionReady = true;
                task.sealId = seal.id;
                
                // Update Kama state
                kama.sealCreated = true;
                kama.sealTask = task.id;
                kama.seal = seal;
                kama.state = 'sealed';
                
                appStore.saveNuts();
                this.saveKamas();
                
                return { 
                    success: true, 
                    message: `Seal created! Complete "${task.content}" to extract the ${kama.rootDesire.name} Kama.`,
                    task: task,
                    seal: seal,
                    chainStatus
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
                // Calculate extraction power based on chain quality
                const chainStatus = this.getSamskaraChainStatus(kama.id);
                const extractionPower = this.calculateExtractionPower(kama);
                
                // Mark Kama as extracted
                kama.state = 'extracted';
                kama.completedAt = new Date().toISOString();
                kama.extractionPower = extractionPower;
                
                // Generate wisdom from the extraction
                const wisdom = this.generateWisdom(kama);
                
                // Track extraction with details
                const extraction = {
                    id: Date.now().toString(),
                    kamaId: kama.id,
                    threadId: kama.threadId,
                    kamaType: kama.rootDesire.id,
                    kamaName: kama.rootDesire.name,
                    extractedAt: new Date().toISOString(),
                    power: extractionPower,
                    wisdom: wisdom,
                    seal: kama.seal,
                    chainPattern: chainStatus.pattern
                };
                
                this.extractions.push(extraction);
                this.saveExtractions();
                
                // Update Kama stats with extraction details
                this.updateKamaStats(kama.rootDesire.id, extractionPower);
                
                // Mark task as completed
                task.completed = true;
                task.completedAt = new Date().toISOString();
                
                // Mark thread as completed with extraction data
                const threadStore = Alpine.store('threads');
                const thread = threadStore.getThread(kama.threadId);
                if (thread) {
                    thread.completed = true;
                    thread.completedAt = new Date().toISOString();
                    thread.extraction = extraction;
                    threadStore.saveThreads();
                }
                
                this.saveKamas();
                appStore.saveNuts();
                
                return {
                    success: true,
                    message: `${kama.rootDesire.name} Kama has been satisfied! ${wisdom}`,
                    extraction: extraction,
                    wisdom: wisdom,
                    power: extractionPower,
                    rewards: this.getExtractionRewards(kama.rootDesire.id)
                };
            }
            
            return { success: false, message: 'Kama not found' };
        },
        
        // Calculate extraction power based on chain quality
        calculateExtractionPower(kama) {
            const baseValue = 10;
            let multiplier = 1;
            
            // More NUTs in samskara = higher power
            if (kama.samskaraNutIds.length > 3) multiplier += 0.5;
            
            // Faster completion = higher power
            const timeElapsed = new Date() - new Date(kama.seal?.createdAt || Date.now());
            const hoursElapsed = timeElapsed / (1000 * 60 * 60);
            if (hoursElapsed < 1) multiplier += 0.5;
            
            // First extraction of this type = bonus
            const stats = this.kamaStats[kama.rootDesire.id];
            if (!stats || stats.extractions === 0) multiplier += 1;
            
            return Math.round(baseValue * multiplier);
        },
        
        // Generate wisdom message from extraction
        generateWisdom(kama) {
            const wisdomMap = {
                vishaya: "Physical cravings often mask deeper needs.",
                kirti: "True recognition comes from within, not from others.",
                bhoga: "Comfort zones prevent growth - discomfort teaches.",
                aishvarya: "Control is an illusion; influence through example.",
                iccha: "Endless wanting ends when we appreciate what is."
            };
            
            return wisdomMap[kama.rootDesire.id] || "Every desire teaches us about ourselves.";
        },
        
        // Get extraction rewards
        getExtractionRewards(kamaType) {
            const stats = this.kamaStats[kamaType] || {};
            const rewards = [];
            
            // STR increase
            rewards.push({ type: 'stat', name: 'STR', value: '+1' });
            
            // Bond increase
            if (stats.bond) {
                rewards.push({ type: 'bond', name: `${kamaType} Bond`, value: `${stats.bond}%` });
            }
            
            // Totem unlock at 5 extractions
            if (stats.extractions === 4) {
                rewards.push({ type: 'unlock', name: `${kamaType} Totem`, value: 'UNLOCKED!' });
            }
            
            return rewards;
        },
        
        // Update Kama stats after extraction
        updateKamaStats(kamaType, extractionPower = 10) {
            if (!this.kamaStats[kamaType]) {
                this.kamaStats[kamaType] = {
                    encounters: 0,
                    extractions: 0,
                    totalPower: 0,
                    lastExtraction: null,
                    bond: 0,
                    hunger: 50,
                    level: 1
                };
            }
            
            const stats = this.kamaStats[kamaType];
            stats.encounters++;
            stats.extractions++;
            stats.totalPower = (stats.totalPower || 0) + extractionPower;
            stats.lastExtraction = new Date().toISOString();
            
            // Bond increases based on extraction power
            const bondIncrease = Math.min(30, 10 + extractionPower);
            stats.bond = Math.min(100, stats.bond + bondIncrease);
            
            // Hunger decreases significantly
            stats.hunger = Math.max(0, stats.hunger - 50);
            
            // Level up every 50 total power
            stats.level = Math.floor(stats.totalPower / 50) + 1;
            
            // Check for totem creation (5 extractions)
            if (stats.extractions === 5) {
                stats.totemCreated = true;
                stats.totemCreatedAt = new Date().toISOString();
            }
            
            // Achievement unlocks
            if (stats.extractions === 1) stats.firstExtraction = true;
            if (stats.extractions === 10) stats.masterExtractor = true;
            if (stats.bond >= 100) stats.maxBond = true;
            
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