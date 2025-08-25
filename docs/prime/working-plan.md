# Development Plan: Mobile-First Offline PWA with Alpine.js

## Overview
Build a mobile-first, offline-capable PWA for immediate dogfooding on phone. Uses minimal tech stack (HTML + Alpine.js + Tailwind) with no build complexity, enabling rapid iteration based on real daily usage.

## Core Principles
- **Mobile-first**: Designed for thumb-friendly phone use
- **Offline-first**: Works without internet from day 1
- **Dogfood daily**: Deploy and use immediately, iterate based on pain points
- **No build complexity**: Direct HTML/JS files, instant deployment
- **Progressive enhancement**: Start simple, add features based on actual needs

## Tech Stack
- **HTML**: Static pages (no SSR needed)
- **CSS**: Tailwind CSS via CDN
- **JS**: Alpine.js (33kb) + Vanilla JS
- **Storage**: LocalStorage → IndexedDB (progressive)
- **Offline**: Service Worker + Cache API
- **Hosting**: Cloudflare Pages (instant deploys)
- **Dev Server**: Python http.server (zero config)

## Architecture

```
Mobile PWA Architecture:
┌─────────────────────┐
│   index.html        │ (Single entry point)
├─────────────────────┤
│   Service Worker    │ (Offline caching)
├─────────────────────┤
│   Alpine.js App     │ (Reactive state)
├─────────────────────┤
│   LocalStorage      │ (Initial storage)
├─────────────────────┤
│   IndexedDB         │ (Future: unlimited storage)
└─────────────────────┘
         ↓ (when online)
    [Supabase Sync]
```

## Implementation Phases

### Phase 1: Get It On Your Phone TODAY (2-3 hours)

#### Tasks
- [x] Create project structure
  ```
  /
  ├── index.html (main app)
  ├── manifest.json (PWA manifest)
  ├── sw.js (service worker)
  ├── app.js (Alpine components)
  └── icon-192.png (app icon)
  ```

- [x] Create mobile-first index.html
  - [x] Viewport meta tag
  - [x] Tailwind CDN
  - [x] Alpine.js CDN
  - [x] Bottom NUT capture bar
  - [x] Basic kingdom navigation

- [x] Add PWA manifest for installation
  ```json
  {
    "name": "Lilaya",
    "short_name": "Lilaya",
    "start_url": "/",
    "display": "standalone",
    "theme_color": "#1a1a1a",
    "background_color": "#000000",
    "icons": [{
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }]
  }
  ```

- [ ] Implement basic service worker
  - [ ] Cache app shell
  - [ ] Offline fallback
  - [ ] Cache-first strategy

- [ ] Create Alpine.js data store
  ```javascript
  Alpine.store('app', {
    nuts: [],
    addNut(content, type) {
      const nut = { 
        id: Date.now(), 
        content, 
        type,
        timestamp: new Date()
      };
      this.nuts.push(nut);
      localStorage.setItem('nuts', JSON.stringify(this.nuts));
    }
  });
  ```

- [ ] Deploy to Cloudflare Pages
- [ ] Install on phone and test

#### Success Criteria
- [ ] App installs on phone home screen
- [ ] Opens offline after first visit
- [ ] Can capture a NUT
- [ ] Data persists after app close

### Phase 2: Core Mobile UX (This Week)

#### Tasks
- [ ] Optimize NUT capture for mobile
  - [ ] Auto-focus input on open
  - [ ] Large touch targets (min 44px)
  - [ ] Keyboard-aware positioning
  - [ ] Swipe gestures for type selection

- [ ] Add kingdom navigation
  - [ ] Bottom tab navigation
  - [ ] Swipe between kingdoms
  - [ ] Visual zone indicators

- [ ] Implement inventory view
  - [ ] Scrollable NUT list
  - [ ] Pull-to-refresh pattern
  - [ ] Long-press for actions

- [ ] Add basic filtering/search
  - [ ] Filter by type
  - [ ] Search by content
  - [ ] Sort by date

#### Daily Dogfooding Protocol
1. Morning: Deploy latest changes
2. Use throughout day for real capture
3. Note top 3 annoyances
4. Evening: Fix those specific issues
5. Repeat next day

