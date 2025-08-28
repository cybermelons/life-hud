# Kama Battle MVP - Complete Game Flow Implementation

## Quick Reference: The Core Loop

```
1. User captures NUT → Auto-thread if similar
2. Long-press thread → Mark as Klesha (corrupted)
3. Identify root Kama type (5 options)
4. Drag NUTs to samskara lane → Build N→U→T chain
5. Create seal when chain complete
6. Complete the task from seal
7. EXTRACTION! → Kama satisfied, wisdom gained
```

## Detailed Implementation States

### State 1: Thread in Timeline

**Visual**:
```css
.thread-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thread-card:active {
  scale: 0.98;
}
```

**Interaction**:
- **Tap**: Navigate to thread detail
- **Long-press (800ms)**: Show context menu
  ```javascript
  let longPressTimer;
  
  handleTouchStart(e) {
    longPressTimer = setTimeout(() => {
      navigator.vibrate?.(50);
      this.showContextMenu();
    }, 800);
  }
  
  handleTouchEnd() {
    clearTimeout(longPressTimer);
  }
  ```

### State 2: Klesha Marking

**Animation Sequence**:
```javascript
async markAsKlesha(threadId) {
  const thread = document.querySelector(`[data-thread="${threadId}"]`);
  
  // 1. Flash red (200ms)
  thread.classList.add('flash-red');
  await sleep(200);
  
  // 2. Corruption spread (800ms)
  thread.classList.add('corruption-spread');
  await sleep(800);
  
  // 3. Scanner effect (500ms)
  thread.classList.add('scanner-sweep');
  await sleep(500);
  
  // 4. Final state
  thread.classList.add('klesha-marked');
  thread.innerHTML += '<span class="klesha-icon">⚠️</span>';
}
```

**CSS Classes**:
```css
@keyframes corruption-spread {
  0% { background: var(--normal); }
  100% { background: linear-gradient(135deg, #f093fb, #f5576c); }
}

.klesha-marked {
  border: 2px solid rgba(239, 68, 68, 0.5);
  animation: pulse-red 2s infinite;
}
```

### State 3: Root Desire Identification

**Modal UI**:
```html
<div class="identify-modal" x-show="showIdentifyModal">
  <h3>Corruption Analysis</h3>
  <div class="progress-bar">
    <div class="scan-progress" style="width: 80%"></div>
  </div>
  
  <div class="kama-options">
    <label class="kama-option recommended">
      <input type="radio" name="kama" value="kirti">
      <span class="icon">👑</span>
      <span class="name">Kirti</span>
      <span class="desc">Recognition hunger</span>
      <span class="confidence">80% match</span>
    </label>
    <!-- 4 more options -->
  </div>
  
  <button @click="confirmKama()">🔮 REVEAL KAMA</button>
</div>
```

**AI Pre-selection**:
```javascript
analyzeKamaType(threadContent) {
  const patterns = {
    vishaya: ['scroll', 'watch', 'consume', 'stimulation'],
    kirti: ['likes', 'validation', 'recognition', 'compare'],
    bhoga: ['avoid', 'escape', 'comfort', 'procrastinate'],
    aishvarya: ['control', 'perfect', 'manage', 'organize'],
    iccha: ['want', 'need', 'more', 'never enough']
  };
  
  // Return type with highest keyword matches
  return getMostLikelyKama(threadContent, patterns);
}
```

### State 4: Two-Lane Battle View

