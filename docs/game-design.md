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

#### Example Unlock Requirements

**Early Unlocks (Tutorial Flow):**
- Body/Senses → Unlocked from start
- Body/Actions → Unlocked from start  
- Mind/Thoughts → Unlocked from start
- Mind/Feelings → Unlock after 3 NUTs

**Mid-Game Unlocks:**
- Body/Senses/Taste → Log 1 meal or drink
- Body/Actions/Muscles → Log 1 workout or physical task
- Mind/Thoughts/Observations → Log 5 notes
- Mind/Feelings/Complex → Experience 3 different primary emotions

**Late-Game Unlocks:**
- Spirit Kingdom → 10 total NUTs OR 7-day streak OR complete onboarding
- Body/Actions/Reproduction → Age gate + 20 body NUTs
- Mind/Thoughts/Memories → 10 notes + identify 1 pattern
- Spirit/Purpose → Complete self-reflection quest

**Special Unlocks:**
- Secret zones via easter eggs
- Guild-specific zones when joining a guild
- Seasonal zones during events

## Guild System (Life Role Encapsulation)

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

### Guild Concept
A guild represents a cohesive life role or identity that encapsulates:
1. **Stat Tree**: Hierarchical tags tracking attributes/skills relevant to that role
2. **Rituals**: Recurring tasks/practices that maintain and develop that role
3. **Campaigns**: Time tracking for activities related to that role

This aligns with Vedantic/Samkhya yogic philosophy - each guild is like a dharma or life path we embody.

### Guild Establishment
Guilds are life roles players create or clone:

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

## Kingdom Navigation Design

### Three Kingdoms Structure (from Lilaya lore)
Based on the yogic philosophy layers from the Samsara kingdom:

1. **Outer Kingdom** (`/body`) - Physical interface with world
   - Represents action and sensory experience (Tamas/stability)
   - Where orders are carried out and resources gathered
   - Home to farmers, soldiers, laborers

2. **Middle Kingdom** (`/mind`) - Thoughts and feelings  
   - Represents thought and feeling processes (Rajas/energy)
   - Where decisions are implemented through systems
   - Home to merchants, craftspeople, administrators

3. **Inner Kingdom** (`/spirit`) - Pure awareness [LOCKED]
   - Center of awareness and decision-making (Sattva/clarity)
   - Where policy and high-level decisions are made
   - Home to royalty, scholars, spiritual leaders

### Navigation Philosophy
- **Simple page-to-page movement** like Persona or dating sims
- Each page is a **location in the kingdom** you visit
- **Index page = Kingdom Gates/Overview** - Where you choose which kingdom to enter
- **Breadcrumbs = Your path** through the palace
- **/sitemap** = Full development map (moved from index)

### Game Loop
1. **Start at Kingdom Gates** (index) - See three kingdoms' health/activity
2. **Enter a Kingdom** - Navigate to /body, /mind, or /spirit
3. **Explore Locations** - Each subpage is a room/area to visit
4. **Capture NUTs** - Using expandable journal/inventory panel
5. **Build Experience** - NUTs get stored in current location
6. **Unlock Deeper Areas** - Through consistent practice

### Exploration & Progression Design (Pokemon-inspired)

#### Visible but Blocked
Like Pokemon's Indigo Plateau or sleeping Snorlax, players can SEE locked areas but need to meet requirements:

- **Spirit Kingdom** visible from start but requires "10 NUTs" (like needing 8 badges)
- **Body/Actions/Reproduction** visible but needs "maturity level" or specific unlock
- **Mind/Thoughts/Memories** visible but needs "5 observation NUTs" first
- Each locked zone shows:
  - What it contains (preview/description)
  - Why it's locked (requirement)
  - Progress toward unlock (3/10 NUTs)

#### Non-Linear Progression
Unlike Pokemon's strict gym order, multiple paths available:

- Can start with Body OR Mind exploration
- Within Body, can focus on Senses OR Actions
- Some zones have multiple unlock paths:
  - Spirit unlocks via: 10 total NUTs OR complete a 7-day streak OR finish tutorial quest
  - Advanced zones unlock via: quantity (10 NUTs) OR quality (identify 3 patterns) OR time (3 days active)

#### Mechanical Engagement Creates Progress
Progression comes from using the system, not grinding:

- **Logging NUTs** = Experience points
- **Identifying patterns** = Skill development  
- **Maintaining streaks** = Discipline training
- **Exploring zones** = Map discovery
- **Reacting to NUTs** = Emotional intelligence
- **Tagging correctly** = Organizational mastery

#### Teasing Future Content
Show glimpses of what's coming:

