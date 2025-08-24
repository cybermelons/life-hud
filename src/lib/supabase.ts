import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  throw new Error('SUPABASE_ANON_KEY is required');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for NUT operations
export const nutService = {
  // Create a new NUT
  async createNUT(nut: {
    type: 'note' | 'urge' | 'task';
    content: string;
    kingdom?: 'body' | 'mind' | 'spirit';
    zone?: 'senses' | 'actions' | 'feelings' | 'thoughts';
    tags?: string[];
  }) {
    const { data, error } = await supabase
      .from('nuts')
      .insert([nut])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get unassigned NUTs (inventory)
  async getUnassignedNUTs() {
    const { data, error } = await supabase
      .from('nuts')
      .select('*')
      .is('kingdom', null)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get NUTs by kingdom and zone
  async getNUTsByLocation(kingdom: string, zone?: string) {
    let query = supabase
      .from('nuts')
      .select('*')
      .eq('kingdom', kingdom);
    
    if (zone) {
      query = query.eq('zone', zone);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Mark NUT as klesha
  async markAsKlesha(nutId: string, kleshaType: string, rootDesire?: string) {
    const { data, error } = await supabase
      .from('nuts')
      .update({
        is_klesha: true,
        klesha_type: kleshaType as any,
        klesha_root_desire: rootDesire
      })
      .eq('id', nutId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Assign NUT to kingdom/zone
  async assignNUT(nutId: string, kingdom: string, zone: string) {
    const { data, error } = await supabase
      .from('nuts')
      .update({ kingdom: kingdom as any, zone: zone as any })
      .eq('id', nutId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Helper functions for Klesha Solutions
export const kleshaService = {
  // Create a new solution
  async createSolution(solution: {
    klesha_type: string;
    trigger_pattern: string;
    skillful_action: string;
    solution_type: string;
  }) {
    const { data, error } = await supabase
      .from('klesha_solutions')
      .insert([solution])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all active solutions
  async getActiveSolutions() {
    const { data, error } = await supabase
      .from('klesha_solutions')
      .select('*')
      .eq('is_active', true)
      .order('success_rate', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Record solution usage
  async recordUsage(solutionId: string, wasSuccessful: boolean) {
    // First get current values
    const { data: solution, error: fetchError } = await supabase
      .from('klesha_solutions')
      .select('times_used, times_successful')
      .eq('id', solutionId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Update with incremented values
    const { data, error } = await supabase
      .from('klesha_solutions')
      .update({
        times_used: (solution.times_used || 0) + 1,
        times_successful: (solution.times_successful || 0) + (wasSuccessful ? 1 : 0)
      })
      .eq('id', solutionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Helper functions for Kingdom Health
export const kingdomService = {
  // Get kingdom health
  async getKingdomHealth(kingdom?: string) {
    let query = supabase.from('kingdom_health').select('*');
    
    if (kingdom) {
      query = query.eq('kingdom', kingdom);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  // Update kingdom health
  async updateHealth(kingdom: string, updates: {
    health_percentage?: number;
    has_corruption?: boolean;
    corruption_zones?: string[];
    klesha_count?: number;
  }) {
    const { data, error } = await supabase
      .from('kingdom_health')
      .update(updates)
      .eq('kingdom', kingdom)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Helper functions for Game Sessions
export const sessionService = {
  // Get or create active session
  async getActiveSession() {
    // First try to get existing active session
    const { data: existing, error: fetchError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (existing && !fetchError) {
      return existing;
    }
    
    // Create new session if none exists
    const { data, error } = await supabase
      .from('game_sessions')
      .insert([{ is_active: true }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update session progress
  async updateProgress(sessionId: string, updates: any) {
    const { data, error } = await supabase
      .from('game_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};