**Layout Structure**:
```html
<div class="battle-arena">
  <!-- Kama Avatar -->
  <div class="kama-avatar" data-type="kirti">
    <img src="kama-kirti.svg" class="kama-sprite">
    <div class="kama-dialogue">"Feed me validation..."</div>
  </div>
  
  <!-- Two Lanes -->
  <div class="lanes-container">
    <!-- Klesha Lane (Left) -->
    <div class="lane klesha-lane">
      <h3>⚠️ CORRUPTED</h3>
      <div class="nuts-container" data-lane="klesha">
        <!-- Corrupted NUTs here -->
      </div>
    </div>
    
    <!-- Samskara Lane (Right) -->
    <div class="lane samskara-lane" 
         @dragover.prevent="handleDragOver"
         @drop="handleDrop">
      <h3>✨ PURE</h3>
      <div class="nuts-container" data-lane="samskara">
        <!-- Drag NUTs here -->
      </div>
      <div class="chain-indicator">
        <span :class="hasNote ? 'filled' : ''">N</span>
        <span>→</span>
        <span :class="hasUrge ? 'filled' : ''">U</span>
        <span>→</span>
        <span :class="hasTask ? 'filled' : ''">T</span>
      </div>
    </div>
  </div>
</div>
```

### State 5: Samskara Chain Building

**Drag & Drop Logic**:
```javascript
// In kama-battle.js
handleDragStart(e, nut) {
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('nutId', nut.id);
  this.draggedNut = nut;
  
  // Visual feedback
  e.target.classList.add('dragging');
}

handleDrop(e) {
  e.preventDefault();
  const nutId = e.dataTransfer.getData('nutId');
  
  // Move to samskara
  Alpine.store('kama').moveToSamskara(nutId, this.threadId);
  
  // Check chain completion
  this.checkChainCompletion();
}

checkChainCompletion() {
  const chain = this.samskaraLane;
  const types = chain.map(n => n.type);
  
  if (types.includes('note') && 
      types.includes('urge') && 
      types.includes('task')) {
    this.enableSealCreation();
  }
}
```

**Missing NUT Helper**:
```javascript
suggestMissingNut(type) {
  const suggestions = {
    task: [
      "Take 5 deep breaths",
      "Write in journal for 2 minutes",
      "Text a friend hello",
      "Go for a 5-minute walk"
    ],
    note: [
      "I notice this pattern",
      "This feels familiar",
      "I'm aware of this tendency"
    ],
    urge: [
      "I want to feel connected",
      "I need to slow down",
      "I want genuine fulfillment"
    ]
  };
  
  return suggestions[type][Math.floor(Math.random() * 4)];
}
```

### State 6: Seal Creation

**Ingredient Animation**:
```javascript
async createSeal() {
  const ingredients = this.getIngredients(); // From NUT IDs
  
  // Show preview
  this.showSealPreview(ingredients);
  
  // Animate creation
  await this.animateSealForging();
  
  // Generate task
  const task = this.samskaraLane.find(n => n.type === 'task');
  this.activateTask(task);
}

getIngredients() {
  // Hash NUT IDs to get mystical ingredients
  return this.samskaraLane.map(nut => ({
    type: nut.type,
    ingredient: this.hashToIngredient(nut.id)
  }));
}

hashToIngredient(id) {
  const ingredients = [
    "Phoenix Blood", "Unicorn Tears", "Dragon Wax",
    "Moonstone Dust", "Solar Essence", "Void Crystal"
  ];
  const hash = id.split('').reduce((a,b) => a + b.charCodeAt(0), 0);
  return ingredients[hash % ingredients.length];
}
```

### State 7: Extraction Victory

**The Climactic Animation**:
```javascript
async performExtraction(taskId) {
  const arena = document.querySelector('.battle-arena');
  
  // 1. Buildup (1s)
  arena.classList.add('extraction-buildup');
  await sleep(1000);
  
  // 2. Impact (1s)
  arena.classList.add('extraction-impact');
  navigator.vibrate?.([100, 50, 200]);
  await sleep(1000);
  
  // 3. Separation (2s)
  arena.classList.add('extraction-separation');
  this.playExtractionSound();
  await sleep(2000);
  
  // 4. Satisfaction (1s)
  arena.classList.add('extraction-complete');
  this.showVictoryMessage();
  await sleep(1000);
  
  // Update stats
  Alpine.store('kama').completeExtraction(taskId);
}

showVictoryMessage() {
  const messages = [
    "Kama satisfied! Bond strengthened!",
    "Wisdom extracted! +1 Consciousness",
    "Perfect extraction! Kama devoted!",
    "Incredible! The Kama is yours!"
  ];
  
  // Toast notification
  this.showToast(messages[Math.floor(Math.random() * 4)]);
}
```

