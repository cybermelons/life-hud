# MVP Focused Design - Kama Battle Core Loop

## Core Concept: Threads First, Combat Optional

Every NUT lives in a thread (even if alone). Threads are just groupings - no special meaning until marked as klesha. Then the battle/seduction mechanics activate.

## 1. Timeline View (Home Screen)

```
┌─────────────────────────────────────────────────────────┐
│  📍 Life HUD                              [🔍] [Menu]    │
├─────────────────────────────────────────────────────────┤
│  [All] [Unthreaded] [Kleshas] [Library]                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ Thread #47 (3 NUTs)              8/26 7:09pm  │     │
│  │ "Instagram scrolling..." → ...                │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ NUT #48 (solo)                   8/26 7:15pm  │     │
│  │ "I want to feel connected"                     │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ Thread #49 ⚠️ KLESHA (4 NUTs)    8/26 7:20pm  │     │
│  │ "Spent 3 hours doom..." → ...   🎁 NUT bonus  │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  [+] What's happening?                    [N] [U] [T]   │
└─────────────────────────────────────────────────────────┘
```

### Visual Indicators:
- Regular thread: Plain card
- Solo NUT: Shows "(solo)"
- Klesha thread: ⚠️ warning + color tint
- NUT-shaped bonus available: 🎁 icon

## 2. NUT Detail View (Click any NUT)

```
┌─────────────────────────────────────────────────────────┐
│  ← Back                          NUT #48                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  "I want to feel connected"                             │
│                                                          │
│  Type: Urge                                             │
│  Created: 8/26 7:15pm                                   │
│  Tags: #social #lonely [+Add]                           │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  Thread Preview:                                        │
│  ┌────────────────────────────────────────┐             │
│  │ U: I want to feel connected            │ ← Click     │
│  └────────────────────────────────────────┘    to view  │
│                                                 thread   │
│  Actions:                                               │
│  [⚠️ Mark Klesha] [🔗 Add to Thread] [🗑️ Delete]        │
└─────────────────────────────────────────────────────────┘
```

## 3. Thread View (The Core Interface)

### Regular Thread (No Klesha)
```
┌─────────────────────────────────────────────────────────┐
│  ← Back                      Thread #47                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ N: Saw a movie about snakes         7:09pm    │     │
│  │ Tags: #culture #entertainment                  │     │
│  └────────────────────────────────────────────────┘     │
│           ↓                                              │
│  ┌────────────────────────────────────────────────┐     │
│  │ U: Feeling bored afterwards         7:12pm    │     │
│  │ Tags: #mood                                    │     │
│  └────────────────────────────────────────────────┘     │
│           ↓                                              │
│  ┌────────────────────────────────────────────────┐     │
│  │ T: Research snake documentaries     7:15pm    │     │
│  │ Tags: #todo                                    │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  Thread Tags: #culture #mood #todo                      │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  💬 Add to thread...                    [≡] [⚠️ Klesha] │
└─────────────────────────────────────────────────────────┘
```

### Klesha Thread (Combat Mode)
```
┌─────────────────────────────────────────────────────────┐
│  ← Back                    Thread #49 ⚠️ KLESHA         │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐            │
│  │ KLESHA DETECTED                         │            │
│  │ Complete NUT chain for bonus!           │            │
│  │ [✓ Note] [✓ Urge] [✗ Task]             │            │
│  └─────────────────────────────────────────┘            │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ U: Spent 3 hours doom scrolling ⚠️     7:20pm │     │
│  │ "hate myself for wasting time"                 │     │
│  └────────────────────────────────────────────────┘     │
│           ↓ (corrupted)                                  │
│  ┌────────────────────────────────────────────────┐     │
│  │ N: I'm comparing myself to others      7:25pm │     │
│  │ (tainted by klesha)                           │     │
│  └────────────────────────────────────────────────┘     │
│           ↓                                              │
│  ┌────────────────────────────────────────────────┐     │
│  │ U: I want real connection              7:30pm │     │
│  │ (tainted by klesha)                           │     │
│  └────────────────────────────────────────────────┘     │
│           ↓                                              │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐      │
│   [+ Add Task to complete chain & get bonus]            │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘      │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  💬 Add to thread...              [🔮 Identify Desire]  │
└─────────────────────────────────────────────────────────┘
```

## 4. Progressive Disclosure Through UI Hints

