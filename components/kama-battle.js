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
        
        // Get klesha lane nuts
        get kleshaLane() {
            const kamaStore = Alpine.store('kama');
            const uiStore = Alpine.store('threadUI');
            return kamaStore.getKleshaNuts(uiStore.selectedThreadId);
        },
        
        // Get samskara lane nuts
        get samskaraLane() {
            const kamaStore = Alpine.store('kama');
            const uiStore = Alpine.store('threadUI');
            return kamaStore.getSamskaraNuts(uiStore.selectedThreadId);
        },
        
        // Check samskara completion
        get hasCompleteSamskara() {
            const kamaStore = Alpine.store('kama');
            const uiStore = Alpine.store('threadUI');
            return kamaStore.hasCompleteSamskara(uiStore.selectedThreadId);
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
            if (!this.selectedDesire) return;
            
            const kamaStore = Alpine.store('kama');
            const uiStore = Alpine.store('threadUI');
            
            const success = kamaStore.identifyRootDesire(
                uiStore.selectedThreadId, 
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
            
            const uiStore = Alpine.store('threadUI');
            const kamaStore = Alpine.store('kama');
            const nutId = uiStore.draggedNutId;
            
            if (nutId) {
                kamaStore.moveToSamskara(nutId, uiStore.selectedThreadId);
                uiStore.endDrag();
            }
        },
        
        dropInKlesha(event) {
            event.preventDefault();
            
            const uiStore = Alpine.store('threadUI');
            const kamaStore = Alpine.store('kama');
            const nutId = uiStore.draggedNutId;
            
            if (nutId) {
                kamaStore.moveToKlesha(nutId, uiStore.selectedThreadId);
                uiStore.endDrag();
            }
        },
        
        // Create seal
        createSeal() {
            const kamaStore = Alpine.store('kama');
            const uiStore = Alpine.store('threadUI');
            
            const result = kamaStore.createSeal(uiStore.selectedThreadId);
            
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
            if (!this.currentThread || !this.currentThread.rootDesire) return null;
            
            const kamaStore = Alpine.store('kama');
            const stats = kamaStore.kamaStats[this.currentThread.rootDesire.id];
            
            return {
                ...this.currentThread.rootDesire,
                hunger: stats ? kamaStore.getKamaHunger(this.currentThread.rootDesire.id) : 50,
                bond: stats ? stats.bond : 0,
                extractions: stats ? stats.extractions : 0
            };
        },
        
        // Check if can identify desire (need 3+ NUTs)
        get canIdentifyDesire() {
            return this.currentThread && 
                   this.currentThread.klesha && 
                   !this.currentThread.rootDesire &&
                   this.currentThread.nutIds && 
                   this.currentThread.nutIds.length >= 3;
        }
    }));
});