**CSS Animations**:
```css
@keyframes extraction-impact {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); filter: brightness(2); }
  100% { transform: scale(1); }
}

@keyframes particle-explosion {
  0% { opacity: 1; transform: scale(0); }
  100% { opacity: 0; transform: scale(3); }
}

.extraction-complete {
  animation: golden-glow 2s ease-out;
  background: linear-gradient(135deg, gold, #ffd700);
}
```

## Mobile Adaptations

### Touch Gesture Map
```javascript
class TouchGestureManager {
  constructor(element) {
    this.element = element;
    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
  }
  
  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.startTime = Date.now();
  }
  
  handleTouchEnd(e) {
    const duration = Date.now() - this.startTime;
    const deltaX = e.changedTouches[0].clientX - this.startX;
    const deltaY = e.changedTouches[0].clientY - this.startY;
    
    if (duration > 800 && Math.abs(deltaX) < 10) {
      // Long press detected
      this.onLongPress();
    } else if (Math.abs(deltaX) > 100) {
      // Swipe detected
      this.onSwipe(deltaX > 0 ? 'right' : 'left');
    }
  }
}
```

### Mobile-Specific CSS
```css
/* Mobile lane layout */
@media (max-width: 480px) {
  .lanes-container {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }
  
  .lane {
    min-width: 100%;
    scroll-snap-align: start;
  }
  
  /* Larger touch targets */
  .nut-card {
    min-height: 60px;
    padding: 12px;
  }
  
  button {
    min-height: 48px;
  }
}
```

## Testing Checklist

### Core Functionality
- [ ] Can capture NUT and see thread
- [ ] Long-press shows context menu
- [ ] Mark klesha works with animation
- [ ] Root desire modal appears after 3 NUTs
- [ ] Can drag NUTs between lanes
- [ ] Chain completion enables seal
- [ ] Task appears from seal
- [ ] Extraction animation plays
- [ ] Stats update correctly
- [ ] Data persists on refresh

### Mobile Testing
- [ ] All gestures work on iOS Safari
- [ ] All gestures work on Android Chrome
- [ ] No accidental triggers
- [ ] Smooth animations (60fps)
- [ ] Text readable at all sizes

### Edge Cases
- [ ] Handle missing NUT types
- [ ] Handle wrong Kama selection
- [ ] Handle abandoned seals
- [ ] Handle offline mode
- [ ] Handle storage quota

## Onboarding Tutorial

### First-Run Detection
```javascript
// In app.js init
if (!localStorage.getItem('tutorial_completed')) {
  this.createTutorialThread();
  this.startTutorial();
}

createTutorialThread() {
  const tutorialNuts = [
    { type: 'urge', content: 'I keep procrastinating', tutorial: true },
    { type: 'note', content: 'I notice avoidance patterns', tutorial: true },
    { type: 'task', content: 'Work for just 5 minutes', tutorial: true }
  ];
  
  // Pre-create thread with these NUTs
  const thread = Alpine.store('threads').createThread(tutorialNuts);
  thread.tutorial = true;
}
```

### Tutorial Overlay
```html
<div class="tutorial-overlay" x-show="tutorialStep > 0">
  <div class="tutorial-bubble" :style="tutorialPosition">
    <p x-text="tutorialText"></p>
    <button @click="nextTutorialStep()">Next</button>
  </div>
  <div class="tutorial-highlight" :style="highlightPosition"></div>
</div>
```

## Ready to Ship!

This implementation provides:
1. **Clear visual states** for every interaction
2. **Satisfying feedback** at every step
3. **Mobile-first** design that works everywhere
4. **Graceful degradation** for edge cases
5. **Emotional payoff** in the extraction moment

The key is making extraction feel AMAZING - that's what brings users back!