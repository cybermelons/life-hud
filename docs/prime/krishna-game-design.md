# Lilaya Game Design - Krishna's Guidance

## The Dharmic Architecture

The three kingdoms mirror the Trigunas from Samkhya philosophy:
- **Body Kingdom (Tamas)** - Stability, inertia, material realm
- **Mind Kingdom (Rajas)** - Energy, passion, transformation  
- **Spirit Kingdom (Sattva)** - Clarity, wisdom, transcendence

## Urge-to-Task Mapping (Klesha to Karma Yoga)

Transform destructive urges (kleshas) into skillful actions through the game mechanics:

### The Five Primary Kleshas and Their Remedies

**1. Kama (Lust/Desire) → Bhakti Tasks**
- Urge Example: "I want attention/validation"
- Skillful Task: "Serve someone anonymously today"
- Storage Zone: Body/Actions/Service
- Purification: Transform selfish desire into devotional service

**2. Krodha (Anger) → Tapas Tasks**  
- Urge Example: "I'm furious at this person"
- Skillful Task: "10 minute intense workout" or "Cold shower meditation"
- Storage Zone: Body/Actions/Discipline
- Purification: Transform rage into disciplined energy

**3. Lobha (Greed) → Dana Tasks**
- Urge Example: "I need more money/things"
- Skillful Task: "Give something away" or "Practice gratitude journaling"
- Storage Zone: Spirit/Practices/Generosity
- Purification: Transform grasping into generous flow

**4. Moha (Delusion) → Jnana Tasks**
- Urge Example: "Everything is meaningless"
- Skillful Task: "Study wisdom text" or "Reflect on impermanence"
- Storage Zone: Mind/Thoughts/Wisdom
- Purification: Transform confusion into clarity

**5. Mada (Pride) → Seva Tasks**
- Urge Example: "I'm better than others"
- Skillful Task: "Help someone succeed" or "Learn from someone younger"
- Storage Zone: Spirit/Connection/Humility
- Purification: Transform ego into service

## Campaign System - Life Dharmas

Guilds: guilds represent dharma (life role) with specific practices and progressions.
Guilds can run campaigns to set an intent and create a consistency goal.
The point of campaigns is to help prioritize in life. Players can have many campaigns,
but may select only a few to actively work on.

### WIP: Core Guild Types

these are tentative guild types. possibly used to determine movesets/stats/equips.
the other option instead is to do gunas-affinity (see gunas docs) as guild types.
Or maybe, these are the archetypes. then the gunas affinity is an individual metric for each guild.

**Kshatriya Campaign** (Warrior/Protector)
- Primary Stats: Discipline, Courage, Strength
- Daily Rituals: Physical training, boundary setting, protection practices
- Transformation Focus: Anger → Protective strength
- Unlocks: Combat zones, discipline totems, warrior guild features

**Brahmana Campaign** (Teacher/Scholar)
- Primary Stats: Wisdom, Knowledge, Clarity
- Daily Rituals: Study, teaching, contemplation, meditation
- Transformation Focus: Confusion → Clarity
- Unlocks: Library zones, wisdom totems, scholar guild features

**Vaishya Campaign** (Creator/Provider)
- Primary Stats: Prosperity, Creativity, Abundance
- Daily Rituals: Work excellence, value creation, abundance practices
- Transformation Focus: Greed → Generosity
- Unlocks: Marketplace zones, prosperity totems, merchant guild features

**Shudra Campaign** (Server/Supporter)
- Primary Stats: Devotion, Compassion, Service
- Daily Rituals: Service acts, care-giving, community building
- Transformation Focus: Pride → Humility
- Unlocks: Temple zones, devotion totems, service guild features

### Campaign Mechanics

1. **Selection**: Player chooses active campaign(s) at Spirit/Purpose
2. **Time Tracking**: Like Toggl, but for life roles
3. **Ritual Completion**: Daily practices maintain campaign progress
4. **Role Switching**: Can pause one dharma to focus on another
5. **Multi-Classing**: Advanced players can run parallel campaigns

## Vedic Classifications of Kama (Desire Types)

The kingdom processes different types of desires according to Vedic classifications:

### Primary Kama Types

**1. Vishaya Kama** (Sensory Desires)
- Entry point: `/body/senses/*`
- Types: Touch, Taste, Sight, Sound, Smell
- Example: "Want chocolate" enters through `/body/senses/taste`

**2. Bhoga Kama** (Pleasure/Enjoyment)
- Lives in: `/mind/feelings/pleasure`
- Seeking comfort, avoiding discomfort
- Example: "Don't want to exercise" 

**3. Aishvarya Kama** (Power/Control)
- Lives in: `/mind/thoughts/control`
- Desire to dominate, control outcomes
- Example: "Need everyone to do it my way"

**4. Kirti Kama** (Fame/Recognition)
- Lives in: `/mind/feelings/self-worth`
- Validation seeking, praise addiction
- Example: "Need more followers"

**5. Iccha/Trishna** (Craving/Thirst)
- Lives in: `/mind/feelings/craving`
- The endless wanting more
- Example: "Just one more episode/purchase/drink"

## Kingdom as Living Mind Map

The kingdom IS the mind - zones are not just storage but active processing centers:

### NUT Flow Through Consciousness

