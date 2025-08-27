

good start to the flows, but i think if something is marked as a klesha, then a requirement
to the next step is to identify a feeling. so  if a klesha is marked, th en we should encourage
the next thing to do is nut a feeling, either by nut bar or holding click to react to a nut
in the thread, preferably the klesha-marked one.

then 

# engine design

like unreal is blueprints and scenes with assets.
houdini is nodes.
video editors are clips.
life-hud is NUTs.



# next

1. click nut to go to inspect nut page detail -> click action button -> go to next action
2. next actions:
  - no thread? -> create thread -> view thread
  - no klesha? -> view thread -> mode: place klesha marker onto nut in thread; alternatetively create new nut as klesha
  - no root cause? -> identify root desire
  - no new chain
  - no resolution task? -> view thread -> open nut input to task
  - tht's it for now

# Development Plan: Life HUD MVP - NUT Journaling Mind Palace

## Overview
Build a functional MVP for the Life HUD journaling system that implements the core NUT (Note/Urge/Task) capture functionality with zone-based tagging and a complete development sitemap for easy navigation during development.

## Approach
Create a modular Astro-based web app with local storage persistence, progressive zone discovery, and specialized journaling interfaces for each life awareness zone (body/mind/spirit).

we need the design to be so i can work on this bit by bit, start dogfooding it immediately.
i don't want to deal with signup but i do want to use supabase because i could use anonymous sessions, and I want to save the data to an account later. like person uses it ASAP.

each module is basically a special NUT-logging interface, a NUT template with pre-selected tags. e.g. the body/index page is a page to see overall status of all NUTs tagged under body, seeing aggregate metrics. the body/mouth would be a diet tracker or something. the point is i'd be implementing more things to log as i develop and use this.


i plan for it to start logging random thoughts twitter style, reacting to them discord-style afterwards, or tagging reacts while composing.

the goal is to be functional, effective, and quick. so we'll be using ssr, but
i do want offline capability as a PWA, that syncs to supabase.


architecture is to use supabase as db, have a pure-functional game engine for determinsim, nanostores for for in-memory gamestate as well as ui-state. the game-engine uses localstorage and supabase for persistence. the engine data can run on both client and server.

## Implementation Checklist

### Phase 0: Guild System Foundation ✅
- [x] Define Guild, Ritual, and Campaign interfaces
- [x] Create guild state management store
- [x] Create ritual tracking store
- [x] Create campaign time tracking store
- [x] Integrate guild context with NUT system
- [x] Document guild system architecture

### Phase 1: Core Architecture Setup
- [ ] Create shared Layout component with navigation and consistent styling
- [ ] Define TypeScript interfaces for NUT data types
- [ ] Set up nanostores for state management
- [ ] Implement local storage persistence layer for NUTs
- [ ] Create zone discovery state management system
- [ ] Set up stores for user profile 

### Phase 2: Complete Sitemap on Index Page
- [ ] Transform index page into comprehensive development sitemap
- [ ] body index pg - body tree, with a diagram of child zones to drill down into
  - [ ] add links/buttons to submodules, but disable them b/c they're locked (wip)
- [ ] Mind index pg - basic timeline of nuts, styled like a messaging chat log.
  - [ ] add links/buttons to submodules, but disable them b/c they're locked (wip)
- [ ] spirit index page - set current goal, sadhana.
  - [ ] add links/buttons to submodules, but disable them b/c they're locked (wip)
- [ ] Add quick NUT capture section on index
- [ ] Style with appropriate zone coloring (green/blue/purple)
- [ ] Add navigation breadcrumbs component

### Phase 3: MVP Routes & Pages

#### MVP Route Structure
```
/ (index) - Kingdom map/hub
/body - Body Kingdom overview
/mind - Mind Kingdom overview
/mind/feelings - Feelings hall
/mind/feelings/anger - Anger zone
/mind/feelings/jealousy - Jealousy zone
/body/senses - Senses hall  
/body/actions - Actions hall
/battle/[nutId] - Kama battle interface
/inventory - Unassigned NUTs list
/library - Your klesha solutions
```

#### Route Implementation Tasks

##### 3.1 Core Navigation Pages
- [ ] Create `/` index with kingdom map ASCII
- [ ] Create `/body/index.astro` with zone list
- [ ] Create `/mind/index.astro` with zone list
- [ ] Add navigation between kingdoms

##### 3.2 Zone Pages
- [ ] Create `/mind/feelings/index.astro` - feelings hall
- [ ] Create `/mind/feelings/anger.astro` - anger zone
- [ ] Create `/mind/feelings/jealousy.astro` - jealousy zone
- [ ] Create `/body/senses/index.astro` - senses hall
- [ ] Create `/body/actions/index.astro` - actions hall

##### 3.3 Battle System Pages
- [ ] Create `/battle/[nutId].astro` - dynamic battle page
- [ ] Create `/inventory/index.astro` - unassigned NUTs
- [ ] Create `/library/index.astro` - klesha solutions

##### 3.4 NUT Bar Component
- [ ] Create `src/components/NUTBar.astro` component
- [ ] Add fixed positioning at bottom of viewport
- [ ] Import in Layout.astro (always visible)
- [ ] Text input with N/U/T type selector
- [ ] Emotion selector and intensity slider
- [ ] Mark as klesha checkbox
- [ ] Collapsed/expanded states

##### 3.5 Data Persistence
- [ ] Install @nanostores/persistent
- [ ] Create nuts store for NUT storage
- [ ] Create zones store for zone health
- [ ] Create library store for solutions
- [ ] Save to localStorage on capture

**No Inference - Manual Control:**
- [ ] NO auto-tagging, NO type detection
- [ ] NO suggestions or autocomplete
- [ ] NO pattern recognition
- [ ] User has complete manual control

#### Inventory System (Unassigned NUTs)
- [ ] Create inventory panel for captured but unassigned NUTs
- [ ] Show list: type icon, content, timestamp
- [ ] Manual action buttons: [Assign to Zone] [Delete]
- [ ] Click "Assign" shows flat list of all zones
- [ ] User picks zone manually - NUT moves there
- [ ] No pattern detection, no suggestions

#### Core Gameplay Loop: NUT Offering System
- [ ] **Capture Phase**: Log NUT via NUT Bar (unassigned/inventory)
- [ ] **Navigation Phase**: Visit locations in kingdom
- [ ] **Notification Phase**: Zone NPCs/entities request attention
- [ ] **Dialog Phase**: Simple dialog interaction
- [ ] **Offering Phase**: Offer NUT to location/NPC
- [ ] **Storage Phase**: NUT gets stored in that zone permanently

This creates the reality bridge where:
- Player logs real thoughts/feelings/tasks
- These become resources in the game world
- NPCs/zones "consume" these NUTs as offerings
- Building relationships and unlocking content

## Technical Considerations

### Data Structure
```typescript
interface NUT {
  id: string;
  timestamp: Date;
  type: 'note' | 'urge' | 'task';
  content: string;
  tags: string[];
  guildTags?: string[];
}
```

### Storage Strategy
- Use nanostores with @nanostores/persistent for reactive state
- LocalStorage for immediate persistence
- Supabase for live testing

### Component Architecture
- Shared Layout wrapper for consistent navigation
- Reusable NUT components (input, display, list)
- Zone-specific templates extending base components
- Reactive stores for cross-component state

## Success Criteria
- [ ] Can navigate to any zone from the index sitemap
- [ ] Can capture NUTs with proper type/content/tags
- [ ] HUD dashboard shows aggregated data
- [ ] Responsive design works on mobile

