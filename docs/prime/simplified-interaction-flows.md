# Simplified Kama Battle - Thread-Based Interface

## Core Concept: Timeline as Primary Interface
Keep users in familiar inbox/timeline view. Use toasts/modals for exposition only.

## 1. Main Timeline (Always Visible)

```
┌─────────────────────────────────────────────────────────┐
│  📍 Life HUD                              [Sync] [Menu]  │
├─────────────────────────────────────────────────────────┤
│  Filter: [All ▼] [Mind] [Body] [Kleshas] [Chains]      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ NUT #47                           8/26 7:09pm  │     │
│  │ "Instagram scrolling made me feel inadequate"  │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ NUT #48                           8/26 7:15pm  │     │
│  │ "I want to feel connected"                     │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ NUT #49 ⚠️                       8/26 7:20pm  │     │
│  │ "Spent 3 hours doom scrolling, hate myself"    │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  [+] What's happening?                    [N] [U] [T]   │
└─────────────────────────────────────────────────────────┘
```

### Click on NUT → Inline Actions
```
┌────────────────────────────────────────────────┐
│ NUT #49                         8/26 7:20pm   │
│ "Spent 3 hours doom scrolling, hate myself"   │
│                                                │
│ [⚠️ Mark Klesha] [🔗 View Thread] [↩️ Reply]   │
│ [🗑️ Delete] [📌 Pin] [🏷️ Tag]                 │
└────────────────────────────────────────────────┘
```

## 2. Thread View (Email Thread Style)

