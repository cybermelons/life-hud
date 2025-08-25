# Life HUD - NUT Capture PWA

A Progressive Web App (PWA) for capturing and syncing NUTs (Notes, URLs, Todos) with real-time sync capabilities.

## Architecture

- **Frontend**: Vanilla JavaScript with Alpine.js for reactivity
- **Styling**: Tailwind CSS via CDN
- **Icons**: Tabler Icons
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Cloudflare Workers with Assets
- **State**: LocalStorage with Supabase sync

## Page Structure

```
/
├── index                        # Main dashboard with three pillars overview
├── hud/                        # HUD system implementation
│   ├── index                   # Real-time awareness display dashboard
│   ├── display                 # Visual representation configuration
│   ├── tracking                # Data collection methods and sensors
│   ├── metrics                 # Measurement systems and scoring
│   └── integration             # How components connect and sync
│
├── body/                       # Physical awareness tracking
│   ├── index                   # Body awareness overview and navigation
│   ├── senses/                # Organs of Sense (Jnanendriyas)
│   │   ├── index              # Five senses overview and exercises
│   │   ├── sight              # Visual perception exercises and eye health
│   │   ├── hearing            # Auditory awareness and sound meditation
│   │   ├── smell              # Olfactory training and scent awareness
│   │   ├── taste              # Mindful eating and flavor perception
│   │   └── touch              # Tactile awareness and body scanning
│   │
│   └── actions/               # Organs of Action (Karmendriyas)
│       ├── index              # Five actions overview and practices
│       ├── speech             # Voice training and communication exercises
│       ├── grasping           # Hand dexterity and grip strength training
│       ├── locomotion         # Movement patterns and walking meditation
│       ├── excretion          # Digestive health and elimination tracking
│       ├── reproduction       # Sexual health and energy management
│       └── muscles/           # Gym module for physical training
│           ├── index          # Muscle group overview and workout plans
│           ├── upper/
│           │   ├── chest      # Chest exercises and development tracking
│           │   ├── back       # Back strength and posture improvement
│           │   ├── shoulders  # Shoulder mobility and strength
│           │   ├── biceps     # Bicep isolation exercises
│           │   └── triceps    # Tricep development routines
│           ├── lower/
│           │   ├── quads      # Quadriceps strength training
│           │   ├── hamstrings # Hamstring flexibility and power
│           │   ├── glutes     # Glute activation and development
│           │   └── calves     # Calf raises and endurance
│           ├── core/
│           │   ├── abs        # Abdominal strength and definition
│           │   └── obliques   # Side core and rotational strength
│           └── compound/
│               └── movements  # Multi-muscle compound exercises
│
├── mind/                      # Mental awareness tracking
│   ├── index                  # Mind overview and cognitive health
│   ├── thoughts/              # Cognitive processes and mental patterns
│   │   ├── index              # Thought awareness and metacognition
│   │   ├── observations      # Present moment awareness and noticing
│   │   ├── planning          # Future projection and goal setting
│   │   ├── memories          # Past experience processing and recall
│   │   ├── imagination       # Creative thinking and visualization
│   │   └── analysis          # Logic, reasoning, and problem-solving
│   │
│   └── feelings/              # Emotional awareness and regulation
│       ├── index              # Emotional intelligence overview
│       ├── primary/           # Basic emotional states
│       │   ├── joy           # Happiness tracking and cultivation
│       │   ├── sadness       # Grief processing and acceptance
│       │   ├── anger         # Anger management and channeling
│       │   ├── fear          # Fear recognition and courage building
│       │   ├── disgust       # Aversion awareness and boundaries
│       │   └── surprise      # Spontaneity and adaptability
│       ├── complex/           # Nuanced emotional experiences
│       │   ├── guilt         # Guilt processing and forgiveness
│       │   ├── shame         # Shame resilience and self-compassion
│       │   ├── pride         # Healthy pride and accomplishment
│       │   └── envy          # Envy transformation and gratitude
│       └── sensations/        # Body-mind connection
│           ├── tension       # Physical tension and stress mapping
│           ├── relaxation    # Relaxation response and calm states
│           └── energy        # Energy levels and vitality tracking
│
└── spirit/                    # Spiritual awareness (optional)
    ├── index                  # Spiritual dimension overview
    ├── connection/            # Relationship awareness
    │   ├── index              # Connection overview and practices
    │   ├── self               # Self-connection and inner dialogue
    │   ├── others             # Interpersonal relationships and empathy
    │   ├── nature             # Environmental connection and grounding
    │   └── universe           # Cosmic awareness and interconnection
    ├── purpose/               # Life meaning and direction
    │   ├── index              # Purpose discovery and alignment
    │   ├── values             # Core values identification and living
    │   ├── meaning            # Life meaning and existential exploration
    │   └── goals              # Life goals and legacy building
    └── practices/             # Spiritual exercises
        ├── index              # Practice overview and scheduling
        ├── meditation         # Meditation techniques and tracking
        ├── prayer             # Prayer practices and contemplation
        ├── rituals            # Personal rituals and ceremonies
        └── gratitude          # Gratitude practices and appreciation
```

## Features

- **Offline-First**: Works completely offline with localStorage
- **Quick Capture**: Fast NUT entry with keyboard shortcuts
- **Smart Parsing**: Automatically detects URLs and formats them
- **Social Auth**: Login with Google, GitHub, or Discord
- **Real-time Sync**: Syncs across devices when logged in
- **PWA**: Installable as a native app
- **Service Worker**: Offline caching and background sync

## Development

```bash
# Install dependencies
pnpm install

# Deploy to Cloudflare Workers
pnpm run deploy

# The app runs at https://life-hud.am0ottrv.workers.dev
```

## Deployment Configuration

The app uses Cloudflare Workers with the Assets binding for static file serving:

```toml
# wrangler.toml
name = "life-hud"
compatibility_date = "2024-01-01"
main = "worker.js"
assets = { directory = "./", binding = "ASSETS" }
```

The worker handles:
- Clean URL routing (e.g., `/inventory` → `/inventory.html`)
- Static asset serving
- PWA manifest and service worker

## Supabase Setup

1. Create a new Supabase project
2. Run the migration in `supabase-migration.sql`
3. Enable OAuth providers (Google, GitHub, Discord)
4. Update `app.js` with your Supabase URL and anon key

## Implementation Status

- ✅ NUT capture interface
- ✅ LocalStorage persistence
- ✅ Supabase authentication
- ✅ Cross-device sync
- ✅ PWA with service worker
- ✅ Cloudflare Workers deployment
- ✅ Clean URL routing
- ✅ Social login (Google, GitHub, Discord)
