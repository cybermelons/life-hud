import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type { Campaign, CampaignSession } from '../lib/types';

const sampleCampaigns: Campaign[] = [
  {
    id: 'fitness-journey',
    guildId: 'warrior',
    name: 'Fitness Journey 2024',
    description: 'Building strength and endurance',
    startDate: new Date(Date.now() - 30 * 86400000),
    sessions: [
      {
        id: 'session-1',
        campaignId: 'fitness-journey',
        startTime: new Date(Date.now() - 7200000),
        endTime: new Date(Date.now() - 3600000),
        duration: 3600000,
        notes: 'Great upper body session',
        nutIds: ['1', '2']
      }
    ],
    totalTime: 3600000,
    tags: ['training', 'strength', 'cardio'],
    isActive: true
  },
  {
    id: 'philosophy-study',
    guildId: 'scholar',
    name: 'Philosophy Deep Dive',
    description: 'Exploring stoic and eastern philosophy',
    startDate: new Date(Date.now() - 60 * 86400000),
    sessions: [
      {
        id: 'session-2',
        campaignId: 'philosophy-study',
        startTime: new Date(Date.now() - 10800000),
        endTime: new Date(Date.now() - 7200000),
        duration: 3600000,
        notes: 'Read Marcus Aurelius Meditations',
        nutIds: ['4']
      }
    ],
    totalTime: 3600000,
    tags: ['study', 'philosophy', 'reading'],
    isActive: true
  },
  {
    id: 'art-project',
    guildId: 'artist',
    name: 'Digital Art Portfolio',
    description: 'Creating a series of digital paintings',
    startDate: new Date(Date.now() - 14 * 86400000),
    sessions: [],
    totalTime: 0,
    tags: ['creation', 'visual', 'digital'],
    isActive: true
  }
];

export const campaignsStore = persistentAtom<Campaign[]>('campaigns', sampleCampaigns, {
  encode: JSON.stringify,
  decode: (str) => {
    const campaigns = JSON.parse(str);
    return campaigns.map((c: any) => ({
      ...c,
      startDate: new Date(c.startDate),
      endDate: c.endDate ? new Date(c.endDate) : undefined,
      sessions: c.sessions.map((s: any) => ({
        ...s,
        startTime: new Date(s.startTime),
        endTime: s.endTime ? new Date(s.endTime) : undefined
      }))
    }));
  }
});

export const activeSessionStore = atom<CampaignSession | null>(null);

export function getCampaignsByGuild(guildId: string): Campaign[] {
  return campaignsStore.get().filter(c => c.guildId === guildId);
}

export function getActiveCampaigns(): Campaign[] {
  return campaignsStore.get().filter(c => c.isActive);
}

export function createCampaign(campaign: Omit<Campaign, 'id' | 'sessions' | 'totalTime'>): Campaign {
  const newCampaign: Campaign = {
    ...campaign,
    id: Date.now().toString(),
    sessions: [],
    totalTime: 0
  };
  campaignsStore.set([...campaignsStore.get(), newCampaign]);
  return newCampaign;
}

export function startSession(campaignId: string, notes?: string): CampaignSession {
  const session: CampaignSession = {
    id: Date.now().toString(),
    campaignId,
    startTime: new Date(),
    duration: 0,
    nutIds: [],
    notes
  };
  
  activeSessionStore.set(session);
  return session;
}

export function endSession(sessionId: string) {
  const activeSession = activeSessionStore.get();
  if (!activeSession || activeSession.id !== sessionId) return;
  
  const endTime = new Date();
  const duration = endTime.getTime() - activeSession.startTime.getTime();
  
  const completedSession: CampaignSession = {
    ...activeSession,
    endTime,
    duration
  };
  
  const campaigns = campaignsStore.get();
  const updatedCampaigns = campaigns.map(c => {
    if (c.id === activeSession.campaignId) {
      return {
        ...c,
        sessions: [...c.sessions, completedSession],
        totalTime: c.totalTime + duration
      };
    }
    return c;
  });
  
  campaignsStore.set(updatedCampaigns);
  activeSessionStore.set(null);
}

export function addNutToSession(sessionId: string, nutId: string) {
  const activeSession = activeSessionStore.get();
  if (activeSession && activeSession.id === sessionId) {
    activeSessionStore.set({
      ...activeSession,
      nutIds: [...activeSession.nutIds, nutId]
    });
  }
}

export function updateCampaign(id: string, updates: Partial<Campaign>) {
  const campaigns = campaignsStore.get();
  const updatedCampaigns = campaigns.map(c => 
    c.id === id ? { ...c, ...updates } : c
  );
  campaignsStore.set(updatedCampaigns);
}

export function endCampaign(id: string) {
  updateCampaign(id, { 
    isActive: false, 
    endDate: new Date() 
  });
}

export function deleteCampaign(id: string) {
  const campaigns = campaignsStore.get();
  campaignsStore.set(campaigns.filter(c => c.id !== id));
}

export function getCampaignStats(campaignId: string) {
  const campaign = campaignsStore.get().find(c => c.id === campaignId);
  if (!campaign) return null;
  
  const sessionCount = campaign.sessions.length;
  const averageSessionDuration = sessionCount > 0 
    ? campaign.totalTime / sessionCount 
    : 0;
  
  const daysActive = Math.floor(
    (new Date().getTime() - campaign.startDate.getTime()) / 86400000
  );
  
  return {
    sessionCount,
    totalTime: campaign.totalTime,
    averageSessionDuration,
    daysActive,
    isActive: campaign.isActive
  };
}

export function getGuildTimeStats(guildId: string) {
  const campaigns = getCampaignsByGuild(guildId);
  
  const totalTime = campaigns.reduce((sum, c) => sum + c.totalTime, 0);
  const activeCampaigns = campaigns.filter(c => c.isActive).length;
  const totalSessions = campaigns.reduce((sum, c) => sum + c.sessions.length, 0);
  
  const last7Days = new Date(Date.now() - 7 * 86400000);
  const recentTime = campaigns.reduce((sum, c) => {
    const recentSessions = c.sessions.filter(s => 
      s.startTime >= last7Days
    );
    return sum + recentSessions.reduce((t, s) => t + s.duration, 0);
  }, 0);
  
  return {
    totalTime,
    activeCampaigns,
    totalSessions,
    recentTime
  };
}