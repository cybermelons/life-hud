export interface NUT {
  id: string;
  timestamp: Date;
  type: 'note' | 'urge' | 'task';
  content: string;
  tags: string[];
  zones?: string[];
  reactions?: string[];
  guildTags?: string[];
  guildId?: string;
}

export interface Zone {
  id: string;
  path: string;
  name: string;
  unlocked: boolean;
  parent?: string;
  children?: string[];
  nutCount: number;
  health: number;
  description?: string;
}

export interface UserProfile {
  id: string;
  unlockedZones: Set<string>;
  currentGoal?: string;
  sadhana?: string[];
  stats: {
    totalNuts: number;
    streakDays: number;
    lastActive: Date;
  };
  activeGuildId?: string;
  guildMemberships: string[];
}

export interface Guild {
  id: string;
  name: string;
  description?: string;
  statTree: StatTree;
  rituals: string[];
  campaigns: string[];
  customTags: TagHierarchy;
  color: string;
  icon: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface StatTree {
  [key: string]: {
    name: string;
    value: number;
    maxValue: number;
    children?: StatTree;
    description?: string;
  };
}

export interface TagHierarchy {
  [key: string]: {
    name: string;
    color?: string;
    children?: TagHierarchy;
  };
}

export interface Ritual {
  id: string;
  guildId: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  customSchedule?: string;
  targetCount: number;
  currentStreak: number;
  bestStreak: number;
  lastCompleted?: Date;
  tags: string[];
  isActive: boolean;
}

export interface Campaign {
  id: string;
  guildId: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  sessions: CampaignSession[];
  totalTime: number;
  tags: string[];
  isActive: boolean;
}

export interface CampaignSession {
  id: string;
  campaignId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  notes?: string;
  nutIds: string[];
}