Accessed by clicking a NUT in a chain or "View Thread":

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Timeline              Thread #49             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ 📍 NUT #49 ⚠️ KLESHA            8/26 7:20pm   │     │
│  │ "Spent 3 hours doom scrolling, hate myself"    │     │
│  │ Ingredient: Void Squid Ink                     │     │
│  └────────────────────────────────────────────────┘     │
│           ↓                                              │
│  ┌────────────────────────────────────────────────┐     │
│  │ NUT #50                         8/26 7:25pm   │     │
│  │ "I notice I'm comparing myself"                │     │
│  │ Ingredient: Phoenix Heartblood                 │     │
│  └────────────────────────────────────────────────┘     │
│           ↓                                              │
│  ┌────────────────────────────────────────────────┐     │
│  │ NUT #51                         8/26 7:30pm   │     │
│  │ "I want real connection with friends"          │     │
│  │ Ingredient: Unicorn Tears                      │     │
│  └────────────────────────────────────────────────┘     │
│           ↓                                              │
│  ┌────────────────────────────────────────────────┐     │
│  │ NUT #52 📌 TASK                 8/26 7:35pm   │     │
│  │ "Text Sarah about coffee date"                 │     │
│  │ Ingredient: Dragon's Breath Wax                │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  Recipe: Void Ink + Phoenix Blood + Unicorn Tears       │
│          + Dragon Wax                                   │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  💬 Reply to thread...              [🔮 Identify Kama]  │
└─────────────────────────────────────────────────────────┘
```

### Actions Available in Thread View:
- **Reply** (adds new NUT to chain)
- **Mark Klesha** (on any NUT, colors downstream red)
- **Reorder** (drag to rearrange)
- **Delete** (remove from chain)
- **Identify Kama** (when chain complete)

## 3. Progressive Disclosure via Toasts/Modals

### First Klesha Marked → Toast
```
┌──────────────────────────────┐
│ ⚠️ Corruption Detected!       │
│                              │
│ This NUT shows signs of      │
│ Kama infection. Build a      │
│ chain to create a talisman.  │
│                              │
│ [Got it] [Learn More]        │
└──────────────────────────────┘
```

### Chain of 3+ NUTs → Toast
```
┌──────────────────────────────┐
│ 🔮 Chain Ready!              │
│                              │
│ Your talisman has enough     │
│ ingredients. Identify the    │
│ root desire?                 │
│                              │
│ [Identify] [Keep Building]   │
└──────────────────────────────┘
```

### Identify Kama → Modal Overlay
```
┌─────────────────────────────────────────┐
│  IDENTIFY ROOT DESIRE                   │
├─────────────────────────────────────────┤
│                                         │
│  What's driving this pattern?           │
│                                         │
│  ○ Vishaya - Sensory pleasure          │
│  ● Kirti - Recognition/validation      │
│  ○ Bhoga - Comfort/avoidance           │
│  ○ Aishvarya - Power/control           │
│  ○ Iccha - Endless craving             │
│                                         │
│  [Cancel] [Confirm]                     │
└─────────────────────────────────────────┘
```

### After Identification → Toast with Sprite
```
┌──────────────────────────────────────┐
│         😔 KIRTI KAMA                │
│                                      │
│ "I've been feeding on your need      │
│  for validation..."                  │
│                                      │
│ Complete your task to extract her:   │
│ 📌 "Text Sarah about coffee"         │
│                                      │
│ [View Profile] [Dismiss]             │
└──────────────────────────────────────┘
```

## 4. Task Completion → Extraction

### When Task Marked Complete → Full Screen Moment
```
┌─────────────────────────────────────────────────────────┐
│                  EXTRACTION!                            │
│                                                          │
│                     💥                                  │
│                  TALISMAN                               │
│                  ACTIVATING!                            │
│                     💥                                  │
│                                                          │
│                     😵‍💫                                 │
│                                                          │
│         "That was... intense..."                        │
│         "Real connection... not empty validation..."     │
│                                                          │
│  Satisfaction: ████████████ (100%)                      │
│  Practice: 1/5 toward totem                             │
│                                                          │
│                               [Continue]                │
└─────────────────────────────────────────────────────────┘
```

Then return to timeline with success indicator.

## 5. Simplified Flow Summary

### User Journey:
1. **Capture NUTs** normally in timeline
2. **Click NUT** → inline actions appear
3. **Mark Klesha** → colors it red, toast explains
4. **Reply** to klesha → auto-creates chain
5. **Keep replying** → builds chain in thread view
6. **Identify Kama** button appears when 3+ in chain
7. **Select type** → quick modal
8. **Complete task** → extraction animation
9. **Return to timeline** → continue capturing

### Key Simplifications:
- **No separate screens** for each step
- **Thread view** looks like email thread
- **Inline actions** on hover/click
- **Toasts** for teaching moments
- **Modals** only for critical choices
- **Arrows** show causation subtly

## 6. Mobile View (Simplified)

```
┌─────────────────┐
│ 📍 Life HUD     │
├─────────────────┤
│ [All][Mind][⚠️] │
├─────────────────┤
│ ┌─────────────┐ │
│ │ NUT #47     │ │
│ │ "Scrolling" │ │
│ └─────────────┘ │
│       ↓         │
│ ┌─────────────┐ │
│ │ NUT #48 ⚠️   │ │
│ │ "Hate self" │ │
│ └─────────────┘ │
├─────────────────┤
│ [+] What's...   │
└─────────────────┘
```

Tap NUT → Bottom sheet with actions
Swipe right → Mark klesha
Swipe left → Delete
Long press → View thread

## 7. Visual Indicators

### In Timeline:
- Normal NUT: Plain card
- Klesha: ⚠️ Red tint
- Chained: 🔗 Link icon
- Task: 📌 Pin icon
- Completed: ✅ Check

### In Thread:
- Subtle arrows between NUTs
- Ingredient names in small text
- Recipe summary at bottom
- Kama identification button when ready

## 8. Progressive Enhancement

### First Time User:
- See only timeline
- Capture NUTs normally
- Discover klesha marking organically
- Toasts guide through first extraction

### Experienced User:
- Quick gestures for marking
- Keyboard shortcuts
- Batch operations
- Skip animations

## Implementation Notes

### Keep It Simple:
1. Timeline is home screen
2. Thread view is just filtered timeline with arrows
3. All actions available inline
4. Toasts for education, not navigation
5. Modals only for critical decisions
6. Animations only for climactic moments

### Technical:
- Thread view = `filter: chainId === X`
- Arrows = CSS `::after` pseudo-elements
- Toasts = Alpine.js `x-show` with timeout
- Modals = Same overlay component reused
- Extraction = CSS animation, not new screen