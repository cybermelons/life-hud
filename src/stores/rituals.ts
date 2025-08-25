import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type { Ritual } from '../lib/types';

const sampleRituals: Ritual[] = [
  {
    id: 'morning-workout',
    guildId: 'warrior',
    name: 'Morning Workout',
    description: 'Complete morning exercise routine',
    frequency: 'daily',
    targetCount: 1,
    currentStreak: 5,
    bestStreak: 12,
    lastCompleted: new Date(Date.now() - 86400000),
    tags: ['training', 'cardio', 'strength'],
    isActive: true
  },
  {
    id: 'meditation',
    guildId: 'warrior',
    name: 'Evening Meditation',
    description: '10 minutes of mindfulness',
    frequency: 'daily',
    targetCount: 1,
    currentStreak: 3,
    bestStreak: 30,
    lastCompleted: new Date(Date.now() - 86400000),
    tags: ['mindfulness', 'discipline'],
    isActive: true
  },
  {
    id: 'reading-hour',
    guildId: 'scholar',
    name: 'Daily Reading',
    description: 'Read for at least 1 hour',
    frequency: 'daily',
    targetCount: 1,
    currentStreak: 10,
    bestStreak: 45,
    lastCompleted: new Date(Date.now() - 43200000),
    tags: ['study', 'reading'],
    isActive: true
  },
  {
    id: 'weekly-review',
    guildId: 'scholar',
    name: 'Weekly Review',
    description: 'Review and synthesize weekly learnings',
    frequency: 'weekly',
    targetCount: 1,
    currentStreak: 4,
    bestStreak: 12,
    lastCompleted: new Date(Date.now() - 604800000),
    tags: ['study', 'research', 'writing'],
    isActive: true
  },
  {
    id: 'creative-practice',
    guildId: 'artist',
    name: 'Creative Practice',
    description: 'Engage in creative work for 30 minutes',
    frequency: 'daily',
    targetCount: 1,
    currentStreak: 7,
    bestStreak: 21,
    lastCompleted: new Date(Date.now() - 86400000),
    tags: ['creation', 'visual', 'music', 'writing'],
    isActive: true
  }
];

export const ritualsStore = persistentAtom<Ritual[]>('rituals', sampleRituals, {
  encode: JSON.stringify,
  decode: (str) => {
    const rituals = JSON.parse(str);
    return rituals.map((r: any) => ({
      ...r,
      lastCompleted: r.lastCompleted ? new Date(r.lastCompleted) : undefined
    }));
  }
});

export function getRitualsByGuild(guildId: string): Ritual[] {
  return ritualsStore.get().filter(r => r.guildId === guildId);
}

export function getActiveRituals(): Ritual[] {
  return ritualsStore.get().filter(r => r.isActive);
}

export function getDueRituals(): Ritual[] {
  const now = new Date();
  return ritualsStore.get().filter(r => {
    if (!r.isActive) return false;
    if (!r.lastCompleted) return true;
    
    const timeSinceCompletion = now.getTime() - r.lastCompleted.getTime();
    const dayInMs = 86400000;
    const weekInMs = 604800000;
    const monthInMs = 2592000000;
    
    switch (r.frequency) {
      case 'daily':
        return timeSinceCompletion >= dayInMs;
      case 'weekly':
        return timeSinceCompletion >= weekInMs;
      case 'monthly':
        return timeSinceCompletion >= monthInMs;
      default:
        return false;
    }
  });
}

export function createRitual(ritual: Omit<Ritual, 'id' | 'currentStreak' | 'bestStreak'>): Ritual {
  const newRitual: Ritual = {
    ...ritual,
    id: Date.now().toString(),
    currentStreak: 0,
    bestStreak: 0
  };
  ritualsStore.set([...ritualsStore.get(), newRitual]);
  return newRitual;
}

export function completeRitual(id: string) {
  const rituals = ritualsStore.get();
  const now = new Date();
  
  const updatedRituals = rituals.map(r => {
    if (r.id !== id) return r;
    
    let newStreak = r.currentStreak;
    
    if (r.lastCompleted) {
      const timeSinceLastCompletion = now.getTime() - r.lastCompleted.getTime();
      const dayInMs = 86400000;
      const weekInMs = 604800000;
      
      const isConsecutive = 
        (r.frequency === 'daily' && timeSinceLastCompletion < dayInMs * 2) ||
        (r.frequency === 'weekly' && timeSinceLastCompletion < weekInMs * 2) ||
        (r.frequency === 'monthly' && timeSinceLastCompletion < dayInMs * 60);
      
      newStreak = isConsecutive ? r.currentStreak + 1 : 1;
    } else {
      newStreak = 1;
    }
    
    const newBestStreak = Math.max(r.bestStreak, newStreak);
    
    return {
      ...r,
      lastCompleted: now,
      currentStreak: newStreak,
      bestStreak: newBestStreak
    };
  });
  
  ritualsStore.set(updatedRituals);
}

export function updateRitual(id: string, updates: Partial<Ritual>) {
  const rituals = ritualsStore.get();
  const updatedRituals = rituals.map(r => 
    r.id === id ? { ...r, ...updates } : r
  );
  ritualsStore.set(updatedRituals);
}

export function deleteRitual(id: string) {
  const rituals = ritualsStore.get();
  ritualsStore.set(rituals.filter(r => r.id !== id));
}

export function resetRitualStreak(id: string) {
  updateRitual(id, { currentStreak: 0 });
}

export function toggleRitualActive(id: string) {
  const ritual = ritualsStore.get().find(r => r.id === id);
  if (ritual) {
    updateRitual(id, { isActive: !ritual.isActive });
  }
}