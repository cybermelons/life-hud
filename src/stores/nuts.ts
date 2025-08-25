import { atom } from 'nanostores';
import type { NUT } from '../lib/types';
import { activeGuildIdStore } from './guilds';
import { activeSessionStore, addNutToSession } from './campaigns';

// Sample NUTs for development
const sampleNUTs: NUT[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 3600000),
    type: 'note',
    content: 'Feeling energized after morning workout',
    tags: ['body', 'muscles', 'energy'],
    zones: ['/body/actions/muscles'],
    reactions: ['💪', '🔥']
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 7200000),
    type: 'task',
    content: 'Complete 3 sets of bicep curls',
    tags: ['body', 'muscles', 'bicep'],
    zones: ['/body/actions/muscles/upper'],
    reactions: ['✅']
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1800000),
    type: 'urge',
    content: 'Want to go for a walk in the park',
    tags: ['body', 'locomotion', 'nature'],
    zones: ['/body/actions/locomotion'],
    reactions: ['🚶', '🌳']
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 900000),
    type: 'note',
    content: 'Interesting pattern: I always feel creative after coffee',
    tags: ['mind', 'observation', 'pattern'],
    zones: ['/mind/thoughts/observations'],
    reactions: ['☕', '💡']
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 600000),
    type: 'task',
    content: 'Meditate for 10 minutes',
    tags: ['spirit', 'practice', 'meditation'],
    zones: ['/spirit/practices'],
    reactions: ['🧘', '✨']
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 300000),
    type: 'urge',
    content: 'Feeling anxious about tomorrow\'s meeting',
    tags: ['mind', 'feeling', 'anxiety'],
    zones: ['/mind/feelings/primary'],
    reactions: ['😰']
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 60000),
    type: 'note',
    content: 'Just realized I haven\'t drunk water in 3 hours',
    tags: ['body', 'awareness', 'hydration'],
    zones: ['/body/senses/taste'],
    reactions: ['💧', '😅']
  }
];

export const nutsStore = atom<NUT[]>(sampleNUTs);

export function addNUT(nut: Omit<NUT, 'id' | 'timestamp'>) {
  const activeGuildId = activeGuildIdStore.get();
  const activeSession = activeSessionStore.get();
  
  const newNUT: NUT = {
    ...nut,
    id: Date.now().toString(),
    timestamp: new Date(),
    guildId: activeGuildId || undefined
  };
  
  nutsStore.set([...nutsStore.get(), newNUT]);
  
  if (activeSession) {
    addNutToSession(activeSession.id, newNUT.id);
  }
  
  return newNUT;
}

export function getNUTsByZone(zonePath: string): NUT[] {
  return nutsStore.get().filter(nut => 
    nut.zones?.some(z => z.startsWith(zonePath))
  );
}

export function getNUTsByTag(tag: string): NUT[] {
  return nutsStore.get().filter(nut => 
    nut.tags.includes(tag)
  );
}

export function getNUTsByGuild(guildId: string): NUT[] {
  return nutsStore.get().filter(nut => nut.guildId === guildId);
}

export function getNUTsByGuildTag(guildTag: string): NUT[] {
  return nutsStore.get().filter(nut => 
    nut.guildTags?.includes(guildTag)
  );
}