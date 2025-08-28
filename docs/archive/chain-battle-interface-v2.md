# Chain Battle Interface Design v2
## Thread-Based CBT Through Interactive NUT Chains

### Core Concept

The battle interface is a thread system like Twitter/Slack/Discord where:
- Threads are manually created by reacting or replying to NUTs
- Structure emerges from a chronological pile through player interaction
- Reordering is the core gameplay (like inventory management in Backpack Heroes)
- Each action is separate and asynchronous - mark klesha now, battle later

### Thread Creation

Threads spawn from interaction, not automatic grouping:

```
MAIN TIMELINE:
┌─────────────────────────────────────────┐
│ All NUTs (chronological)                │
├─────────────────────────────────────────┤
│ 💭 "Got rejected from job"              │
│ [💬 Reply] [😠😢🤔 React]               │
│                                         │
│ 📝 "Need to buy groceries"              │
│ [💬 Reply] [😀😎✅ React]               │
│                                         │
│ 😤 "Traffic was awful"                  │
│ [💬 Reply] [😠🚗😮 React]               │
└─────────────────────────────────────────┘
```

### Thread Formation Through Reaction

When player clicks React → Emoji picker → Creates Urge:

```
BEFORE:
│ 💭 "Got rejected from job"              │
│ [💬 Reply] [😠😢🤔 React]               │

PLAYER CLICKS: React → 😠

AFTER:
│ 💭 "Got rejected from job"              │
│   └── 😠 (auto-created Urge)           │
│       [💬] [React] [⚠️ klesha]         │
```

The Urge content is just the emoji itself - pure emotional expression.

### Thread View (After Creation)

```
┌─────────────────────────────────────────┐
│ Thread: Rejection Pattern               │
├─────────────────────────────────────────┤
│                                         │
│ 💭 "Got rejected from job"              │
│ [React] [⚠️ Mark Klesha]                │
│     ↓                                   │
│ 😠 (Urge)                               │
│ [React] [⚠️]                            │
│     ↓                                   │
│ 👊 "Smashed wall"                       │
│ [React] [⚠️]                            │
│                                         │
│ [+] Continue thread...                  │
└─────────────────────────────────────────┘
```

## Klesha Marking (Separate Action)

Player marks klesha independently of battling:

```
MARK KLESHA:
│ 💭 "Got rejected from job" [⚠️ klesha] │
│     ↓ (taints forward causally)        │
│ 😠 [tainted]                            │
│     ↓                                   │
│ 👊 "Smashed wall" [tainted]            │

THREAD STATE: Incomplete (tainted, unredeemed)
```

The thread now sits in your "inbox" as unresolved.

## Reordering as Core Gameplay

Like Backpack Heroes inventory management:

```
INITIAL PILE (chronological):
┌─────────────────────────────────────────┐
│ 1. 👊 "Smashed wall"                    │
│ 2. 💭 "Got rejected"                    │
│ 3. 😠                                   │
└─────────────────────────────────────────┘

DRAG TO REORDER (establishing causation):
┌─────────────────────────────────────────┐
│ 1. 💭 "Got rejected"    [⋮⋮⋮] drag     │
│ 2. 😠                   [⋮⋮⋮]          │
│ 3. 👊 "Smashed wall"    [⋮⋮⋮]          │
└─────────────────────────────────────────┘

After reordering, arrows appear showing flow
```

## Battle Mode (Intentional Separate Action)

Player chooses when to battle, could be days later:

```
INCOMPLETE THREADS:
┌─────────────────────────────────────────┐
│ 📥 Your Tainted Threads                 │
├─────────────────────────────────────────┤
│ • Rejection Pattern (3 days ago) 🔴     │
│ • Morning Anxiety (yesterday) 🔴        │
│ • Work Stress (today) 🔴                │
│                                         │
│ [Select Thread to Battle]               │
└─────────────────────────────────────────┘
```

### Entering Battle

When ready to battle:

```
┌─────────────────────────────────────────┐
│ BATTLE: Rejection Pattern               │
├─────────────────────────────────────────┤
│ KLESHA CHAIN:                          │
│ 💭 "Got rejected" [klesha]              │
│     ↓                                   │
│ 😠 [tainted]                            │
│     ↓                                   │
│ 👊 "Smashed wall" [tainted]            │
│                                         │
│ [Identify Root Desire]                  │
└─────────────────────────────────────────┘

SELECT ROOT:
○ Vishaya (Sensory pleasure)
● Kirti (Recognition need) ← Selected
○ Bhoga (Comfort seeking)
○ Aishvarya (Control/power)
○ Iccha (Craving/thirst)

[Begin Counter-Chain]
```

