# Chain Battle Interface Design
## CBT as Toy-like Thread Interaction

### Overview

The battle against Kama happens within a chat thread-like interface where players interact with their NUTs to identify patterns, mark kleshas, and create new samskaras (counter-patterns). This is not about scoring or AI detection - it's about creating a smooth, toy-like experience for doing CBT steps asynchronously and sporadically.

### Core Concept

The thread is a living document where:
- Each NUT is an interactive toy
- Players can inspect, react to, and mark NUTs
- Marking a NUT as klesha taints all downstream NUTs
- Players identify root desires and create new paths
- The process can happen over multiple days

## Thread Interface

### Basic Thread View

pressing the react button will spawn an Urge
with that react underneath.

additionally, i'm thinking other options are like
file structure tree like

```
klesha:
  - 'rejected'  
  - 'angry'
  - 'smash'
samskara
  - 'rejection is strength'
  - etc
```

and you can drag/drop NUTs to either one.
i'm afraid it becomes more a filetree and less a game if
we do it like that? like maybe it's important
to have the structure emerge from a pile of NUTs,
or from doing them in the sequence kinda.

```
┌─────────────────────────────────────────┐
│ Thread: Wednesday Evening               │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ 💭 "Got rejected from job"       │    │
│ │                                  │    │
│ │ [😢] [😠] [🤷] [⚠️ klesha]      │    │
│ └─────────────────────────────────┘    │
│            ↓                            │
│ ┌─────────────────────────────────┐    │
│ │ 😠 "Felt angry"                  │    │
│ │                          [tainted]│    │
│ │ [💭] [🔥] [💔] [⚠️ klesha]      │    │
│ └─────────────────────────────────┘    │
│            ↓                            │
│ ┌─────────────────────────────────┐    │
│ │ 👊 "Smashed a wall"              │    │
│ │                          [tainted]│    │
│ │ [😰] [🩹] [📝]                  │    │
│ └─────────────────────────────────┘    │
│                                         │
│ [+] Continue this thread...             │
└─────────────────────────────────────────┘
```

## Core Interactions

### 1. Inspect NUT (Tap/Click)

Expands to show full context:

```
┌─────────────────────────────────┐
│ 💭 "Got rejected from job"       │
│                                  │
│ Time: 3:42 PM                    │
│ Zone: /mind/thoughts/career      │
│ Tags: #work #disappointment      │
│                                  │
│ [Edit] [Delete] [Link]           │
└─────────────────────────────────┘
```

### 2. React to NUT (Emoji Buttons)

a familiar way to create Urge NUTs.

Reacting to a NUT adds an Urge NUT after it in
causal sequence.

- Adds emotional context to the NUT
- Builds understanding of emotional flow
- Creates visual breadcrumbs for pattern recognition

### 3. Mark as Klesha (⚠️ Button)

When player taps ⚠️ on a NUT:

```
┌─────────────────────────────────┐
│ 🔴 KLESHA MARKED                │
│ "Got rejected from job"          │
│                                  │
│ ↓ Tainting downstream...         │
│                                  │
│ • "Felt angry" [tainted]         │
│ • "Smashed a wall" [tainted]     │
└─────────────────────────────────┘
```

instead of having a whole card, maybe just animate the rest of the list 
gettin colored.  maybe we can have the card be skippable, like a cutscene
can be. (reset all skipped prompts in settings)

**Important**: Marking a NUT as klesha automatically taints all NUTs that came after it in chronological order, showing how one negative thought creates a cascade.

### 4. Identify Root Desire

After marking klesha, tap the root NUT to identify its driving desire:

```
┌─────────────────────────────────┐
│ IDENTIFY ROOT DESIRE             │
│                                  │
│ This klesha is driven by:        │
│                                  │
│ ○ Vishaya (Sensory pleasure)     │
│ ● Kirti (Recognition need)       │ <- Selected
│ ○ Bhoga (Comfort seeking)        │
│ ○ Aishvarya (Control/power)      │
│ ○ Iccha (Craving/thirst)         │
│                                  │
│ [Confirm Root]                   │
└─────────────────────────────────┘
```

## Battle Mode: Creating New Samskara

Once root desire is identified, the thread enters "battle mode":

```
┌─────────────────────────────────────────┐
│ Thread: Wednesday Evening [BATTLE MODE] │
├─────────────────────────────────────────┤
│                                         │
│ KLESHA CHAIN:                          │
│ ┌─────────────────────────────────┐    │
│ │ 💭 "Got rejected" [klesha: kirti]│   │
│ │ ↓                                │    │
│ │ 😠 "Felt angry" [tainted]        │    │
│ │ ↓                                │    │
│ │ 👊 "Smashed wall" [tainted]      │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ═══════════════════════════════════     │
│                                         │
│ NEW SAMSKARA CHAIN:                    │
│ [+] What could you notice instead?      │
│     [Note] [Urge] [Task]                │
│                                         │
└─────────────────────────────────────────┘
```

