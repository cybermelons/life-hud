# Campaign System Design - Draft 1
## 21-Day Consciousness Transformation Tracking

### Overview

The Campaign System provides structured 21-day practice periods (sadhanas) for consciousness transformation. Campaigns organize recurring quests that track behavioral patterns and their effects on body/mind/spirit attributes, following the Gita's teaching on quashing desires through intentional practice.

### Core Architecture

```
HIERARCHY:
Guilds (Life Roles/Consciousness Modes)
  └── Campaigns (21-Day Transformation Periods)  
        └── Quests (Recurring Daily Behaviors)
              └── NUTs (Individual Captured Moments)

FLOW:
Capture NUT → Quest Attribution → Campaign Aggregation → Zone Health Impact
```

## Guild Structure

Guilds represent different modes of consciousness or life roles:

```javascript
interface Guild {
  id: string;
  name: string;
  kingdom: '/body' | '/mind' | '/spirit';
  focus: string;
  attributes: string[]; // e.g., ["strength", "lung", "leg", "endurance"]
  campaigns: Campaign[];
  color: string;
  icon: string;
}
```

### Default Guilds

1. **Warrior Guild** (Body Consciousness)
   - Kingdom: `/body`
   - Attributes: strength, endurance, vitality, lung, leg, flexibility
   - Focus: Physical mastery and health

2. **Scholar Guild** (Mind Consciousness)
   - Kingdom: `/mind`
   - Attributes: focus, memory, analysis, creativity, clarity
   - Focus: Mental development and knowledge

3. **Mystic Guild** (Spirit Consciousness)
   - Kingdom: `/spirit`
   - Attributes: presence, compassion, wisdom, peace, connection
   - Focus: Awareness and spiritual growth

## Campaign System

### Campaign Structure

```javascript
interface Campaign {
  id: string;
  guildId: string;
  name: string;
  intention: string; // "Free myself from smoking"
  duration: 21; // always 21 days
  startDate: Date;
  endDate: Date;
  
  quests: Quest[];
  
  // Progress tracking
  currentDay: number;
  dailyProgress: Map<number, DayProgress>;
  
  // Results
  victoryCondition: string; // "3 days smoke-free"
  totemReward?: string; // "Breath Mastery Seal"
  status: 'active' | 'completed' | 'abandoned';
  
  // Future: Accountability (tentative)
  witnessType?: 'private' | 'guild' | 'partner';
  witnessId?: string;
}
```

### Campaign Examples

```javascript
const CAMPAIGN_TEMPLATES = {
  "quit-smoking": {
    name: "Lung Liberation",
    guild: "warrior",
    intention: "Free myself from nicotine addiction",
    quests: [
      {
        name: "Smoke Tracker",
        type: "negative",
        trigger: "Each cigarette",
        effect: "--lung",
        prompt: "Log every smoke honestly"
      },
      {
        name: "Breath Practice",
        type: "positive",
        trigger: "Morning breathing",
        effect: "++lung",
        prompt: "5 minutes deep breathing"
      },
      {
        name: "Craving Battle",
        type: "kama",
        trigger: "When craving arises",
        kamaType: "vishaya", // sensory pleasure
        prompt: "Identify and quash the desire"
      }
    ],
    victoryCondition: "3 consecutive smoke-free days"
  },
  
  "fitness-foundation": {
    name: "Body Temple Building",
    guild: "warrior",
    intention: "Build consistent exercise habit",
    quests: [
      {
        name: "Morning Movement",
        type: "positive",
        trigger: "Wake up",
        effect: "++strength",
        prompt: "Any movement for 20 minutes"
      },
      {
        name: "Squat Practice",
        type: "positive",
        trigger: "Evening",
        effect: "++leg",
        prompt: "3 sets of squats"
      },
      {
        name: "Laziness Battle",
        type: "kama",
        trigger: "Resistance to exercise",
        kamaType: "bhoga", // comfort seeking
        prompt: "Recognize and overcome inertia"
      }
    ],
    victoryCondition: "15 days of completed movement"
  }
}
```

## Quest System

### Quest Structure

```javascript
interface Quest {
  id: string;
  campaignId: string;
  name: string;
  type: 'positive' | 'negative' | 'kama' | 'neutral';
  
  // Trigger & Effect
  trigger: string; // When to log this quest
  effect: string; // "++leg" or "--lung" or "kama_battle"
  prompt: string; // Reminder text
  
  // For Kama type quests
  kamaType?: 'vishaya' | 'bhoga' | 'kirti' | 'aishvarya' | 'iccha';
  
  // Tracking
  dailyOccurrences: number;
  totalOccurrences: number;
  lastLogged?: Date;
}
```

### Quest Types

1. **Positive Quests** - Building beneficial patterns
   - Effect: `++attribute` (increases zone health)
   - Example: Exercise, meditation, reading
   
2. **Negative Quests** - Tracking harmful patterns
   - Effect: `--attribute` (decreases zone health)
   - Example: Smoking, doom-scrolling, junk food
   
3. **Kama Quests** - Battling root desires
   - Effect: Triggers kama battle interface
   - Tracks which of 5 root desires is active
   - Success creates CBT seals
   
4. **Neutral Quests** - Pure observation
   - Effect: `awareness++`
   - Example: Mood tracking, energy levels

### Attribution System

When a NUT is captured during an active campaign:

