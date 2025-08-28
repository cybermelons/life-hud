# Guild System - Life Role Encapsulation

## Overview
The Guild System represents a fundamental organizational layer in Life HUD, encapsulating different life roles or identities we embody. Drawing from Vedantic and Samkhya yogic philosophy, each guild represents a dharma or life path - whether "Developer", "Writer", "Fitness Enthusiast", "Parent", or any other role we play.

## Core Concepts

### What is a Guild?
A guild is a cohesive container that organizes three key tracking mechanisms:

1. **Stat Tree (Custom Tags)**: A hierarchy of attributes and skills relevant to that life role
2. **Rituals (Recurring Tasks)**: Regular practices that maintain and develop that role
3. **Campaigns (Time Tracking)**: Focused periods of activity related to that role

### Philosophical Foundation
From a yogic perspective, guilds represent:
- **Vedantic View**: Different koshas (sheaths) or aspects of self
- **Samkhya View**: Expressions of different gunas and their interactions
- **Practical View**: Organized ways to develop different dimensions of life

## Implementation Details

### Data Structure

```typescript
interface Guild {
  id: string;
  name: string;
  description?: string;
  statTree: StatTree;        // Hierarchical attributes
  rituals: string[];          // IDs of associated rituals
  campaigns: string[];        // IDs of associated campaigns
  customTags: TagHierarchy;   // Guild-specific tag system
  color: string;              // Visual identity
  icon: string;               // Emoji or icon
  createdAt: Date;
  modifiedAt: Date;
}
```

### Stat Trees
Each guild maintains its own stat tree representing relevant attributes:

```typescript
interface StatTree {
  [key: string]: {
    name: string;
    value: number;
    maxValue: number;
    children?: StatTree;
    description?: string;
  };
}
```

Example for a Warrior Guild:
- Strength: 75/100
  - Physical: 80/100
  - Mental: 70/100
- Discipline: 60/100
  - Consistency: 65/100
  - Focus: 55/100

### Rituals
Rituals are recurring tasks specific to a guild:

```typescript
interface Ritual {
  id: string;
  guildId: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  currentStreak: number;
  bestStreak: number;
  lastCompleted?: Date;
  tags: string[];
  isActive: boolean;
}
```

Examples:
- Warrior Guild: "Morning Workout" (daily), "Martial Arts Practice" (weekly)
- Scholar Guild: "Daily Reading Hour" (daily), "Weekly Review" (weekly)
- Artist Guild: "Creative Practice" (daily), "Portfolio Update" (monthly)

### Campaigns
Campaigns track focused time periods for guild activities:

```typescript
interface Campaign {
  id: string;
  guildId: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  sessions: CampaignSession[];
  totalTime: number;
  tags: string[];
  isActive: boolean;
}
```

Examples:
- Warrior: "Summer Fitness Challenge", "Marathon Training"
- Scholar: "Philosophy Deep Dive", "Technical Certification"
- Artist: "Digital Art Portfolio", "Novel Writing Month"

## Guild Types

### Pre-defined Templates

#### Warrior Guild
- **Focus**: Physical mastery and discipline
- **Key Stats**: Strength, Endurance, Discipline
- **Typical Rituals**: Exercise routines, meditation, cold exposure
- **Campaign Examples**: Fitness challenges, sports seasons

#### Scholar Guild
- **Focus**: Knowledge and understanding
- **Key Stats**: Wisdom, Analysis, Memory
- **Typical Rituals**: Reading, note-taking, review sessions
- **Campaign Examples**: Course completion, research projects

#### Artist Guild
- **Focus**: Creative expression
- **Key Stats**: Creativity, Perception, Expression
- **Typical Rituals**: Daily practice, inspiration gathering
- **Campaign Examples**: Portfolio creation, exhibition preparation

#### Mystic Guild
- **Focus**: Spiritual development
- **Key Stats**: Awareness, Connection, Presence
- **Typical Rituals**: Meditation, journaling, contemplation
- **Campaign Examples**: Retreat periods, practice intensives

### Custom Guilds
Users can create entirely custom guilds for their unique life roles:
- Parent Guild: Focus on family and nurturing
- Entrepreneur Guild: Business and innovation focus
- Healer Guild: Health and wellness orientation
- Explorer Guild: Adventure and discovery

## Integration with NUT System

### Guild Context
Every NUT (Note/Urge/Task) can be associated with:
1. **Active Guild**: Automatically tagged with current guild context
2. **Guild Tags**: Custom tags from the guild's tag hierarchy
3. **Campaign Sessions**: Time-tracked activities link NUTs to campaigns

### Tag Hierarchy
Each guild maintains its own tag hierarchy:

```typescript
interface TagHierarchy {
  [key: string]: {
    name: string;
    color?: string;
    children?: TagHierarchy;
  };
}
```

Example for Scholar Guild:
```
study/
  ├── reading/
  │   ├── philosophy/
  │   ├── science/
  │   └── literature/
  ├── research/
  │   ├── primary/
  │   └── synthesis/
  └── writing/
      ├── notes/
      └── essays/
```

## Usage Patterns

### Daily Flow
1. **Morning**: Select active guild for the day
2. **Throughout Day**: 
   - Log NUTs with automatic guild context
   - Complete ritual tasks
   - Track campaign time
3. **Evening**: Review guild stats and progress

### Multi-Guild Management
Users can:
- Switch between guilds based on context
- Maintain multiple active guilds
- Set time allocations for balance
- Track cross-guild patterns

### Progress Tracking
- **Stats**: Automatically updated based on NUT patterns
- **Streaks**: Ritual completion tracking
- **Time**: Campaign session aggregation
- **Insights**: Pattern recognition across guild activities

## Benefits

### Organization
- Clear separation of life domains
- Contextual task management
- Focused time tracking

### Motivation
- Role-specific progress visualization
- Streak maintenance for rituals
- Campaign completion satisfaction

### Balance
- See time distribution across roles
- Identify neglected areas
- Maintain holistic development

### Flexibility
- Adapt to life changes
- Create new roles as needed
- Archive completed phases

## Future Enhancements

### Planned Features
1. **Guild Levels**: Experience and progression systems
2. **Guild Abilities**: Unlock special features through consistent practice
3. **Guild Challenges**: Community competitions and achievements
4. **Guild Sharing**: Export/import guild templates
5. **Multi-Guild Quests**: Cross-role objectives

### Integration Possibilities
- Calendar sync for ritual reminders
- Time tracking app integration
- Social features for guild communities
- AI-powered guild recommendations

## Technical Implementation

### Store Management
- `guilds.ts`: Guild CRUD operations and state
- `rituals.ts`: Ritual tracking and streaks
- `campaigns.ts`: Time tracking and sessions
- `nuts.ts`: Enhanced with guild context

### UI Components
- Guild Selector: Quick switching interface
- Ritual Tracker: Daily/weekly ritual checklist
- Campaign Timer: Active session tracking
- Guild Dashboard: Comprehensive overview

### Data Persistence
- Local storage with nanostores/persistent
- Planned Supabase sync for backup
- Export/import functionality

## Conclusion
The Guild System transforms Life HUD from a simple journaling tool into a comprehensive life management system, providing structure and meaning to daily activities while maintaining the flexibility to adapt to each user's unique life path.