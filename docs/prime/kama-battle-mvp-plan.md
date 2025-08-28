# Development Plan: Life HUD Kama Battle MVP

## Overview
Transform Life HUD from basic NUT journaling into a complete Kama extraction game where users identify corrupted thoughts (kleshas), build purification talismans, and tame desire demons through chain-building combat.

## Current State
- ✅ Basic NUT capture working (deployed)
- ✅ Supabase sync functional
- ✅ Game narrative designed (tiddy.city setting)
- ⚠️ No chain/thread building UI
- ⚠️ No klesha marking system
- ⚠️ No combat/extraction mechanics

## Phase 1: Chain Building Foundation (Week 1)

### Thread/Chain UI
- [ ] Make NUTs draggable in timeline view
- [ ] Drag NUT onto another to create chain relationship
- [ ] Show chains as connected chat bubbles
- [ ] Add "root NUT" indicator (📍 icon)
- [ ] Rearrange chain order functionality

### Klesha Identification
- [ ] Add "Mark as Klesha" button on NUT inspect
- [ ] Klesha NUTs get corruption indicator (⚠️)
- [ ] Show corruption in timeline with red tint
- [ ] Filter view for "Only Kleshas"

### Timeline Improvements (from user NUTs)
- [ ] Convert inventory to chat/timeline view
- [ ] Split into Mind/Body lanes
- [ ] Add filters at top of NUT sack
- [ ] Auto-tag: Urge→Mind, Task→Body

## Phase 2: Combat System (Week 2)

### Talisman Building
- [ ] Click klesha → "Investigate" button appears
- [ ] Root desire selection (5 Kama types)
- [ ] Show ingredient list from chained NUTs
- [ ] Display exotic materials (based on NUT ID hash)
- [ ] "Craft Talisman" combines ingredients

### Extraction Ritual
- [ ] Task completion tracking for chain action
- [ ] "Activate Seal" when task done
- [ ] Extraction success screen ("Kama expelled!")
- [ ] Show satisfaction meter filling
- [ ] Practice counter (1/5 toward totem)

### Kama Management
- [ ] Simple Kama profile after extraction
- [ ] Hunger timer for maintenance
- [ ] "Feed" button to repeat ritual
- [ ] Warning when Kama gets hungry

## Phase 3: Totem & Persistence (Week 3)

### Totem Creation
- [ ] After 5 successful extractions → "Create Totem"
- [ ] Name your tamed Kama
- [ ] Assign to zone/guild location
- [ ] Show in library/collection

### Zone System
- [ ] Basic zone tagging (Mind/Body/Spirit)
- [ ] Zone health meters (corruption levels)
- [ ] Filter NUTs by zone
- [ ] Show Kama spawn rates by zone

### Progress Tracking
- [ ] Kama collection screen (bestiary)
- [ ] Totem maintenance schedule
- [ ] Stats dashboard (extractions, success rate)
- [ ] Daily quest suggestions

## Phase 4: Polish & Onboarding (Week 4)

### Tutorial Flow
- [ ] First-time user sees example klesha
- [ ] Guided through chain building
- [ ] Complete first extraction
- [ ] Unlock full features after tutorial

### Visual Feedback
- [ ] Corruption spreading animation
- [ ] Talisman glow effects
- [ ] Extraction impact visuals
- [ ] Totem crystallization effect

### Gamification Elements (from user NUTs)
- [ ] Dopamine meter (candle wick burning)
- [ ] Sleep rewards system
- [ ] Action suggestions on NUT inspect
- [ ] Progress celebration moments

## Technical Implementation

### Core Dependencies
- Alpine.js for reactivity (already in place)
- LocalStorage for chains/totems
- Supabase for sync (existing)
- CSS animations for combat visuals

### New Data Structures
```javascript
// Chain linking NUTs together
Chain: {
  id: string,
  rootNutId: string,
  nutIds: string[],
  kamaType: string, // vishaya|bhoga|kirti|aishvarya|iccha
  ingredients: string[], // exotic materials from NUT IDs
  completed: boolean,
  createdAt: Date
}

// Tamed Kama that needs maintenance
Totem: {
  id: string,
  kamaName: string,
  kamaType: string,
  chainId: string,
  practiceCount: number,
  lastFed: Date,
  hungerLevel: number, // 0-100
  zoneId: string
}

// Klesha marking
Klesha: {
  nutId: string,
  markedAt: Date,
  corruption: number, // 0-100
  chainId?: string // if part of a chain
}
```

### File Changes Needed
- `app.js`: Add chain management, combat logic, totem tracking
- `inventory.html`: Convert to timeline/chat view with drag-drop
- New: `combat.js`: Battle system logic and extraction ritual
- New: `chains.html`: Chain builder interface
- New: `totems.html`: Collection and maintenance view
- CSS: Add corruption effects, chain connectors, battle animations

### API Additions
```javascript
// app.js additions
async createChain(rootNutId, connectedNutIds) 
async markAsKlesha(nutId)
async identifyKamaType(chainId)
async craftTalisman(chainId)
async performExtraction(chainId, taskCompleted)
async createTotem(kamaName, chainId)
async feedTotem(totemId)
```

## Success Metrics
- [ ] Can create chains from multiple NUTs
- [ ] Can identify and mark kleshas
- [ ] Can complete extraction ritual
- [ ] Can create and maintain totems
- [ ] Sync works across devices
- [ ] User completes first extraction in <5 minutes

## Implementation Priority

### Day 1-2: Chain Building
1. Add drag-drop to timeline
2. Create chain data structure
3. Show chain relationships visually

### Day 3-4: Klesha & Combat Prep
1. Add klesha marking
2. Create talisman builder
3. Show ingredients from NUT IDs

### Day 5-6: Extraction Ritual
1. Task completion tracking
2. Extraction animation/feedback
3. Kama satisfaction system

### Day 7: Totems & Polish
1. Totem creation after 5x
2. Maintenance reminders
3. Collection view

## Next Immediate Actions
1. Set up worktree environment
2. Add drag-drop library (or vanilla JS)
3. Create chain data structure in app.js
4. Update inventory.html to timeline view
5. Add klesha marking button

## Notes from User Testing
Based on user's actual NUTs:
- Need dopamine/energy visualization
- Auto-tag urges as Mind, tasks as Body
- Show action suggestions on inspect
- Timeline should look like chat
- Filters at top are essential
- People want to see progress/stats

## Risk Mitigation
- Keep combat text-based initially (no complex animations)
- Use localStorage first, sync later
- Start with 1 Kama type, expand to 5
- Tutorial can be added post-MVP if needed