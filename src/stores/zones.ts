import { atom } from 'nanostores';
import type { Zone } from '../lib/types';

const zonesData: Zone[] = [
  // Body zones
  { id: 'body', path: '/body', name: 'Body', unlocked: true, nutCount: 3, health: 85, description: 'Physical awareness and embodiment' },
  { id: 'body-senses', path: '/body/senses', name: 'Senses', unlocked: true, parent: 'body', nutCount: 1, health: 70 },
  { id: 'body-actions', path: '/body/actions', name: 'Actions', unlocked: true, parent: 'body', nutCount: 2, health: 90 },
  { id: 'body-muscles', path: '/body/actions/muscles', name: 'Muscles', unlocked: true, parent: 'body-actions', nutCount: 2, health: 95 },
  
  // Mind zones
  { id: 'mind', path: '/mind', name: 'Mind', unlocked: true, nutCount: 2, health: 75, description: 'Mental landscape and cognition' },
  { id: 'mind-thoughts', path: '/mind/thoughts', name: 'Thoughts', unlocked: true, parent: 'mind', nutCount: 1, health: 80 },
  { id: 'mind-feelings', path: '/mind/feelings', name: 'Feelings', unlocked: true, parent: 'mind', nutCount: 1, health: 65 },
  
  // Spirit zones
  { id: 'spirit', path: '/spirit', name: 'Spirit', unlocked: false, nutCount: 1, health: 60, description: 'Purpose and transcendence' },
  { id: 'spirit-practices', path: '/spirit/practices', name: 'Practices', unlocked: false, parent: 'spirit', nutCount: 1, health: 70 },
  { id: 'spirit-purpose', path: '/spirit/purpose', name: 'Purpose', unlocked: false, parent: 'spirit', nutCount: 0, health: 50 },
  { id: 'spirit-connection', path: '/spirit/connection', name: 'Connection', unlocked: false, parent: 'spirit', nutCount: 0, health: 55 }
];

export const zonesStore = atom<Zone[]>(zonesData);

export function getZoneByPath(path: string): Zone | undefined {
  return zonesStore.get().find(z => z.path === path);
}

export function getChildZones(parentPath: string): Zone[] {
  return zonesStore.get().filter(z => 
    z.path.startsWith(parentPath) && z.path !== parentPath && !z.path.slice(parentPath.length + 1).includes('/')
  );
}

export function unlockZone(zoneId: string) {
  const zones = zonesStore.get();
  const updatedZones = zones.map(z => 
    z.id === zoneId ? { ...z, unlocked: true } : z
  );
  zonesStore.set(updatedZones);
}