### Building Samskara

```
┌─────────────────────────────────────────┐
│ BATTLE: Rejection Pattern               │
├─────────────────────────────────────────┤
│ KLESHA (Left):     │ SAMSKARA (Right):  │
│ 💭 Got rejected    │ [+] Add new thought│
│ ↓                  │                     │
│ 😠                 │                     │
│ ↓                  │                     │
│ 👊 Smashed wall    │                     │
└─────────────────────────────────────────┘

PLAYER ADDS:
│ KLESHA:            │ SAMSKARA:          │
│ 💭 Got rejected    │ 💭 "Rejection =     │
│ ↓                  │     redirection"    │
│ 😠                 │ ↓                  │
│ ↓                  │ 💚 (grateful emoji) │
│ 👊 Smashed wall    │ ↓                  │
│                    │ 📝 "Update resume"  │

[Create Seal]
```

## Asynchronous Flow

Each step is independent:

**Day 1**: Experience happens
- Log NUTs normally
- No analysis needed

**Day 3**: Notice pattern
- Review timeline
- React to create thread
- Mark klesha

**Day 5**: Feel ready to battle
- Open incomplete threads
- Choose one to work on
- Identify root desire

**Day 6**: Build counter-chain
- Add samskara NUTs
- Create seal

**Day 7-11**: Practice
- Actually do the new behavior
- Each success strengthens seal
- 5 practices = permanent totem

## Emoji Reaction System

```javascript
interface ReactionSystem {
  // Player clicks react button
  showEmojiPicker(): Emoji[];
  
  // Selecting emoji creates Urge
  createUrgeFromEmoji(emoji: Emoji): Urge {
    return {
      type: 'urge',
      content: emoji, // Just the emoji itself
      timestamp: now(),
      causedBy: parentNut.id
    }
  }
}

// Common emotional reactions
const EMOTION_EMOJIS = [
  '😠', '😢', '😰', '😤', '🤔',
  '💚', '😊', '😌', '🙏', '💪'
];
```

## Thread States

```javascript
const THREAD_STATES = {
  normal: {
    status: 'active',
    visual: 'white background'
  },
  
  tainted: {
    status: 'incomplete',
    visual: 'red gradient',
    badge: '🔴 Tainted'
  },
  
  battling: {
    status: 'in_progress',
    visual: 'split screen',
    left: 'klesha chain',
    right: 'samskara builder'
  },
  
  sealed: {
    status: 'complete',
    visual: 'crystallized',
    badge: '✅ Sealed'
  }
}
```

## Visual Indicators

### Connection Lines
- **Default**: Dotted lines (temporal sequence)
- **After reorder**: Solid arrows (causal flow)
- **Klesha spread**: Red flowing animation
- **Sealed**: Golden crystallized connections

### Thread Badges
- 🔴 Tainted thread (needs redemption)
- ⚔️ Battle in progress
- ✅ Sealed (wisdom gained)
- 🏆 Totem formed (5+ practices)

## Why This Design Works

1. **Familiar Patterns**: Like Twitter/Slack threads everyone knows
2. **Emergent Structure**: Order emerges from reordering, not filing
3. **Asynchronous**: Each step when you're ready, no pressure
4. **Visual Satisfaction**: See corruption spread, build counter-patterns
5. **Player Agency**: You decide causation through reordering
6. **Toy-like Play**: Each NUT is draggable, reactable, interactive

## Implementation Notes

```javascript
// Thread creation from reaction
function reactToNut(nutId: string, emoji: string) {
  const urge = {
    type: 'urge',
    content: emoji,
    causedBy: nutId,
    timestamp: Date.now()
  };
  
  // Create or extend thread
  const thread = findOrCreateThread(nutId);
  thread.nuts.push(urge);
  
  return thread;
}

// Klesha marking
function markKlesha(nutId: string) {
  const thread = getThread(nutId);
  const nutIndex = thread.nuts.findIndex(n => n.id === nutId);
  
  // Mark the nut
  thread.nuts[nutIndex].isKlesha = true;
  
  // Taint all following nuts
  for (let i = nutIndex + 1; i < thread.nuts.length; i++) {
    thread.nuts[i].isTainted = true;
  }
  
  thread.state = 'tainted';
}

// Reordering
function reorderNuts(thread: Thread, fromIndex: number, toIndex: number) {
  const [moved] = thread.nuts.splice(fromIndex, 1);
  thread.nuts.splice(toIndex, 0, moved);
  
  // Update causation based on new order
  updateCausation(thread);
}
```

This design creates a natural flow from capturing experiences to understanding patterns to creating new responses, all through familiar thread interactions and satisfying reordering gameplay.