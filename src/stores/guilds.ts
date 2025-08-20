import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type { Guild, StatTree, TagHierarchy } from '../lib/types';

const defaultStatTree: StatTree = {
  strength: {
    name: 'Strength',
    value: 0,
    maxValue: 100,
    description: 'Physical and mental fortitude'
  },
  wisdom: {
    name: 'Wisdom',
    value: 0,
    maxValue: 100,
    description: 'Knowledge and understanding'
  },
  creativity: {
    name: 'Creativity',
    value: 0,
    maxValue: 100,
    description: 'Imagination and expression'
  },
  discipline: {
    name: 'Discipline',
    value: 0,
    maxValue: 100,
    description: 'Consistency and self-control'
  },
  connection: {
    name: 'Connection',
    value: 0,
    maxValue: 100,
    description: 'Relationships and empathy'
  }
};

const sampleGuilds: Guild[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Physical mastery and discipline',
    statTree: {
      ...defaultStatTree,
      strength: { ...defaultStatTree.strength, value: 75 },
      discipline: { ...defaultStatTree.discipline, value: 60 }
    },
    rituals: [],
    campaigns: [],
    customTags: {
      training: {
        name: 'Training',
        color: 'red',
        children: {
          cardio: { name: 'Cardio' },
          strength: { name: 'Strength' },
          flexibility: { name: 'Flexibility' }
        }
      },
      combat: {
        name: 'Combat',
        color: 'orange',
        children: {
          martial_arts: { name: 'Martial Arts' },
          sparring: { name: 'Sparring' }
        }
      }
    },
    color: 'red',
    icon: '⚔️',
    createdAt: new Date(),
    modifiedAt: new Date()
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Knowledge seeking and analysis',
    statTree: {
      ...defaultStatTree,
      wisdom: { ...defaultStatTree.wisdom, value: 80 },
      creativity: { ...defaultStatTree.creativity, value: 45 }
    },
    rituals: [],
    campaigns: [],
    customTags: {
      study: {
        name: 'Study',
        color: 'blue',
        children: {
          reading: { name: 'Reading' },
          research: { name: 'Research' },
          writing: { name: 'Writing' }
        }
      },
      subjects: {
        name: 'Subjects',
        color: 'indigo',
        children: {
          philosophy: { name: 'Philosophy' },
          science: { name: 'Science' },
          history: { name: 'History' }
        }
      }
    },
    color: 'blue',
    icon: '📚',
    createdAt: new Date(),
    modifiedAt: new Date()
  },
  {
    id: 'artist',
    name: 'Artist',
    description: 'Creative expression and flow',
    statTree: {
      ...defaultStatTree,
      creativity: { ...defaultStatTree.creativity, value: 90 },
      connection: { ...defaultStatTree.connection, value: 55 }
    },
    rituals: [],
    campaigns: [],
    customTags: {
      creation: {
        name: 'Creation',
        color: 'purple',
        children: {
          visual: { name: 'Visual Art' },
          music: { name: 'Music' },
          writing: { name: 'Creative Writing' }
        }
      },
      inspiration: {
        name: 'Inspiration',
        color: 'pink',
        children: {
          nature: { name: 'Nature' },
          dreams: { name: 'Dreams' },
          emotions: { name: 'Emotions' }
        }
      }
    },
    color: 'purple',
    icon: '🎨',
    createdAt: new Date(),
    modifiedAt: new Date()
  }
];

export const guildsStore = persistentAtom<Guild[]>('guilds', sampleGuilds, {
  encode: JSON.stringify,
  decode: (str) => {
    const guilds = JSON.parse(str);
    return guilds.map((g: any) => ({
      ...g,
      createdAt: new Date(g.createdAt),
      modifiedAt: new Date(g.modifiedAt)
    }));
  }
});

export const activeGuildIdStore = persistentAtom<string | null>('activeGuildId', 'warrior');

export const activeGuildStore = atom<Guild | null>([guildsStore, activeGuildIdStore], (guilds, activeId) => {
  if (!activeId) return null;
  return guilds.find(g => g.id === activeId) || null;
});

export function createGuild(guild: Omit<Guild, 'id' | 'createdAt' | 'modifiedAt'>): Guild {
  const newGuild: Guild = {
    ...guild,
    id: Date.now().toString(),
    createdAt: new Date(),
    modifiedAt: new Date()
  };
  guildsStore.set([...guildsStore.get(), newGuild]);
  return newGuild;
}

export function updateGuild(id: string, updates: Partial<Guild>) {
  const guilds = guildsStore.get();
  const updatedGuilds = guilds.map(g => 
    g.id === id 
      ? { ...g, ...updates, modifiedAt: new Date() }
      : g
  );
  guildsStore.set(updatedGuilds);
}

export function deleteGuild(id: string) {
  const guilds = guildsStore.get();
  guildsStore.set(guilds.filter(g => g.id !== id));
  
  if (activeGuildIdStore.get() === id) {
    const remaining = guilds.filter(g => g.id !== id);
    activeGuildIdStore.set(remaining.length > 0 ? remaining[0].id : null);
  }
}

export function setActiveGuild(id: string) {
  activeGuildIdStore.set(id);
}

export function getGuildTags(guildId: string): string[] {
  const guild = guildsStore.get().find(g => g.id === guildId);
  if (!guild) return [];
  
  const tags: string[] = [];
  const extractTags = (hierarchy: TagHierarchy, prefix = '') => {
    Object.entries(hierarchy).forEach(([key, value]) => {
      const tag = prefix ? `${prefix}/${key}` : key;
      tags.push(tag);
      if (value.children) {
        extractTags(value.children, tag);
      }
    });
  };
  
  extractTags(guild.customTags);
  return tags;
}

export function updateGuildStats(guildId: string, statUpdates: Partial<Record<string, number>>) {
  const guild = guildsStore.get().find(g => g.id === guildId);
  if (!guild) return;
  
  const updatedStatTree = { ...guild.statTree };
  Object.entries(statUpdates).forEach(([stat, value]) => {
    if (updatedStatTree[stat] && typeof value === 'number') {
      updatedStatTree[stat] = {
        ...updatedStatTree[stat],
        value: Math.min(Math.max(0, value), updatedStatTree[stat].maxValue)
      };
    }
  });
  
  updateGuild(guildId, { statTree: updatedStatTree });
}