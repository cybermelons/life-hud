# Life HUD as Modular NUT Journaling Mind Palace - Game Design

## Core Concept Evolution
Transform the hierarchical system into a modular journaling platform where exploration unlocks tagging zones for NUT entries. Players build their personalized mind palace through discovery and guild customization.

## Modular Journaling System

### Zone-Based Logging
Each area of the mind palace becomes a specialized logging module:

#### Body Zones (Physical Logging)
- **`/body/actions/muscles/bicep`** → Log bicep workouts directly
- **`/body/senses/taste`** → Log meals and flavor experiences
- **`/body/actions/locomotion`** → Log walks, runs, movement patterns
- Each zone has specialized input fields relevant to that activity

### Universal NUT Tagging
Similar to Toggl's time tracking but for life awareness:

1. **Quick Capture**: Log any NUT with timestamp
2. **Tag Discovery**: Explore zones to unlock their tags
3. **Multi-tagging**: One NUT can belong to multiple zones
4. **Retroactive Tagging**: Can add tags to past entries as you discover zones

Example flow:
```
User logs: "Did 3 sets of curls" [Task]
Tags available: #bicep #muscles #strength
Timestamp: Auto-captured
Location: Stored in /body/actions/muscles/bicep
```

## Exploration & Unlocking System

### Progressive Discovery
1. **Start with Basic Zones**: Body, Mind, Spirit (locked)
2. **Explore to Unlock**: Navigate to new areas to make them available for tagging
3. **Zone Benefits**: Each unlocked zone provides:
   - New tags for NUT entries
   - Specialized input templates
   - Zone-specific analytics
   - Custom CBT exercises

### Discovery Mechanics
- **Fog of War**: Unexplored areas shown as greyed out
- **Requirements**: Some zones need prerequisites (e.g., log 10 body NUTs to unlock deeper body zones)
- **Achievements**: Unlock special zones through consistent practice

## Guild System (Custom Tag Trees)

### Spirit Layer Functions
The `/spirit/` directory becomes the meta-game layer:

#### Core Spirit Features
1. **Personal Values** (`/spirit/purpose/values`)
   - Define what matters to you
   - Align NUTs with values
   - Value-based scoring system

2. **Direction & Goals** (`/spirit/purpose/goals`)
   - Set long-term objectives
   - Map NUT patterns to goals
   - Progress tracking

3. **Sadhana (Practice)** (`/spirit/practices`)
   - Daily rituals and routines
   - Habit formation tracking
   - Consistency rewards

4. **Stats Configuration** (`/spirit/connection/self`)
   - Customize which attributes matter
   - Personal stat weights
   - Progress metrics

### Guild Establishment
Guilds are custom tag hierarchies players create or clone:

#### Guild Types (Examples)
1. **Warrior Guild**
   - Focus: Physical strength, discipline
   - Custom tags: #training #combat #endurance
   - Stat priorities: Strength, Constitution, Will
   - Special zones: Training grounds, Arena

2. **Scholar Guild**
   - Focus: Learning, analysis, wisdom
   - Custom tags: #study #research #insight
   - Stat priorities: Intelligence, Focus, Memory
   - Special zones: Library, Laboratory

3. **Artist Guild**
   - Focus: Creativity, expression, flow
   - Custom tags: #create #inspire #flow
   - Stat priorities: Creativity, Perception, Emotion
   - Special zones: Studio, Gallery

#### Guild Mechanics
```javascript
interface Guild {
  name: string;
  tagTree: TagHierarchy;  // Custom tag structure
  statPriorities: StatWeight[];
  specialZones: Zone[];
  abilities: GuildAbility[];
  progression: LevelSystem;
}

// Players can:
// - Create guilds from scratch
// - Clone and modify existing guilds
// - Share guilds with others
// - Multi-class (belong to multiple guilds)
```

## Implementation Architecture

