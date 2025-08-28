# Kama Battle MVP - Working Plan

## Current Status (Dec 27, 2024)

### ✅ Completed
- **Architecture**: Modular store system with clean separation
  - `thread-store.js` - Thread business logic
  - `kama-store.js` - Game mechanics  
  - `thread-ui-store.js` - UI state only
- **Components**: Alpine.js components
  - `thread-list.js` - Timeline view
  - `kama-battle.js` - Two-lane battle interface
- **UI**: `threads-v2.html` with drag-and-drop between lanes
- **Design**: Complete game flow from NUT capture to extraction
- **Documentation**: Implementation plan and game flow guide

### 🚧 In Progress
- Core state machine implementation
- Klesha marking with animations
- Root desire identification flow

### 📋 Next Steps (3-Day Sprint)

#### Day 1: Core State Machine
- [ ] Thread auto-creation from temporal NUTs
- [ ] Long-press detection for klesha marking
- [ ] Corruption animation sequence
- [ ] Root desire selection modal
- [ ] State persistence to localStorage

#### Day 2: Battle Mechanics  
- [ ] Samskara chain building (N→U→T)
- [ ] Missing NUT type suggestions
- [ ] Seal creation with ingredient preview
- [ ] Task generation from seal
- [ ] Basic extraction sequence

#### Day 3: Polish & Deploy
- [ ] Mobile gesture refinement
- [ ] Visual animations and transitions
- [ ] Onboarding tutorial flow
- [ ] End-to-end testing
- [ ] Deploy to production

## Architecture Overview

### Store Separation
```
Business Logic          UI State
--------------          --------
thread-store.js    →    thread-ui-store.js
kama-store.js      →    (selections, modals, drag state)
app.js (NUTs)      →    
```

### Game Flow
```
1. NUT Capture → Auto-thread
2. Long-press → Mark Klesha
3. Identify Root Desire (5 Kamas)
4. Build Samskara Chain (N→U→T)
5. Create Seal → Generate Task
6. Complete Task → EXTRACTION!
7. Kama Satisfied → Wisdom Gained
```

### Two-Lane Battle Interface
```
┌──────────────────────────┐
│ ⚠️ KLESHA │ ✨ SAMSKARA  │
│           │              │
│ Corrupted │ Pure Chain   │
│ NUTs      │ [N][U][T]    │
│           │              │
│ [Drag →]  │ [← Drop]     │
└──────────────────────────┘
```

## Key Design Decisions

### Why Two Lanes?
- **Visual clarity**: Problem vs Solution
- **Natural flow**: Corruption → Purification
- **Mobile-friendly**: Swipe between lanes
- **Game metaphor**: Battle arena

### Why Drag & Drop?
- **Tactile satisfaction**: Physical movement = transformation
- **Clear agency**: User actively builds solution
- **Visual feedback**: See the chain building
- **Undo-friendly**: Can drag back if wrong

### Why 5 Kama Types?
- **Manageable complexity**: Not overwhelming
- **Covers core patterns**: Most desires fit these
- **Collectible aspect**: "Gotta tame them all"
- **Personality depth**: Each Kama feels unique

## Technical Implementation

### State Machine
```javascript
const THREAD_STATES = {
  fresh: 'fresh',
  klesha: 'klesha',
  identified: 'identified',
  building: 'building',
  sealed: 'sealed',
  extracted: 'extracted'
};
```

### Kama Types
```javascript
const KAMA_TYPES = {
  vishaya: 'Sensory Craving',
  kirti: 'Recognition Need',
  bhoga: 'Comfort Seeking',
  aishvarya: 'Control Desire',
  iccha: 'Endless Wanting'
};
```

### Extraction Rewards
- **Immediate**: Satisfying animation
- **Progress**: +1 Bond with Kama
- **Collection**: Unlock totem at 5 extractions
- **Narrative**: Story revelations

## Files to Update

### Core Files
- `app.js` - Add thread creation triggers
- `threads-v2.html` - Complete UI implementation
- `worker.js` - Route to new threads page

### New Files Needed
- `components/seal-creator.js` - Seal creation modal
- `components/tutorial.js` - Onboarding flow
- `styles/animations.css` - Extraction animations

## Testing Plan

### Core Loop Test
1. Capture 3 NUTs rapidly (should auto-thread)
2. Long-press thread → Mark klesha
3. Select "Kirti" as root desire
4. Drag NUTs to samskara lane
5. Create seal from N→U→T chain
6. Complete generated task
7. Watch extraction animation
8. Verify stats updated

### Edge Cases
- Missing NUT types → Show suggestions
- Wrong Kama selected → Allow re-identification
- Abandoned seal → Graceful degradation
- Offline mode → Everything works locally

## Success Metrics

### MVP Complete When:
- [ ] Core loop works end-to-end
- [ ] Mobile gestures feel natural
- [ ] Extraction feels satisfying
- [ ] Data persists across sessions
- [ ] Can ship to real users

### Post-MVP Features
- Totem creation (5 extractions)
- Kama personality dialogues
- Pattern library sharing
- Achievement system
- Sound effects

## Deployment

```bash
# Test locally
python3 -m http.server 8000

# Deploy to production
export CLOUDFLARE_API_TOKEN="..."
pnpx wrangler deploy

# Live URL
https://life-hud.am0ottrv.workers.dev
```

## Current Blockers

None - Ready for implementation!

## Notes

- Keep extraction moment as the emotional payoff
- Every interaction should feel magical
- Mobile-first, always
- Ship weekly, iterate based on feedback