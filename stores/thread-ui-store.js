// Thread UI Store - UI State Only (No Business Logic)
// This store manages UI state like what's selected, what's open, drag state, etc.

document.addEventListener('alpine:init', () => {
    Alpine.store('threadUI', {
        // View state
        currentView: 'timeline', // 'timeline' | 'thread' | 'battle'
        filter: 'all', // 'all' | 'unthreaded' | 'kleshas' | 'library'
        
        // Selection state
        selectedThreadId: null,
        selectedNutId: null,
        
        // Modal state
        showIdentifyModal: false,
        showExtractionModal: false,
        showKamaProfileModal: false,
        
        // Drag and drop state
        draggedNutId: null,
        dragOverZone: null, // 'klesha' | 'samskara' | null
        isDragging: false,
        
        // Input state
        newNutContent: '',
        newNutType: 'note',
        isCapturing: false,
        
        // Animation state
        extractionAnimating: false,
        sealCreatingAnimating: false,
        
        // Loading states
        threadsLoading: false,
        nutsLoading: false,
        syncInProgress: false,
        
        // Error states
        lastError: null,
        showError: false,
        
        // Mobile-specific UI state
        mobileMenuOpen: false,
        bottomSheetOpen: false,
        
        // Expansion states for accordion-like UI
        expandedThreadIds: new Set(),
        expandedNutIds: new Set(),
        
        // View helpers
        get isTimelineView() {
            return this.currentView === 'timeline';
        },
        
        get isThreadView() {
            return this.currentView === 'thread';
        },
        
        get isBattleView() {
            return this.currentView === 'battle';
        },
        
        // Navigation methods
        openThread(threadId) {
            this.selectedThreadId = threadId;
            this.currentView = 'thread';
            // Use nextTick to ensure DOM updates before scrolling
            if (window.scrollTo) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
        
        closeThread() {
            this.selectedThreadId = null;
            this.currentView = 'timeline';
        },
        
        openBattle(threadId) {
            this.selectedThreadId = threadId;
            this.currentView = 'battle';
        },
        
        // Selection methods
        selectNut(nutId) {
            this.selectedNutId = nutId;
            this.expandedNutIds.add(nutId);
        },
        
        deselectNut() {
            this.selectedNutId = null;
        },
        
        // Expansion methods
        toggleThreadExpanded(threadId) {
            if (this.expandedThreadIds.has(threadId)) {
                this.expandedThreadIds.delete(threadId);
            } else {
                this.expandedThreadIds.add(threadId);
            }
        },
        
        isThreadExpanded(threadId) {
            return this.expandedThreadIds.has(threadId);
        },
        
        // Drag and drop UI methods
        startDrag(nutId) {
            this.draggedNutId = nutId;
            this.isDragging = true;
        },
        
        endDrag() {
            this.draggedNutId = null;
            this.dragOverZone = null;
            this.isDragging = false;
        },
        
        setDragOverZone(zone) {
            this.dragOverZone = zone;
        },
        
        // Modal control
        openIdentifyModal() {
            this.showIdentifyModal = true;
        },
        
        closeIdentifyModal() {
            this.showIdentifyModal = false;
        },
        
        openExtractionModal() {
            this.showExtractionModal = true;
        },
        
        closeExtractionModal() {
            this.showExtractionModal = false;
        },
        
        // Input control
        startCapture(type = 'note') {
            this.newNutType = type;
            this.isCapturing = true;
            this.focusInput();
        },
        
        cancelCapture() {
            this.newNutContent = '';
            this.isCapturing = false;
        },
        
        // Filter control
        setFilter(filter) {
            this.filter = filter;
        },
        
        // Error handling
        showErrorMessage(message) {
            this.lastError = message;
            this.showError = true;
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                this.showError = false;
            }, 5000);
        },
        
        clearError() {
            this.lastError = null;
            this.showError = false;
        },
        
        // Animation triggers
        startExtractionAnimation() {
            this.extractionAnimating = true;
            
            // Animation duration
            setTimeout(() => {
                this.extractionAnimating = false;
            }, 3000);
        },
        
        startSealAnimation() {
            this.sealCreatingAnimating = true;
            
            setTimeout(() => {
                this.sealCreatingAnimating = false;
            }, 2000);
        },
        
        // Loading states
        setThreadsLoading(loading) {
            this.threadsLoading = loading;
        },
        
        setNutsLoading(loading) {
            this.nutsLoading = loading;
        },
        
        setSyncInProgress(syncing) {
            this.syncInProgress = syncing;
        },
        
        // Mobile UI helpers
        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
        },
        
        openBottomSheet() {
            this.bottomSheetOpen = true;
        },
        
        closeBottomSheet() {
            this.bottomSheetOpen = false;
        },
        
        // Utility methods
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        
        focusInput() {
            // Focus the NUT input after a slight delay for UI update
            setTimeout(() => {
                const input = document.querySelector('[data-nut-input]');
                if (input) {
                    input.focus();
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        },
        
        // Reset all UI state
        resetUI() {
            this.currentView = 'timeline';
            this.filter = 'all';
            this.selectedThreadId = null;
            this.selectedNutId = null;
            this.showIdentifyModal = false;
            this.showExtractionModal = false;
            this.draggedNutId = null;
            this.dragOverZone = null;
            this.isDragging = false;
            this.newNutContent = '';
            this.newNutType = 'note';
            this.isCapturing = false;
            this.expandedThreadIds.clear();
            this.expandedNutIds.clear();
        }
    });
});