### Quest/Reward Markers
```
┌────────────────────┐
│ [🔮 Identify] ①    │ ← Notification bubble guides
└────────────────────┘

┌────────────────────┐
│ [⚠️ Klesha] 🎁     │ ← Reward indicator
└────────────────────┘
```

### Locked Features (Grayed Out)
```
[🔮 Identify Desire] → Unlocks after 3+ NUTs
[Create Totem] → Unlocks after 5 extractions
[View Kama] → Unlocks after first identification
```

## 5. Mobile Optimizations

### Thread List (Collapsed)
```
┌─────────────────┐
│ Thread #47 (3)  │
│ "Movie → ..."   │
├─────────────────┤
│ Solo #48        │
│ "Connected"     │
├─────────────────┤
│ ⚠️ #49 (4) 🎁   │
│ "Doom → ..."    │
└─────────────────┘
```

### NUT Bar Suggestions
When adding to thread, suggest relevant NUTs:
```
┌─────────────────────────────────┐
│ 💬 Add to thread...              │
├─────────────────────────────────┤
│ Suggested:                      │
│ [NUT #52 "Text Sarah"]          │
│ [NUT #53 "Feel grateful"]       │
│ [+ Create New]                  │
└─────────────────────────────────┘
```

### Touch Interactions
- **Tap**: Select/view
- **Long press**: Context menu (move/delete)
- **Swipe right**: Add to thread
- **Swipe left**: Delete
- **Drag handle** (≡): Reorder in thread

## 6. Combat Sequence (Only for Klesha Threads)

### Step 1: Mark Klesha
Any NUT in thread → Mark as klesha → Colors downstream NUTs

### Step 2: Build Chain
Add NUTs to thread. Show completion bonus hint:
```
Complete NUT pattern for samskara bonus!
[✓ Note] [✓ Urge] [✗ Task needed]
```

### Step 3: Identify Desire (Unlocked at 3+ NUTs)
Quick modal:
```
┌─────────────────────────────┐
│ What desire drives this?    │
│                             │
│ ○ Sensory pleasure         │
│ ● Validation               │
│ ○ Comfort                  │
│ ○ Control                  │
│ ○ Endless craving          │
│                             │
│ [Cancel] [Confirm]         │
└─────────────────────────────┘
```

### Step 4: Extraction (Task Completion)
When task marked done → Success animation → Return to timeline

## 7. Information Architecture

```
Timeline (Home, All nuts)
├── NUT Detail
│   └── Thread Preview
        ├── Thread View
            ├── Regular Thread (just grouping)
            └── Klesha Thread (combat mode)
                ├── klesha/samksara distinctions
                ├── Identify Desire (modal picker, icon button)
                └── Extraction (animation)

Library
    ├── All Threads
    ├── Unthreaded NUTs
    ├── By Zones
        ├── Head
        ├── Body
    └── Totems (locked initially)
```

## 8. State Management



### Thread States (I don't think these are mutually exclusive/stages)
probably unnneeded
- `regular`: Just a grouping of NUTs
- `klesha`: Combat mode activated
- `identified`: desire identified
- `samskara`: has samskara chain complete
- `complete`: Task done, extraction successful

### NUT States  
- `solo`: Not in any thread
- `threaded()`: Part of a thread
- threadId?: string
- `klesha`: Marked as problematic
- `tainted`: Downstream from klesha
- `completed`: Task finished


## 9. MVP Core Loop Test

the loop is to add nuts
view thread
add nuts to thread
select one as problem (then all nuts are marked as problem)
identify root desire
select/add nuts to designate as samskara (NUT shape)
finish - create seal from thread.
execute - do samskara task ritual
extract - reward


1. **Capture** → Creates solo NUT
2. **Thread** → Add/Group NUTs in a NUT's thread
3. **Klesha** → Marks NUT as problem (optional)
5. **Identify** → Select root desire
4. **Replace** → Nut in thread, marked as samskara
6. **Complete** → Do the task
7. **Extract** → Kama satisfied

## 10. What to Build First

### Phase 1: Threading System
- Timeline showing threads and solo NUTs
- Thread view with reply capability
- NUT detail with thread preview
- Basic drag/reorder

### Phase 2: Klesha Mechanics
- Mark klesha button
- Downstream coloring
- NUT pattern detection
- Completion bonus hints

### Phase 3: Combat/Extraction
- Desire identification modal
- Task completion tracking
- Success animation
- Basic Kama reveal

### Phase 4: Polish
- Ingredient system (hidden details)
- Recipe viewer
- Totem creation
- Library organization