```javascript
function attributeNUT(nut: NUT, activeQuest: Quest) {
  // Parse attribution
  const attribution = parseAttribution(activeQuest.effect);
  
  if (attribution.type === 'positive') {
    // ++leg → /body/muscles/leg gains health
    const zone = findZone(attribution.attribute);
    zone.health += 10;
    zone.offerings.push(nut);
    
  } else if (attribution.type === 'negative') {
    // --lung → /body/organs/lung loses health
    const zone = findZone(attribution.attribute);
    zone.health -= 10;
    zone.corruption.push(nut);
    
  } else if (attribution.type === 'kama') {
    // Trigger kama battle
    initiateKamaBattle(activeQuest.kamaType, nut);
  }
  
  // Update campaign progress
  activeQuest.dailyOccurrences++;
  activeQuest.totalOccurrences++;
  
  // Check for pattern formation
  if (activeQuest.totalOccurrences % 5 === 0) {
    suggestTotemCreation(activeQuest);
  }
}
```

## 21-Day Flow

### Week 1: Recognition (Days 1-7)
**"Seeing the Pattern"**
- All occurrences logged honestly
- Negative patterns accumulate
- Zone health shows impact
- Kama battles frequent but difficult

### Week 2: Resistance (Days 8-14)
**"Building Counter-Patterns"**
- CBT seals start forming
- Positive quests counteract negatives
- Mixed success/failure (realistic)
- First totems begin crystallizing

### Week 3: Integration (Days 15-21)
**"New Pattern Crystallization"**
- Negative occurrences decrease
- Positive patterns feel natural
- Totems solidify
- Zone health stabilizes

## Campaign Activation Ritual

```
CAMPAIGN INITIATION:

1. SELECT GUILD
   Choose your consciousness mode for this practice
   
2. SET INTENTION
   "I commit to 21 days of [transformation goal]"
   
3. ACTIVATE QUESTS
   ☑ [Negative pattern to track]
   ☑ [Positive pattern to build]  
   ☑ [Kama to identify and quash]
   
4. SEAL THE PACT
   "For 21 days, I observe, record, and transform"
   
5. (FUTURE) WITNESS SELECTION
   ○ Private journey
   ○ Guild witness 
   ○ Partner witness
```

## Daily Campaign Interface

### Morning View
```
┌─────────────────────────────────────────┐
│  Day 7 of 21: Lung Liberation           │
│  ▓▓▓▓▓▓▓░░░░░░░░░░░░░ (33%)            │
│                                         │
│  Today's Quests:                        │
│  ☐ Smoke Tracker (--lung)              │
│  ☐ Breath Practice (++lung)            │
│  ☐ Craving Battle (kama)               │
│                                         │
│  Yesterday: -20 lung (net)             │
└─────────────────────────────────────────┘
```

### Quick Log Interface
```
ACTIVE QUESTS (tap to log):
[🚬 Smoked] [🫁 Breathed] [⚔️ Fought Craving]
```

### Evening Summary
```
┌─────────────────────────────────────────┐
│  Day 7 Complete                         │
│                                         │
│  Smoking: 3 times (-30 lung)           │
│  Breathing: 2 sessions (+20 lung)      │
│  Cravings: 1 battle won                │
│                                         │
│  Net Impact: -10 lung                  │
│  Zone Health: /body/organs/lung 65%    │
│                                         │
│  [Continue] [Reflect] [Battle Kama]    │
└─────────────────────────────────────┘
```

## Integration Points

### Zone Health System
- Each attributed NUT affects specific zones
- Positive effects nourish zones
- Negative effects deplete zones
- Campaigns show cumulative 21-day impact

### Kama Battle System
- Negative patterns spawn kama encounters
- Quest tracks which root desire is active
- Successful battles prevent attribute damage
- Failed battles allow corruption

### Totem Creation
- Patterns repeated 5+ times suggest totems
- Successful campaigns crystallize into permanent totems
- Totems provide resistance to future similar patterns

## Data Model

```javascript
// Campaign Progress Tracking
interface DayProgress {
  day: number;
  date: Date;
  questProgress: Map<string, QuestDayData>;
  netAttributeChange: Map<string, number>;
  kamaBattles: KamaBattleResult[];
  notes?: string;
}

interface QuestDayData {
  questId: string;
  occurrences: number;
  nuts: string[]; // NUT ids
  attributeImpact: number;
}

interface KamaBattleResult {
  kamaType: string;
  won: boolean;
  sealCreated?: string;
  nutId: string;
}
```

## Future Enhancements (Tentative)

### Accountability System
- **Private**: Solo journey, self-accountability
- **Guild Witness**: Anonymous guild members see progress
- **Partner Witness**: Specific person receives updates
- **Smart Contracts**: Stake something valuable for motivation

### Campaign Variations
- 7-day sprints for quick experiments
- 40-day sadhanas for deep transformation
- 108-day mastery paths for permanent change

### Community Features
- Campaign templates sharing
- Success story library
- Guild challenges
- Totem marketplace

## Success Metrics

A campaign is successful when:
1. Victory condition is met (e.g., "3 smoke-free days")
2. Positive quest completions > 60%
3. At least one totem is created
4. Zone health improves overall

## Philosophy Alignment

This system embodies Gita 3.40-43:
- **Recognition**: See how kama clouds judgment (Week 1)
- **Resistance**: Use intellect to control mind (Week 2)  
- **Transcendence**: Establish consciousness beyond desire (Week 3)

The 21-day structure mirrors traditional habit formation while maintaining player agency - all patterns, seals, and totems are player-created, never AI-generated.