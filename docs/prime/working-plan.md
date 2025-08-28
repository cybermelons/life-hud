# Kama Battle MVP - Working Plan

## Current Status (Dec 27, 2024)

### ✅ Completed
- **Architecture Design**: Clean data model separation
  - Thread owns NUTs with `rootNutId` and `nutIds[]`
  - Kama manages two queues partitioning thread NUTs
  - Individual NUTs can be marked klesha
  - "Tainted" is computed, not stored
- **Documentation**: Complete data model architecture
- **UI Design**: Two-lane interface (vertical mobile, side-by-side desktop)

### 🚧 In Progress - Data Model Refactor
- Fix store implementations to match new architecture
- Separate Thread and Kama responsibilities
- Implement klesha tracking system

### 📋 Implementation Steps

#### Phase 1: Fix Data Model (4 hours) ✅
- [x] Refactor `thread-store.js` - Remove rootDesire/samskaraNuts
- [x] Refactor `kama-store.js` - Own queues, not reference thread
- [x] Add global klesha tracking Set
- [x] Implement Thread-Kama 1:1 mapping
- [x] Add invariant checking (queues = thread NUTs)

#### Phase 2: Core Mechanics (6 hours) ✅
- [x] NUT klesha marking (explicit)
- [x] Thread taint computation (derived)
- [x] View switching based on taint
- [x] Kama auto-creation for tainted threads
- [x] Queue management (klesha ↔ samskara)
- [x] Root desire identification on Kama

#### Phase 3: Battle Flow (6 hours) ✅
- [x] Samskara chain validation (N→U→T)
- [x] Seal creation from complete chain
- [x] Task generation from seal
- [x] Extraction sequence on task completion
- [x] Kama stats and progression

#### Phase 4: UI Implementation (4 hours)
- [ ] Responsive two-lane layout
- [ ] Draggable always-visible NUT bar
- [ ] Long-press klesha marking (150ms animations)
- [ ] Drag-drop between queues
- [ ] Mobile gesture support

#### Phase 5: Polish & Deploy (4 hours)
- [ ] LocalStorage persistence
- [ ] Animation polish (150ms snappy)
- [ ] End-to-end testing
- [ ] Deploy to production

## New Architecture Overview

### Data Model
```typescript
// Core NUT - Simple and extensible
NUT = {
  id: string,
  text: string,
  kind: 'note' | 'urge' | 'task',
  timestamp: Date
}

// Global klesha marking
nutIdIsKlesha: Set<string>

// Thread owns NUTs
Thread = {
  id: string,
  rootNutId: string,
  nutIds: string[]  // SOURCE OF TRUTH
}

// Kama partitions Thread NUTs
Kama = {
  id: string,
  threadId: string,  // 1:1 mapping
  kleshaNutIds: string[],
  samskaraNutIds: string[],
  rootDesire?: DesireType,
  state: KamaState
}

// Invariant: Set(klesha ∪ samskara) = Set(thread.nutIds)
```

### View Logic
```
if (thread has klesha NUT) → Battle View with Kama
else → Normal Thread View

Battle View shows two queues:
- Klesha Queue (problems)
- Samskara Queue (solutions)
```

### Responsive Layout
```
Mobile (Vertical):          Desktop (Side-by-side):
┌──────────────┐           ┌────────┬────────┐
│   KLESHA     │           │ KLESHA │SAMSKARA│
├──────────────┤           │        │        │
│   SAMSKARA   │           │  NUTs  │  NUTs  │
└──────────────┘           └────────┴────────┘
    
[═══ NUT Bar ═══]          [═══ NUT Bar ═══]
  (draggable)                (draggable)
```

## Key Design Decisions

### Clean Data Separation
- **Thread owns NUTs**: Single source of truth for NUT ownership
- **Kama partitions**: Two queues are just views of thread NUTs
- **Klesha is explicit**: User marks individual NUTs as pain points
- **Tainted is computed**: Thread view changes when contains klesha

### Responsive UI Design
- **Mobile-first**: Vertical lanes on mobile screens
- **Desktop optimization**: Side-by-side lanes on wider screens
- **Always-visible NUT bar**: Draggable but always accessible
- **Snappy animations**: 150ms for responsive feel

### Game Mechanics
- **5 Kama types**: Vishaya, Kirti, Bhoga, Aishvarya, Iccha
- **N→U→T pattern**: Note→Urge→Task for complete samskara
- **Seal creation**: Transform chain into actionable task
- **Extraction climax**: Satisfying completion moment

## Technical Implementation

### State Management
```javascript
// Global klesha tracking
const kleshaSet = new Set();

// Kama states (not thread states!)
const KAMA_STATES = {
  unidentified: 'unidentified',
  identified: 'identified', 
  building: 'building',
  sealed: 'sealed',
  extracted: 'extracted'
};

// Desire types
const DESIRE_TYPES = {
  vishaya: 'Sensory pleasure',
  kirti: 'Recognition/validation',
  bhoga: 'Comfort/avoidance',
  aishvarya: 'Power/control',
  iccha: 'Endless craving'
};
```

### Key Functions to Implement
```javascript
// Mark NUT as klesha (explicit)
function markNutKlesha(nutId) {
  kleshaSet.add(nutId);
  updateThreadView(getThreadForNut(nutId));
}

// Check if thread is tainted (computed)
function isThreadTainted(thread) {
  return thread.nutIds.some(id => kleshaSet.has(id));
}

// Ensure Kama exists for tainted thread
function ensureKamaForThread(thread) {
  if (!isThreadTainted(thread)) return null;
  return kamaStore.getOrCreateKama(thread.id);
}

// Verify invariant
function verifyKamaInvariant(kama, thread) {
  const kamaSet = new Set([...kama.kleshaNutIds, ...kama.samskaraNutIds]);
  const threadSet = new Set(thread.nutIds);
  return kamaSet.size === threadSet.size;
}
```

## Files to Update

### Priority 1 - Core Refactor
- `thread-store.js` - Remove rootDesire, samskaraNuts
- `kama-store.js` - Manage own queues, not thread references
- `app.js` - Add klesha tracking Set

### Priority 2 - New Features
- `components/kama-battle.js` - Update for new data model
- `threads-v2.html` - Responsive layout implementation
- `components/nut-bar.js` - Always-visible draggable bar

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