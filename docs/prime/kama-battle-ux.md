# Kama Battle UX Design

## Core Concept
User-driven CBT combat system where players build skillful NUT chains to overcome destructive patterns. No content generation - entirely player-created solutions.

## Overall UX Layout

### Main Screen Structure
```
┌─────────────────────────────────────────┐
│  [Guild Badge]    LILAYA    [☰ Menu]   │
├─────────────────────────────────────────┤
│                                         │
│        MAIN VIEWPORT                    │
│     (Current Zone/Location)             │
│                                         │
│  [Navigate] [Investigate] [Map]         │
├─────────────────────────────────────────┤
│  NUT Bar (collapsed)                    │
│  [+] What's happening?    [N][U][T]     │
└─────────────────────────────────────────┘
```

## Navigation System

### Kingdom Map Overview
```
         SPIRIT KINGDOM
            (locked)
              ╱ ╲
           ╱     ╲
    MIND KINGDOM   BODY KINGDOM
    [Enter ▶]      [Enter ▶]
         ╲       ╱
          ╲   ╱
       YOU ARE HERE
```

### Zone Navigation
```
┌─────────────────────────────────────────┐
│            FEELINGS HALL                │
│                                         │
│    [Anger     ]  [Joy      ]            │
│    🔥 3 NUTs    ✨ 5 NUTs               │
│                                         │
│    [Jealousy  ]  [Sadness  ]            │
│    💚 8 NUTs    💧 2 NUTs               │
│    ⚠️ Klesha!    ✓ Clear                │
│                                         │
│  Choose a room to visit...              │
└─────────────────────────────────────────┘
```

## NUT Capture System

### Collapsed State
```
[+] What's happening?                [N][U][T]
```

### Expanded State
```
┌─────────────────────────────────────────┐
│ What's happening?                       │
│ ┌─────────────────────────────────────┐ │
│ │ [User types their experience]       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Type: [Note] [URGE] [Task]              │
│                                         │
│ Emotion: [Anger][Jealousy][Fear][Joy]   │
│ Intensity: ▓▓▓▓▓▓▓░░░ (7/10)           │
│                                         │
│ Tag zone: [Select zones affected]       │
│                                         │
│ [✓ Mark as Klesha]                      │
│                                         │
│ [Cancel]                   [Capture →]  │
└─────────────────────────────────────────┘
```

## Kama Battle System

### Phase 1: Discovery
When user marks NUT as klesha:

```
┌─────────────────────────────────────────┐
│  NUT #34: [User's logged text]          │
│  Marked as: ⚠️ KLESHA                   │
│                                         │
│  IDENTIFY ROOT DESIRE:                  │
│  ┌─────────────────────────────────┐    │
│  │ Select Kama Type:                │    │
│  │                                  │    │
│  │ ○ Vishaya (Sensory pleasure)     │    │
│  │ ○ Bhoga (Comfort/enjoyment)      │    │
│  │ ● Kirti (Recognition/validation) │    │
│  │ ○ Aishvarya (Power/control)      │    │
│  │ ○ Iccha (Craving/thirst)         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  TAG AFFECTED ZONES:                    │
│  [✓ /mind/feelings/jealousy]           │
│  [✓ /mind/thoughts/comparison]         │
│  [  /body/actions/...]                 │
│                                         │
│  [Begin Battle →]                       │
└─────────────────────────────────────────┘
```

### Phase 2: Battle Interface
Building the counter-chain:

```
┌─────────────────────────────────────────┐
│      KAMA BATTLE: [Type Selected]       │
│                                         │
│         ╱─────────╲                     │
│        │   Kama    │                    │
│        │   Avatar  │                    │
│        ╲─────────╱                      │
│                                         │
│  CURRENT PATTERN (Klesha Path):         │
│  ┌─────────────────────────────────┐    │
│  │ Your logged NUT appears here    │    │
│  │ Leading to suffering...         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  BUILD NEW CHAIN (Skillful Path):       │
│                                         │
│  1. NEW NOTE (Observation):             │
│  ┌─────────────────────────────────┐    │
│  │ What could you notice instead?  │    │
│  │ _______________________________ │    │
│  └─────────────────────────────────┘    │
│                                         │
│  2. NEW URGE (Feeling):                 │ 
│  ┌─────────────────────────────────┐    │
│  │ How do you want to feel?        │    │
│  │ _______________________________ │    │
│  └─────────────────────────────────┘    │
│                                         │
│  3. NEW TASK (Action):                  │
│  ┌─────────────────────────────────┐    │
│  │ What will you actually do?      │    │
│  │ _______________________________ │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Create Chain]                         │
└─────────────────────────────────────────┘
```

Alternatively--