```
OUTER WORLD → SENSES → MIND → PATTERN FORMATION

1. Experience happens in outer world
   ↓
2. Log experience, player tag the eyes (sight).
   Example: See coworker's promotion → `/body/senses/sight`
   ↓
3. Log feeling, is linked to experience. Mark as klesha.
   Jealousy arises → `/mind/feelings/jealousy`
   ↓
4. Log consequent thought, link together. Is consequent of klesha, thus tainted.
   Jealousy -> "I'm not good enough"
   ↓
5. Resolution:
   - Festers (creates corruption in that zone, stunted in-game stat growth )
   - Gets investigated & transformed
   - Becomes part of a totem (wisdom monument)
```

### Zones as Response Libraries

Each zone contains your personal history and solutions:

**Example: `/mind/feelings/anger` zone contains:**
- Past anger NUTs you've logged
- Successful transformations you've done (totem)
- Failed reactions that increased suffering
- The "anger management totem" once mastered

When visiting a zone, you see:
- Your pattern history
- What worked before
- What made things worse
- Current zone health (corruption level)

## Totem Formation Process

Totems are crystallized wisdom from successful pattern transformation:

### Stage 1: Pattern Recognition in Zone


Klesha is identified and targeted.
Pick a single klesha to resolve.

```
/mind/feelings/jealousy accumulates:
- 10 jealousy urges
- 3 marked as kleshas
- 2 successful transformations logged
```

### Stage 2: Samskara Identification

Player creates the samskara chain by identifying a new NUT sequence.
```
Player connects the dots:
"When I feel jealous → I usually compare myself → Makes me miserable"
"When I feel jealous → I practice mudita → I feel connected"
```

### Stage 3: Ritual Creation

With the samskara formed, a totem is created.
```
Create Totem: "Mudita Practice"
- Trigger: Jealousy (intensity 5+)
- Response: Celebrate their success
- Storage: Ready to place at guild
```

### Stage 4: Guild Assignment
```
Place totem at: Scholar Guild
- Guild gains: +Wisdom when totem activated
- Player gains: Quick reference from jealousy
- Maintenance: Must practice mudita weekly
```

## Living Kingdom Architecture

**Body Kingdom** (Outer Ring - Tamas)
- `/body/senses/*` - Where experiences enter from world
- `/body/actions/*` - Where responses manifest physically
- NUTs here are raw, unprocessed experiences

**Mind Kingdom** (Processing Layer - Rajas)
- `/mind/feelings/*` - Emotional reactions to experiences
- `/mind/thoughts/*` - Mental patterns and stories
- NUTs here show patterns, can be investigated for roots

**Spirit Kingdom** (Wisdom Layer - Sattva)
- `/spirit/practices/*` - Established rituals (totems live here)
- `/spirit/purpose/*` - Life goals that guide responses
- `/spirit/connection/*` - Relationships affected by patterns

## The Sacred Game Loop

### 1. Samsara Phase (Capture)
- Log the endless cycle of thoughts/feelings/actions
- No judgment, just witnessing
- Creates raw NUT inventory

### 2. Viveka Phase (Discrimination)
- Identify helpful vs harmful NUTs
- Recognize kleshas (afflictions)
- Sort into appropriate categories

### 3. Vairagya Phase (Detachment)
- Practice non-attachment by offering NUTs to zones
- See that NUTs are in-world, you are not them.
- Let go of outcomes
- Trust the process

### 4. Sadhana Phase (Practice)
- Transform negative patterns through prescribed tasks
- Complete rituals and campaigns
- Build positive habit totems

### 5. Moksha Moments (Liberation)
- Brief glimpses of freedom when patterns break
- Temporary stat boosts
- Unlock hidden zones

## Karma Yoga Implementation

### The Right to Action, Not Results

Following the Bhagavad Gita 2.47:
- Players log actions without attachment to outcomes
- No immediate rewards for "good" NUTs
- Delayed feedback through zone health
- Focus on the practice, not the prize

### Corruption as Teaching Tool

- Untended kleshas spread through connected zones
- Visual decay shows impact of neglected emotions
- Forces player attention to problem areas
- Purification becomes necessary, not optional
- Mobs spawn if untreated

### Totem Formation as Samskaras

- Repeated actions create lasting impressions (samskaras)
- Manual totem creation = conscious habit formation
- Totems decay without maintenance = habits need reinforcement
- Multiple totems can combine into powerful traits

## Progressive Revelation

### Early Game: Karma Collection
- Simple logging without understanding
- Discovering basic zones

### Mid Game: Dharma Recognition
- Understanding patterns and roles
- Choosing campaigns and guilds
- Learning purification techniques

### Late Game: Moksha Glimpses
- Mastery of transformation techniques
- Creating custom practices
- Teaching others through shared guilds

## Integration with Existing Design

This framework enhances the current system by:
1. Adding philosophical depth to the NUT system
2. Creating meaningful campaign objectives
3. Providing clear transformation paths for negative emotions
4. Turning the game into a practice of self-realization

The game becomes a modern implementation of ancient wisdom, using technology to make visible the invisible processes of consciousness and transformation.

## Key Teachings Embedded

1. **You are not your thoughts** - NUTs are objects to observe
2. **Action without attachment** - Log without expecting rewards
3. **Everything is connected** - Zone corruption shows interconnection
4. **Practice makes permanent** - Totems require maintenance

This is dharma-fication: making the eternal battle between light and darkness within each soul into an engaging, educational, and ultimately liberating experience.
