# Development Plan: Life HUD MVP - NUT Journaling Mind Palace

## Overview
Build a functional MVP for the Life HUD journaling system that implements the core NUT (Note/Urge/Task) capture functionality with zone-based tagging and a complete development sitemap for easy navigation during development.

## Approach
Create a modular Astro-based web app with local storage persistence, progressive zone discovery, and specialized journaling interfaces for each life awareness zone (body/mind/spirit).

we need the design to be so i can work on this bit by bit, start dogfooding it immediately.
i don't want to deal with signup but i do want to use supabase because i could use anonymous sessions, and I want to save the data to an account later. like person uses it ASAP.

i plan for it to start logging random thoughts twitter style, reacting to them discord-style afterwards, or tagging reacts while composing.

the goal is to be functional, effective, and quick. so we'll be using ssr, but
i do want offline capability as a PWA, that syncs to supabase.


## Implementation Checklist

### Phase 1: Core Architecture Setup
- [ ] Create shared Layout component with navigation and consistent styling
- [ ] Define TypeScript interfaces for NUT data types
- [ ] Set up nanostores for state management
- [ ] Implement local storage persistence layer for NUTs
- [ ] Create zone discovery state management system
- [ ] Set up stores for user profile and guild data

### Phase 2: Complete Sitemap on Index Page
- [ ] Transform index page into comprehensive development sitemap
- [ ] Add all body zones hierarchy (senses, actions, muscles with all subgroups)
- [ ] Add all mind zones hierarchy (thoughts, feelings with subcategories)
- [ ] Add all spirit zones hierarchy (connection, purpose, practices)
- [ ] Add zone discovery progress indicator
- [ ] Add quick NUT capture section on index
- [ ] Style with appropriate zone coloring (green/blue/purple)
- [ ] Add navigation breadcrumbs component

### Phase 3: NUT Capture System
- [ ] Create NUT input component -> NUT Bar. Like a text input for imessage or signal chat app.
- [ ] Add content input field with auto-expanding textarea
- [ ] Implement timestamp auto-capture
- [ ] Create tag selector based on unlocked zones
- [ ] Add zone association multi-select
- [ ] Implement Quick Capture Widget for index page
- [ ] Create zone-specific input templates

### Phase 4: Zone Pages with NUT Display
- [ ] Update all body zone pages with NUT functionality
- [ ] Update all mind zone pages with NUT functionality
- [ ] Update all spirit zone pages with NUT functionality
- [ ] Add zone-specific NUT input forms
- [ ] Display NUTs tagged to each zone
- [ ] Add zone health/corruption indicators
- [ ] Show discovery state (locked/unlocked)
- [ ] Implement breadcrumb navigation on all pages
- [ ] Add zone-specific analytics/stats

### Phase 5: HUD Dashboard
- [ ] Create main dashboard at /hud route
- [ ] Implement recent NUT stream with filters
- [ ] Add zone health overview visualization
- [ ] Display quick stats and metrics
- [ ] Show active patterns/chains detection
- [ ] Add floating quick capture button
- [ ] Create mini-map of mind palace
- [ ] Add daily/weekly summary views

### Phase 6: Data Persistence & Management
- [ ] Implement robust local storage for all NUTs
- [ ] Add export functionality (JSON/CSV)
- [ ] Add import functionality
- [ ] Create basic backup system
- [ ] Implement data migration for schema changes
- [ ] Add clear data option with confirmation

## Technical Considerations

### Data Structure
```typescript
interface NUT {
  id: string;
  timestamp: Date;
  type: 'note' | 'urge' | 'task';
  content: string;
  tags: string[];
  zones: string[];
  guildTags?: string[];
}

interface Zone {
  id: string;
  path: string;
  unlocked: boolean;
  nutCount: number;
  health: number;
}
```

### Storage Strategy
- Use nanostores with @nanostores/persistent for reactive state
- LocalStorage for immediate persistence
- Future: IndexedDB for larger datasets
- Export/Import via JSON files

### Component Architecture
- Shared Layout wrapper for consistent navigation
- Reusable NUT components (input, display, list)
- Zone-specific templates extending base components
- Reactive stores for cross-component state

## Success Criteria
- [ ] Can navigate to any zone from the index sitemap
- [ ] Can capture NUTs with proper type/content/tags
- [ ] NUTs persist across page refreshes
- [ ] Each zone displays its associated NUTs
- [ ] HUD dashboard shows aggregated data
- [ ] Zone discovery state is tracked
- [ ] Export/import functionality works
- [ ] Responsive design works on mobile

## Next Steps After MVP
- Guild system implementation
- Pattern recognition and CBT exercises
- Multiplayer/sharing features
- Advanced analytics and visualizations
- API backend for cloud sync