```
  Instead of traditional combat, it's a dialog/reasoning battle:

(old design, for reference)
  ┌─────────────────────────────────────────┐
  │      KAMA ENCOUNTER: Jealousy           │
  │                                         │
  │         Jealousy Kama                   │
  │         HP: ████████░░                  │
  │         "They're happier without you"   │
  │                                         │
  │  YOUR RESPONSE OPTIONS:                 │
  │  ┌─────────────────────────────────┐    │
  │  │ 1. IDENTIFY DISTORTION          │    │
  │  │    "That's mind reading"        │    │
  │  │    Damage: 30 | Cost: 2 Energy  │    │
  │  └─────────────────────────────────┘    │
  │  ┌─────────────────────────────────┐    │
  │  │ 2. REFRAME                      │    │
  │  │    "Their happiness isn't my    │    │
  │  │     unhappiness"                 │    │
  │  │    Damage: 40 | Cost: 3 Energy  │    │
  │  └─────────────────────────────────┘    │
  │  ┌─────────────────────────────────┐    │
  │  │ 3. SKILLFUL ACTION              │    │
  │  │    "I'll practice mudita for    │    │
  │  │     their joy"                   │    │
  │  │    Damage: 50 | Cost: 4 Energy  │    │
  │  └─────────────────────────────────┘    │
  │                                         │
  │  YOU: ████████████ HP | ████░░ Energy  │
  └─────────────────────────────────────────┘
```

### Phase 3: Chain Comparison
User sees their created solution:

```
┌─────────────────────────────────────────┐
│      KAMA BATTLE RESULT                 │
│                                         │
│  OLD CHAIN (Klesha):                    │
│  [User's original NUT]                  │
│  → Leads to: [Tagged zones affected]    │
│                                         │
│  YOUR NEW CHAIN:                        │
│  ┌─────────────────────────────────┐    │
│  │ Note: [User's new observation]  │    │
│  │ Urge: [User's chosen feeling]   │    │
│  │ Task: [User's action]           │    │
│  └─────────────────────────────────┘    │
│                                         │
│  CHAIN STRENGTH:                        │
│  Old: ██░░░░░░░░ (--happy, ++alcohol)   │
│  New: ████████░░ (++leg, ++happy)       │
│                                         │
│  [Save Seal] [Practice Now ->]          │
└─────────────────────────────────────────┘
```

### Phase 4: Victory Through Practice
After user completes the new task:

```
┌─────────────────────────────────────────┐
│         PATTERN CREATED!                │
│                                         │
│  You built a skillful response for:     │
│  [Kama Type] - [Emotion]                │
│                                         │
│         ╱─────────╲                     │
│        │   Kama    │                    │
│        │ Befriended│                    │
│        ╲─────────╱                      │
│                                         │
│  Your solution is saved.                │
│  Practice counter: 1/5                  │
│                                         │
│  Complete 5 times to create totem.      │
│                                         │
│  [View in Library] [Close]              │
└─────────────────────────────────────────┘
```

## Quick Reference System

### Emergency Access Mode
Long-press NUT bar or hotkey:

```
┌─────────────────────────────────────────┐
│        YOUR KLESHA LIBRARY              │
│                                         │
│  FEELING → YOUR SOLUTION                │
│  ─────────────────────────              │
│  😠 Anger                               │
│  → [Your saved anger solution]          │
│                                         │
│  😢 Jealousy                            │
│  → [Your saved jealousy solution]       │
│                                         │
│  😰 Anxiety                             │
│  → [No solution yet] [Create]           │
│                                         │
│  [View All] [Close]                     │
└─────────────────────────────────────────┘
```

## Zone Health Visualization

```
┌─────────────────────────────────────────┐
│      /mind/feelings/jealousy            │
│                                         │
│  Zone Health: ████░░░░░░ 40%           │
│                                         │
│  NUTS HERE:                             │
│  • 3 Kleshas (unconquered)             │
│  • 2 Patterns (created)                 │
│  • 5 Regular NUTs                       │
│                                         │
│  Recent Activity:                       │
│  • Created "Mudita Practice" chain      │
│  • Defeated Kirti Kama                  │
│                                         │
│  [View NUTs] [Start Battle]             │
└─────────────────────────────────────────┘
```

## Totem Formation

After 5 successful uses of a pattern:

```
┌─────────────────────────────────────────┐
│         TOTEM READY!                    │
│                                         │
│  Pattern: [User's chain name]           │
│  Practiced: 5 times                     │
│  Success rate: 100%                     │
│                                         │
│  Create Totem?                          │
│  This crystallizes your wisdom.         │
│                                         │
│  Totem Name: ___________________        │
│                                         │
│  Assign to Guild:                       │
│  [Select Guild]                         │
│                                         │
│  [Create Totem] [Not Yet]               │
└─────────────────────────────────────────┘
```

## Key Design Principles

1. **No Content Generation**: All text/solutions come from user
2. **Simple Classification**: 5 Kama types to choose from
3. **User-Driven Solutions**: Player creates their own NUT chains
4. **Visual Feedback Only**: Kama avatars represent pattern types
5. **Progress Through Practice**: Victory requires real action
6. **Personal Library**: User's own solutions become references

## Combat Mechanics

### "Damage" System
- Not calculated from content
- Based on completion: Did user do their chosen task?
- Binary: Old pattern vs New pattern usage

### "Defense" System  
- Number of alternative chains created
- Recency of practice
- Totem strength (maintenance)

### Victory Conditions
- User manually logs successful pattern usage
- After 3-5 uses, pattern can become totem
- No parsing or evaluation of content needed

## Mobile Optimization

- Touch-friendly buttons
- Bottom-sheet patterns for battles
- Swipe between phases
- One-handed operation
- No complex gestures
- Clear visual hierarchy

## Visual Style (Simplified)

- No animations required
- Static character sprites for Kamas
- Simple progress bars
- Clear typography
- High contrast for readability
- Minimal visual effects
- Zone colors: green (body), blue (mind), purple (spirit)
