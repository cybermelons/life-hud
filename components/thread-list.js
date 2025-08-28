// Thread List Component - Timeline View
// Uses thread store for data and threadUI store for UI state

document.addEventListener('alpine:init', () => {
    Alpine.data('threadList', () => ({
        // Long press detection
        longPressTimer: null,
        
        // Component initialization
        init() {
            // Component is purely presentational, stores handle data
        },
        
        // Computed properties that combine store data
        get threads() {
            const threadStore = Alpine.store('threads');
            const uiStore = Alpine.store('threadUI');
            
            // Filter threads based on UI filter
            let filtered = threadStore.threads;
            
            if (uiStore.filter === 'kleshas') {
                filtered = filtered.filter(t => t.klesha);
            } else if (uiStore.filter === 'completed') {
                filtered = filtered.filter(t => t.completed);
            }
            
            // Add computed preview for each thread
            return filtered.map(thread => ({
                ...thread,
                preview: this.getThreadPreview(thread),
                nutCount: thread.nutIds ? thread.nutIds.length : 0,
                timestamp: this.getThreadTimestamp(thread)
            }));
        },
        
        get soloNuts() {
            const appStore = Alpine.store('app');
            return appStore.nuts.filter(n => !n.threadId);
        },
        
        // Helper methods
        getThreadPreview(thread) {
            const appStore = Alpine.store('app');
            const firstNutId = thread.nutIds && thread.nutIds[0];
            if (!firstNutId) return 'Empty thread';
            
            const firstNut = appStore.nuts.find(n => n.id === firstNutId);
            if (!firstNut) return 'Empty thread';
            
            const preview = firstNut.content.substring(0, 50);
            return preview + (firstNut.content.length > 50 ? '...' : '');
        },
        
        getThreadTimestamp(thread) {
            const appStore = Alpine.store('app');
            const firstNutId = thread.nutIds && thread.nutIds[0];
            if (!firstNutId) return '';
            
            const firstNut = appStore.nuts.find(n => n.id === firstNutId);
            if (!firstNut) return '';
            
            return this.formatTimestamp(firstNut.timestamp);
        },
        
        formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diff = now - date;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            
            if (hours < 1) {
                const minutes = Math.floor(diff / (1000 * 60));
                return `${minutes}m ago`;
            } else if (hours < 24) {
                return `${hours}h ago`;
            } else {
                return date.toLocaleDateString();
            }
        },
        
        // UI Actions (delegate to stores)
        openThread(thread) {
            Alpine.store('threadUI').openThread(thread.id);
        },
        
        selectNut(nut) {
            Alpine.store('threadUI').selectNut(nut.id);
        },
        
        startNewThread() {
            const threadStore = Alpine.store('threads');
            const thread = threadStore.createThread();
            Alpine.store('threadUI').openThread(thread.id);
        },
        
        toggleFilter(filter) {
            Alpine.store('threadUI').setFilter(filter);
        },
        
        // Check if thread has bonus
        hasBonus(thread) {
            const kamaStore = Alpine.store('kama');
            return thread.klesha && kamaStore.hasCompleteSamskara(thread.id);
        },
        
        // Long press handling for NUT klesha marking
        handleNutMouseDown(nutId, event) {
            // Clear any existing timer
            if (this.longPressTimer) clearTimeout(this.longPressTimer);
            
            // Start long press detection (800ms)
            this.longPressTimer = setTimeout(() => {
                this.markNutAsKlesha(nutId);
                // Haptic feedback if available
                if (navigator.vibrate) navigator.vibrate(50);
            }, 800);
            
            // Prevent context menu on mobile
            event.preventDefault();
        },
        
        handleNutMouseUp() {
            // Clear timer if mouse/touch released
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
            }
        },
        
        handleNutMouseLeave() {
            // Clear timer if mouse leaves element
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
            }
        },
        
        // Mark NUT as klesha with confirmation
        markNutAsKlesha(nutId) {
            const appStore = Alpine.store('app');
            const threadStore = Alpine.store('threads');
            const uiStore = Alpine.store('threadUI');
            
            // Show confirmation modal
            const nut = appStore.nuts.find(n => n.id === nutId);
            if (!nut) return;
            
            // Mark as klesha
            appStore.markNutKlesha(nutId);
            
            // Find the thread containing this NUT
            const thread = threadStore.threads.find(t => t.nutIds && t.nutIds.includes(nutId));
            if (thread) {
                // If thread is now tainted, it might switch to battle view
                if (threadStore.isThreadTainted(thread.id)) {
                    // Show klesha marking animation
                    uiStore.showKleshaAnimation = true;
                    setTimeout(() => {
                        uiStore.showKleshaAnimation = false;
                    }, 1500);
                }
            }
        },
        
        // Check if NUT is klesha
        isNutKlesha(nutId) {
            return Alpine.store('app').isNutKlesha(nutId);
        },
        
        // Check if thread is tainted
        isThreadTainted(threadId) {
            return Alpine.store('threads').isThreadTainted(threadId);
        }
    }));
});