### Creating the Counter-Chain

Player NUTs directly in battle mode to build new pattern:

```
┌─────────────────────────────────────────┐
│ NEW SAMSKARA CHAIN:                    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ 💭 "Rejection = redirection"     │    │
│ │                         [new path]│    │
│ └─────────────────────────────────┘    │
│            ↓                            │
│ ┌─────────────────────────────────┐    │
│ │ 💚 "Feel grateful for clarity"   │    │
│ │                         [new path]│    │
│ └─────────────────────────────────┘    │
│            ↓                            │
│ ┌─────────────────────────────────┐    │
│ │ 📝 "Update portfolio instead"    │    │
│ │                         [new path]│    │
│ └─────────────────────────────────┘    │
│                                         │
│ [Seal This Pattern]                    │
└─────────────────────────────────────────┘
```

## Toy-like Interactions

### Long Press Context Menu

```
┌──────────────┐
│ Mark Klesha  │
│ Mark New Path│
│ Add Reaction │
│ Link to...   │
│ Delete       │
└──────────────┘
```

### Drag to Reorder (filesystem like mode)

- Drag one NUT before/after other NUTs
- I think just reordering works well.
- Helps player understand their patterns, from top to bottom


## Thread States & Visual Language

```javascript
const THREAD_STATES = {
  normal: {
    background: 'white',
    nutStyle: 'chat bubble',
    connections: 'subtle arrows'
  },
  
  klesha_identified: {
    background: 'light red gradient',
    nutStyle: 'bubble with warning border',
    connections: 'corruption flowing down',
    taintedNuts: 'red tint overlay'
  },
  
  battle_mode: {
    background: 'split screen',
    leftSide: 'klesha chain (red)',
    rightSide: 'new chain (green)',
    connections: 'versus indicator'
  },
  
  sealed: {
    background: 'light green',
    nutStyle: 'crystallized/frozen',
    connections: 'locked in place',
    achievement: 'totem icon appears'
  }
}
```

## Asynchronous Battle Flow

The process doesn't need to be completed all at once:

**Day 1**: Log the experience normally
- Just capture NUTs as they happen
- No pressure to analyze

**Day 2**: Return and mark klesha
- Review yesterday's thread
- Notice the negative pattern
- Mark the source as klesha

**Day 3**: Identify root desire
- Reflect on what drove the pattern
- Select from 5 kama types
- Understanding deepens

**Day 4**: Start new samskara
- Begin adding alternative responses
- Build new chain gradually
- Complete the counter-chain

**Day 5**: Seal the pattern
- Practice new pattern
- Practice imbues seal into permanent totem
- Wisdom crystallized, samskara slowly molded

## Visual Feedback (No Scoring)

### Klesha Spread
- Red tint flows downward through thread
- Shows how one negative thought corrupts others
- Visual representation of pattern cascade

### New Path Glow
- Green/gold particles on new samskara NUTs
- Positive energy building
- Hope and possibility visualization

### Connection Lines
there needs to be some visual indication of how nuts are linked together.

- Arrows appear between causally linked NUTs
- Player creates these manually
- Understanding made visible

### Sealed Patterns
- Stamp a completed pattern with an icon (the totem)
- Visual achievement without gamification

## Why This Works as a Toy

1. **Each NUT is interactive**: Multiple ways to engage with each thought/feeling/action

2. **Visual cause-and-effect**: Mark klesha → see corruption spread immediately

3. **Building blocks approach**: Construct new chains like assembling Lego

4. **No time pressure**: Come back whenever, progress persists

5. **Satisfying resolution**: Seal the pattern, see it crystallize into wisdom

## Implementation Notes

### Data Structure

```javascript
interface NUT {
  id: string;
  content: string;
  type: 'note' | 'urge' | 'task';
  timestamp: Date;
}
  



interface CombatNut extends NUT = {

  // Battle-specific
  isKlesha?: boolean;
  isTainted(): boolean; // tained if root of chain tainted
  isNewPath?: boolean;
  rootDesire?: KamaType;
  
  // Connections
  causes?: string; // IDs of NUTs this causes
  causedBy?: string; // IDs of NUTs that cause this
  
  // Thread context
  threadId: string;
  //position: number; // Order in thread
}

// Combat-Thread extension module
interface NutThread {
  root: CombatNut
  threadId: string;
}

interface BattleThread {
  id: string;
  state(): 'normal' | 'klesha_identified' | 'battle_mode' | 'sealed';
  nuts: string[] // nuts
  // kleshaChain: string[]; // NUT IDs
  // samskaraChain: string[]; // NUT IDs for new pattern
  rootDesire?: KamaType;
  sealedTotem?: string; // TBD
}
```