### Data Structure
```javascript
// Core NUT with zone storage
interface NUT {
  id: string;
  timestamp: Date;
  type: 'note' | 'urge' | 'task';
  content: string;
  tags: string[];  // Unlocked through exploration
  zones: ZoneId[]; // Where this NUT is stored
  guildTags: GuildTag[]; // Custom guild categorization
}

// Zone with discovery state
interface Zone {
  id: string;
  path: string; // e.g., "/body/actions/muscles/bicep"
  unlocked: boolean;
  discoveryRequirement?: Requirement;
  availableTags: string[];
  inputTemplate?: InputTemplate;
  nutCount: number;
  health: number; // Zone health based on NUT patterns
}

// Guild system
interface PlayerProfile {
  unlockedZones: Set<ZoneId>;
  guilds: Guild[];
  customTags: Map<string, TagDefinition>;
  stats: PersonalStats;
  values: Value[];
  goals: Goal[];
}
```

### Page Updates

1. **Zone Pages** (`/body/*/`, `/mind/*/`)
   - Add NUT input form specific to that zone
   - Display NUTs tagged to this zone
   - Show zone health/corruption
   - Unlock requirements if not discovered

2. **Index Page** (`/`)
   - Mind palace overview map
   - Quick NUT input with tag selector
   - Recently active zones highlighted
   - Discovery progress indicator

3. **Spirit Pages** (`/spirit/*/`)
   - Guild management interface
   - Value/goal alignment tools
   - Stats configuration
   - Sadhana scheduling

4. **HUD Dashboard** (`/hud`)
   - Real-time zone health
   - Active guild buffs/effects
   - NUT stream with tags
   - Pattern detection alerts

### New Features

1. **Quick Capture Widget**
   - Floating action button
   - Voice input support
   - Smart tag suggestions based on content
   - Recent tags for quick access

2. **Zone Discovery System**
   - Exploration rewards
   - Prerequisite tracking
   - Discovery notifications
   - Zone relationship mapping

3. **Guild Builder**
   - Visual tag tree editor
   - Stat priority sliders
   - Ability selection
   - Import/export guilds

4. **Pattern Recognition**
   - Automatic chain detection
   - Corruption identification
   - Suggested zone connections
   - CBT intervention triggers

## Progression Flow

1. **Early Game**: Basic NUT logging, discover body/mind zones
2. **Mid Game**: Unlock specialized zones, identify patterns, manage corruption
3. **Late Game**: Create guilds, optimize tag trees, achieve Emperor status
4. **Meta Game**: Share guilds, compete in challenges, teach others

## Key Innovations

1. **Modular Journaling**: Each zone is a specialized journal module
2. **Discovery-Based Tags**: Explore to unlock categorization options
3. **Guild Customization**: Players create their own progression systems
4. **Zone Health**: Visual feedback on life balance
5. **Reality Bridge**: Seamless blend of journaling and gaming

## Lilaya Core Integration

### NUT System Foundation
The NUT (Note/Urge/Task) system remains the core:
- **Notes**: Observations and thoughts manifest in Mind zones
- **Urges**: Emotions and desires appear in Feeling zones
- **Tasks**: Actions populate Body/Action zones

### Reality Bridge Mechanics
- Players log real-life experiences
- These manifest as resources in their mind palace
- Characters in the game world see them as natural phenomena
- Only the player understands the connection

### CBT Combat System
Each NUT type requires different purification strategies:
- **Note Battles**: Cognitive restructuring in thought chambers
- **Urge Battles**: Emotion regulation in feeling halls
- **Task Battles**: Behavioral activation in action zones

### Kama Corruption
- Distorted desires taint incoming NUTs
- Corruption spreads between connected zones
- Players must identify and purify before kingdom chaos
- Pattern recognition reveals corruption sources

This design maintains Lilaya's core NUT philosophy while adding exploration, customization, and progression layers that make journaling feel like adventure.