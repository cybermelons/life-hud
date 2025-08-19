# Life HUD - Awareness Tracking System

A hierarchical awareness system that maintains a HUD (Heads-Up Display) of body, mind, and spirit awareness, with detailed breakdowns for tracking and developing each aspect.

## Architecture

- **Framework**: Astro with SSR
- **Deployment**: Cloudflare Workers
- **Styling**: Tailwind CSS
- **State Management**: Nanostores
- **Database**: Cloudflare D1 (planned)

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

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Deploy to Cloudflare
pnpm run deploy
```

## HUD Concept

The HUD provides real-time awareness tracking across all dimensions, presenting a unified view of your body-mind-spirit state. Each component can be expanded for detailed tracking and exercises.

## Implementation Status

- ✅ Basic structure created
- ✅ Main navigation pages
- ⏳ Individual tracking pages (WIP)
- ⏳ Data persistence layer
- ⏳ Real-time HUD display
- ⏳ Cloudflare Workers deployment