### Phase 3: Enhanced Storage (Week 2)

#### Tasks
- [ ] Migrate to IndexedDB via Dexie.js
  ```javascript
  const db = new Dexie('LilayaDB');
  db.version(1).stores({
    nuts: '++id, type, kingdom, zone, timestamp',
    kingdoms: 'name',
    sessions: '++id'
  });
  ```

- [ ] Add data export/import
  - [ ] Export as JSON
  - [ ] Import backup
  - [ ] Clear all data

- [ ] Implement offline queue
  - [ ] Track pending changes
  - [ ] Show sync status
  - [ ] Retry on connection

### Phase 4: Supabase Sync (Week 3)

#### Tasks
- [ ] Add Supabase client (CDN)
- [ ] Implement anonymous auth
- [ ] Create two-way sync
  - [ ] Push local changes
  - [ ] Pull remote changes
  - [ ] Conflict resolution

- [ ] Add sync indicators
  - [ ] Last sync time
  - [ ] Pending changes count
  - [ ] Sync in progress

- [ ] Background sync
  - [ ] Use Background Sync API
  - [ ] Periodic sync when online
  - [ ] Sync on app open

### Phase 5: Progressive Enhancement (Week 4+)

Based on actual usage patterns:
- [ ] Add features users actually need
- [ ] Optimize pain points discovered through dogfooding
- [ ] Enhance based on real usage data

## File Structure

```
life-hud/
├── index.html          # Main app
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── app.js             # Alpine components/stores
├── icon-192.png      # App icon
├── icon-512.png      # Splash screen icon
└── _redirects         # Cloudflare Pages config
```

## Key Mobile Patterns

### Bottom Navigation (Thumb-Friendly)
```html
<nav class="fixed bottom-0 left-0 right-0 h-16 bg-black">
  <!-- All controls within thumb reach -->
</nav>
```

### NUT Capture Bar
```html
<div class="fixed bottom-16 left-0 right-0 p-4" 
     x-data="{ open: false, type: 'note' }">
  <button @click="open = !open" 
          class="w-full p-4 bg-blue-600 rounded-lg">
    + Add NUT
  </button>
  <div x-show="open" x-transition>
    <!-- Capture form -->
  </div>
</div>
```

### Offline Detection
```javascript
window.addEventListener('online', () => {
  Alpine.store('app').isOnline = true;
  Alpine.store('app').sync();
});

window.addEventListener('offline', () => {
  Alpine.store('app').isOnline = false;
});
```

## Development Workflow

### Local Development
```bash
# Start local server
python -m http.server 8000

# Expose to phone for testing
ngrok http 8000
# OR use local IP: http://192.168.x.x:8000
```

### Deployment
```bash
# Just push to GitHub
git push origin main
# Cloudflare Pages auto-deploys
```

### Testing on Phone
1. Open deployed URL on phone
2. Add to home screen
3. Test offline mode (airplane mode)
4. Use for real throughout day
5. Note issues and iterate

## Success Metrics

### Week 1
- [ ] Installed on phone
- [ ] Used to capture 10+ real NUTs
- [ ] Works fully offline
- [ ] Sub-1 second response time

### Week 2
- [ ] 50+ NUTs captured
- [ ] No data loss incidents
- [ ] Comfortable daily usage
- [ ] Clear upgrade path identified

### Week 3
- [ ] Syncing to Supabase
- [ ] Multi-device support working
- [ ] 100+ NUTs managed effectively

## Anti-Patterns to Avoid

❌ **Don't**: Build perfect architecture first
✅ **Do**: Ship and iterate based on usage

❌ **Don't**: Test on desktop browser only
✅ **Do**: Use on actual phone daily

❌ **Don't**: Add features speculatively
✅ **Do**: Add only what you actually need

❌ **Don't**: Optimize prematurely
✅ **Do**: Fix actual pain points

## Next Steps

1. Create basic file structure
2. Write minimal HTML with Alpine
3. Add service worker
4. Deploy to Cloudflare
5. Install on phone
6. Start using immediately
7. Iterate based on real usage