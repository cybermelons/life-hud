# Life HUD - Project Context for Claude

## Project Overview

Life HUD is a Progressive Web App (PWA) for capturing and syncing NUTs (Notes, URLs, Todos). It's designed as an offline-first application with optional sync capabilities through Supabase authentication.

## Technical Stack

- **Frontend**: Vanilla JavaScript with Alpine.js for reactivity (loaded via CDN)
- **Styling**: Tailwind CSS (loaded via CDN)
- **Icons**: Tabler Icons (loaded via CDN)
- **Backend**: Supabase for authentication and data sync
- **Deployment**: Cloudflare Workers with Assets binding
- **Storage**: LocalStorage for offline, Supabase PostgreSQL for sync

## Key Implementation Details

### Architecture Decisions

1. **No Build Step**: The app uses vanilla HTML/JS/CSS with CDNs for dependencies. No Astro, Vite, or other build tools.
2. **Offline-First**: Full functionality without internet connection using localStorage
3. **Login-Gated Sync**: Sync features only available after social login
4. **Lazy Supabase**: Supabase SDK only initializes when user attempts to sync

### File Structure

```
/
├── index.html          # Main dashboard
├── inventory.html      # NUT capture interface
├── library.html        # Library page
├── app.js             # Core application logic with Alpine store
├── components.js      # Shared UI components
├── sw.js             # Service worker for offline support
├── manifest.json     # PWA manifest
├── worker.js         # Cloudflare Worker for routing
└── wrangler.toml     # Cloudflare deployment config
```

### Deployment

The app is deployed to Cloudflare Workers using the Assets binding:

```toml
# wrangler.toml
name = "life-hud"
main = "worker.js"
assets = { directory = "./", binding = "ASSETS" }
```

Deploy with: `pnpx wrangler deploy`

### Authentication Flow

1. User works offline by default (no Supabase connection)
2. When user clicks "Login to Sync", show social auth options
3. User logs in via Google/GitHub/Discord
4. On successful auth, migrate localStorage data to Supabase
5. Enable real-time sync across devices

### Database Schema

```sql
CREATE TABLE nuts (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    content TEXT,
    type TEXT NOT NULL,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted BOOLEAN DEFAULT false
);
```

### Key Functions in app.js

- `initSupabase()`: Lazy initialization of Supabase client
- `signInWith(provider)`: Social authentication
- `syncToSupabase()`: Push local changes to cloud
- `syncFromSupabase()`: Pull cloud changes to local
- `captureNUT()`: Parse and save new NUT entry

## Common Development Tasks

### Adding a New Page

1. Create the HTML file (e.g., `newpage.html`)
2. Include Alpine.js and app.js scripts
3. Add route mapping in `worker.js`
4. Update service worker cache list if needed

### Updating Sync Logic

The sync logic is in `app.js`. Key considerations:
- Always check `this.user` before sync operations
- Handle offline gracefully
- Merge conflicts favor most recent update

### Testing Locally

Since there's no dev server, you can:
1. Use a simple HTTP server: `python -m http.server`
2. Or deploy to Workers and test: `pnpx wrangler deploy`

## Important Notes

- **No Astro**: This project originally had Astro but it was removed. Don't add it back.
- **Keep it Simple**: Vanilla JS + Alpine.js is sufficient for this app
- **Offline First**: Every feature should work offline
- **Progressive Enhancement**: Sync is an enhancement, not a requirement

## Environment Variables

Supabase credentials are hardcoded in `app.js` (public anon key is safe to expose):
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key

## Live URL

https://life-hud.am0ottrv.workers.dev