- Locked zones display grayed-out preview: "🔒 Inner Sanctum - Where purpose aligns with action"
- Hovering shows requirements: "Unlock by reaching Middle Kingdom first"
- NPCs/Hints reference locked areas: "I heard the Spirit Temple has powerful meditation techniques..."
- Partial visibility: Can see zone name and icon but not enter

### NUT Capture Panel (Inventory System)
Expandable panel like Toggl Track that slides up from bottom:

**Collapsed State:**
- Minimal bar with quick capture input
- Type selector (Note/Urge/Task)
- Expand button

**Expanded State (MTG Card-like):**
- Full capture form with rich fields
- Time adjustment
- Tag selection (based on unlocked zones)
- Zone assignment (where to store the NUT)
- Recurrence settings
- Quick reactions/mood
- Preview of how NUT will appear

Always accessible while navigating the kingdom, like carrying a journal.

### Core NUT Offering Gameplay Loop

1. **Capture Phase**
   - Log NUT via always-present NUT bar
   - NUT enters inventory (unassigned)
   - Can accumulate multiple NUTs before offering

2. **Exploration Phase**
   - Navigate kingdom zones
   - Each zone has different "appetite" for NUT types
   - Visual indicators show zone health/hunger

3. **Notification Phase**
   - Zones recognize compatible NUTs in inventory
   - Display notification: "The Training Grounds sense your physical experience"
   - Creates engagement opportunity

4. **Dialog Phase**
   - Simple dialog with zone entity/guardian
   - Entity explains their need/desire for the NUT
   - Lore-building about why this NUT belongs here

5. **Offering Phase**
   - Player chooses to offer NUT or keep it
   - Offering animation/ritual
   - NUT transforms from inventory item to zone resource

6. **Storage Phase**
   - NUT permanently stored in zone
   - Zone health increases
   - Relationship progress
   - Possible unlocks or rewards

### Totem Formation (Manual Process)

**No Automatic Pattern Recognition** - Player has full control:

1. **Collection**: Gather multiple related NUTs in inventory
2. **Selection**: Manually choose which NUTs to chain
3. **Intention**: Define what the totem represents
4. **Ritual**: Use discovered sealing components
5. **Placement**: Choose where totem lives
6. **Maintenance**: Regular practice keeps totem active

Example:
- Player collects: "went to gym", "felt strong", "leg day done"
- Manually chains them together
- Names it: "Strength Training Totem"
- Places in /body/actions/muscles
- Must log workout NUTs weekly to maintain

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

### Page Structure

1. **Index Page** (`/`) - Kingdom Gates
   - Three kingdoms overview (Outer/Middle/Inner)
   - Kingdom health indicators
   - Recent activity summary
   - Entry points to each kingdom
   - Quick link to full sitemap

2. **Kingdom Pages** (`/body`, `/mind`, `/spirit`)
   - Kingdom description and current state
   - Child locations as navigation options
   - Zone-specific NUTs display
   - Health/corruption meters
   - Breadcrumb navigation

3. **Zone Pages** (`/body/*/`, `/mind/*/`)
   - Location-specific theming and description
   - NUT input form specific to that zone
   - Display NUTs tagged to this zone
   - Show zone health/corruption
   - Unlock requirements if not discovered
   - Navigation to child zones

4. **Sitemap** (`/sitemap`) - Development View
   - Complete hierarchical view of all zones
   - Quick access to any location
   - Debug information and stats
   - Locked/unlocked status overview

5. **Spirit Pages** (`/spirit/*/`) [LOCKED]
   - Guild management interface
   - Value/goal alignment tools
   - Stats configuration
   - Sadhana scheduling

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

### Early Game - Basic NUTting
- Player explores kingdom with NUT bar
- Captures NUTs throughout the day (Twitter-style quick logging)
- Offers NUTs to zones through dialog interactions
- Builds relationships with zones
- Unlocks new areas through consistent engagement

### Mid Game - Kama Detection (Silph Scope Moment)
- Complete "The Sight Beyond" quest to unlock Kama vision
- Can now identify corruption/kama in captured NUTs
- Corrupted NUTs appear with visual indicators (red/purple glow)
- Must decide whether to offer tainted NUTs or purify them first
- Adds risk/reward to NUT offerings

### Late Game - Totem Creation
- Discover sealing ritual components scattered across kingdom
- Each kingdom holds ritual knowledge:
  - Body: "Form" component (physical manifestation)
  - Mind: "Intent" component (purpose and meaning)
  - Spirit: "Binding" component (permanence)
- Player manually chains NUTs together (no AI pattern recognition)
- Creates totems that represent commitments/habits
- Places totems in zones for permanent buffs
- Must maintain totems through regular practice or they decay

### Meta Game
- Share custom guilds and totems with other players
- Compete in challenges
- Teach others your discovered rituals

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