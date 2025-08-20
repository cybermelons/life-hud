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

### Phase 3: NUT Capture System & Core Gameplay Loop

#### NUT Bar Implementation (No Inference - Manual Control)
- [ ] Create NUT input component -> NUT Bar. Like a text input for imessage or signal chat app.
  - Simple text input field
  - Three manual type buttons: [Note] [Urge] [Task]
  - User picks type explicitly (no detection/inference)
  - Enter to save to inventory
  - Clear field after capture
  - Available all the time, like in toggl
- [ ] Add localStorage persistence via @nanostores/persistent
- [ ] Create confirmation toast system for feedback
- [ ] NO auto-tagging, NO inference, NO suggestions

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

