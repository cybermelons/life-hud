// Kama Battle Component - Two-lane klesha/samskara interface
// Uses kama store for battle logic and threadUI store for UI state

document.addEventListener('alpine:init', () => {
    Alpine.data('kamaBattle', () => ({
        // Component state
        selectedDesire: null,
        
        // Get current thread from stores
        get currentThread() {
            const threadStore = Alpine.store('threads');
            const uiStore = Alpine.store('threadUI');
            return threadStore.getThread(uiStore.selectedThreadId);
        },
        
        // Get current Kama (if thread is tainted)
        get currentKama() {
            if (!this.currentThread) return null;
            
            const threadStore = Alpine.store('threads');
            const kamaStore = Alpine.store('kama');
            
            // Only get/create Kama if thread is tainted
            if (threadStore.isThreadTainted(this.currentThread.id)) {
                return kamaStore.ensureKamaForThread(this.currentThread.id);
            }
            return null;
        },
        
        // Check if should show battle view
        get showBattleView() {
            return this.currentKama !== null;
        },
        
        // Check if should show samskara zone (root desire identified)
        get showSamskaraZone() {
            return this.currentKama && this.currentKama.rootDesire;
        },
        
        // Get klesha lane nuts
        get kleshaLane() {
            if (!this.currentKama) return [];
            const kamaStore = Alpine.store('kama');
            return kamaStore.getKleshaNuts(this.currentKama.id);
        },
        
        // Get samskara lane nuts
        get samskaraLane() {
            if (!this.currentKama) return [];
            const kamaStore = Alpine.store('kama');
            return kamaStore.getSamskaraNuts(this.currentKama.id);
        },
        
        // Check samskara completion
        get hasCompleteSamskara() {
            if (!this.currentKama) return false;
            const kamaStore = Alpine.store('kama');
            return kamaStore.hasCompleteSamskara(this.currentKama.id);
        },
        
        // Get root desires from store
        get rootDesires() {
            return Alpine.store('kama').rootDesires;
        },
        
        // Check which NUT types are in samskara
        hasSamskaraType(type) {
            return this.samskaraLane.some(n => n.type === type);
        },
        
        // Get next needed samskara type
        nextSamskaraType() {
            if (!this.hasSamskaraType('note')) return 'Note';
            if (!this.hasSamskaraType('urge')) return 'Urge';
            if (!this.hasSamskaraType('task')) return 'Task';
            return '';
        },
        
        // Mark thread as klesha
        markKlesha() {
            const threadStore = Alpine.store('threads');
            const uiStore = Alpine.store('threadUI');
            threadStore.markThreadKlesha(uiStore.selectedThreadId);
        },
        
        // Open identify modal
        openIdentifyModal() {
            Alpine.store('threadUI').openIdentifyModal();
        },
        
        // Identify root desire
        identifyRootDesire() {
            if (!this.selectedDesire || !this.currentKama) return;
            
            const kamaStore = Alpine.store('kama');
            const uiStore = Alpine.store('threadUI');
            
            const success = kamaStore.identifyRootDesire(
                this.currentKama.id, 
                this.selectedDesire
            );
            
            if (success) {
                uiStore.closeIdentifyModal();
                this.selectedDesire = null;
            }
        },
        
        // Drag and drop handlers
        dragStart(event, nut) {
            const uiStore = Alpine.store('threadUI');
            uiStore.startDrag(nut.id);
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', nut.id);
        },
        
        dragEnd() {
            Alpine.store('threadUI').endDrag();
        },
        
        dragOver(event, zone) {
            event.preventDefault();
            Alpine.store('threadUI').setDragOverZone(zone);
        },
        
        dragLeave() {
            Alpine.store('threadUI').setDragOverZone(null);
        },
        
        dropInSamskara(event) {
            event.preventDefault();
            
            if (!this.currentKama) return;
            
            const uiStore = Alpine.store('threadUI');
            const kamaStore = Alpine.store('kama');
            const nutId = uiStore.draggedNutId;
            
            if (nutId) {
                kamaStore.moveToSamskara(this.currentKama.id, nutId);
                uiStore.endDrag();
            }
        },
        
        dropInKlesha(event) {
            event.preventDefault();
            
            if (!this.currentKama) return;
            
            const uiStore = Alpine.store('threadUI');
            const kamaStore = Alpine.store('kama');
            const nutId = uiStore.draggedNutId;
            
            if (nutId) {
                kamaStore.moveToKlesha(this.currentKama.id, nutId);
                uiStore.endDrag();
            }
        },
        
        // Create seal
        createSeal() {
            if (!this.currentKama) return;
            
            const kamaStore = Alpine.store('kama');
            const uiStore = Alpine.store('threadUI');
            
            const result = kamaStore.createSeal(this.currentKama.id);
            
            if (result.success) {
                uiStore.startSealAnimation();
                
                // Show success message
                setTimeout(() => {
                    alert(result.message);
                }, 2000);
            } else {
                uiStore.showErrorMessage(result.message);
            }
        },
        
        // Complete extraction
        completeTask(taskId) {
            const kamaStore = Alpine.store('kama');
            const uiStore = Alpine.store('threadUI');
            
            const result = kamaStore.completeExtraction(taskId);
            
            if (result.success) {
                uiStore.startExtractionAnimation();
                
                // Show extraction success after animation
                setTimeout(() => {
                    uiStore.openExtractionModal();
                }, 3000);
            } else {
                uiStore.showErrorMessage(result.message);
            }
        },
        
        // Add new NUT to samskara
        addSamskaraNut(type) {
            const appStore = Alpine.store('app');
            const threadStore = Alpine.store('threads');
            const uiStore = Alpine.store('threadUI');
            
            // Switch to capture mode for specific type
            uiStore.startCapture(type);
            
            // Note: The actual NUT creation will be handled by the NUT capture component
            // This just sets up the UI state
        },
        
        // Get Kama info for current thread
        get currentKamaInfo() {
            if (!this.currentKama || !this.currentKama.rootDesire) return null;
            
            const kamaStore = Alpine.store('kama');
            const stats = kamaStore.kamaStats[this.currentKama.rootDesire.id];
            
            return {
                ...this.currentKama.rootDesire,
                hunger: stats ? kamaStore.getKamaHunger(this.currentKama.rootDesire.id) : 50,
                bond: stats ? stats.bond : 0,
                extractions: stats ? stats.extractions : 0
            };
        },
        
        // Check if can identify desire (need to be tainted but no root desire yet)
        get canIdentifyDesire() {
            return this.currentKama && 
                   !this.currentKama.rootDesire &&
                   this.currentThread && 
                   this.currentThread.nutIds && 
                   this.currentThread.nutIds.length >= 1;
        }
    }));
});