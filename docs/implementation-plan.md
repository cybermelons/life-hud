# Kama Battle MVP - Implementation Plan

## Quick Start for Developer

This document provides the exact implementation steps to complete the Kama Battle MVP in 3 days. The architecture is ready, you just need to wire up the game flow.

## Current State ✅

Already implemented:
- Modular stores: `thread-store.js`, `kama-store.js`, `thread-ui-store.js`
- Components: `thread-list.js`, `kama-battle.js`
- UI: `threads-v2.html` with two-lane interface
- Drag-and-drop between lanes

## Implementation Checklist

### Day 1: Core State Machine (8 hours)

#### Morning (4 hours)
- [ ] **1.1 Thread Auto-Creation** (1 hour)
  - When NUT is captured, auto-create thread if temporal proximity
  - Update `thread-store.js` → `autoThreadNuts()` to trigger on NUT add
  - Show in timeline view immediately

- [ ] **1.2 Klesha Marking** (1.5 hours)
  - Add long-press detection to thread cards
  - Show red overlay with confirm/cancel
  - Update thread state to `klesha: true`
  - Move thread to left lane visually

- [ ] **1.3 Root Desire Selection** (1.5 hours)
  - Show 5 Kama types when klesha marked
  - Update modal in `threads-v2.html`
  - Save selection to thread: `rootDesire: kamaType`

#### Afternoon (4 hours)
- [ ] **1.4 State Transitions** (2 hours)
  - Implement state machine in `kama-store.js`
  - Valid states: `fresh`, `klesha`, `identified`, `building`, `sealed`, `completed`
  - Add transition validation

- [ ] **1.5 LocalStorage Persistence** (2 hours)
  - Ensure all state changes save to localStorage
  - Test persistence across page refreshes
  - Add error handling for storage quota

### Day 2: Battle Mechanics (8 hours)

#### Morning (4 hours)
- [ ] **2.1 Samskara Building UI** (2 hours)
  - Show construction animation when moving to samskara lane
  - Add progress indicator (Note → Urge → Task)
  - Visual feedback for each NUT type added

- [ ] **2.2 Seal Creation Modal** (2 hours)
  - Create 3-step modal: Observe → Reframe → Act
  - Generate task from "Act" step
  - Store seal data with thread

#### Afternoon (4 hours)
- [ ] **2.3 Task Generation** (1.5 hours)
  - Create task from seal "Act" step
  - Add to thread as `sealTask`
  - Show task in UI with checkbox

- [ ] **2.4 Extraction Sequence** (2.5 hours)
  - Implement victory animation on task completion
  - Update Kama stats (+1 extraction)
  - Show "+1 STR" notification
  - Mark thread as `completed`

### Day 3: Polish & Testing (8 hours)

#### Morning (4 hours)
- [ ] **3.1 Mobile Gestures** (2 hours)
  - Fine-tune long-press timing (800ms)
  - Add haptic feedback where available
  - Ensure touch targets are 44px minimum

- [ ] **3.2 Visual Polish** (2 hours)
  - Add CSS transitions for state changes
  - Implement color coding: red (klesha), purple (samskara), gold (extracted)
  - Add loading states and error handling

#### Afternoon (4 hours)
- [ ] **3.3 End-to-End Testing** (2 hours)
  - Follow test script in implementation guide
  - Fix any blocking bugs
  - Ensure core loop completes

- [ ] **3.4 Deploy & Document** (2 hours)
  - Deploy to Cloudflare Workers
  - Update README with game instructions
  - Create simple onboarding flow

## Code Integration Points

### 1. Thread State Machine

In `kama-store.js`, add:
```javascript
transitionThread(threadId, newState) {
  const validTransitions = {
    fresh: ['klesha', 'archived'],
    klesha: ['identified'],
    identified: ['building'],
    building: ['sealed'],
    sealed: ['completed'],
    completed: ['extracted']
  };
  
  const thread = this.getThread(threadId);
  const currentState = thread.state || 'fresh';
  
  if (validTransitions[currentState]?.includes(newState)) {
    thread.state = newState;
    this.saveThreads();
    return true;
  }
  return false;
}
```

### 2. Klesha Marking

In `thread-list.js` component:
```javascript
handleLongPress(thread) {
  if (this.longPressTimer) clearTimeout(this.longPressTimer);
  
  this.longPressTimer = setTimeout(() => {
    if (navigator.vibrate) navigator.vibrate(50);
    Alpine.store('threadUI').showKleshaConfirm = true;
    Alpine.store('threadUI').threadToMark = thread.id;
  }, 800);
}
```

### 3. Extraction Victory

In `kama-battle.js`:
```javascript
completeExtraction(taskId) {
  const result = Alpine.store('kama').completeExtraction(taskId);
  
  if (result.success) {
    // Start victory sequence
    Alpine.store('threadUI').startExtractionAnimation();
    
    // Show notification
    setTimeout(() => {
      this.showVictoryNotification('+1 STR gained!');
    }, 2000);
    
    // Mark thread gold
    setTimeout(() => {
      this.markThreadGolden(threadId);
    }, 3000);
  }
}
```

## UI States Reference

### Thread Visual States
```css
/* Fresh thread */
.thread-fresh {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Klesha marked */
.thread-klesha {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: 2px solid rgba(239, 68, 68, 0.5);
}

/* Building samskara */
.thread-building {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  animation: pulse 2s infinite;
}

/* Extracted wisdom */
.thread-extracted {
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  box-shadow: 0 0 20px rgba(246, 211, 101, 0.5);
}
```

## Testing Checklist

### Core Loop Verification
- [ ] Can capture NUT
- [ ] Thread appears in timeline
- [ ] Can mark as klesha (long-press)
- [ ] Can select root desire (5 options)
- [ ] Can drag to samskara lane
- [ ] Can create seal (3 steps)
- [ ] Task appears from seal
- [ ] Can complete task
- [ ] Extraction animation plays
- [ ] Thread turns golden
- [ ] Data persists on refresh

### Mobile Testing
- [ ] Works on iPhone Safari
- [ ] Works on Android Chrome
- [ ] Touch targets adequate
- [ ] No scroll jank
- [ ] Animations smooth

## Common Issues & Solutions

### Issue: Drag-drop not working on mobile
**Solution**: Use touch events instead of drag events for mobile
```javascript
element.addEventListener('touchstart', handleTouchStart);
element.addEventListener('touchmove', handleTouchMove);
element.addEventListener('touchend', handleTouchEnd);
```

### Issue: State not persisting
**Solution**: Call `saveThreads()` after every state change
```javascript
// Always save after mutation
thread.state = newState;
this.saveThreads(); // Don't forget this!
```

### Issue: Animation janky
**Solution**: Use CSS transforms, not position changes
```css
/* Good - uses GPU */
transform: translateX(100px);

/* Bad - causes reflow */
left: 100px;
```

## Success Criteria

The MVP is complete when:
1. ✅ User can complete full game loop (NUT → Extraction)
2. ✅ Data persists across sessions
3. ✅ Works on mobile (320px minimum width)
4. ✅ Core loop takes < 5 minutes to complete
5. ✅ Extraction feels satisfying (visual + haptic feedback)

## Ship It!

Once core loop works end-to-end, deploy immediately. Polish can happen in v2. The goal is to test if the game mechanic is engaging, not to build a perfect app.

Remember: **Ship weekly, iterate based on feedback!**