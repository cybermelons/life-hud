-- Create enum types for NUT system
CREATE TYPE nut_type AS ENUM ('note', 'urge', 'task');
CREATE TYPE klesha_type AS ENUM ('kama', 'krodha', 'lobha', 'moha', 'mada');
CREATE TYPE kingdom_type AS ENUM ('body', 'mind', 'spirit');
CREATE TYPE zone_type AS ENUM ('senses', 'actions', 'feelings', 'thoughts');

-- Main NUTs table
CREATE TABLE nuts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Core NUT data
    type nut_type NOT NULL,
    content TEXT NOT NULL,
    
    -- Kingdom/Zone assignment
    kingdom kingdom_type,
    zone zone_type,
    
    -- Klesha tracking
    is_klesha BOOLEAN DEFAULT FALSE,
    klesha_type klesha_type,
    klesha_root_desire TEXT,
    
    -- Solution/transformation
    solution_id UUID,
    transformed_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}'
);

-- NUT chains (linking related NUTs)
CREATE TABLE nut_chains (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Chain type
    chain_type TEXT NOT NULL, -- 'transformation', 'reaction', 'pattern'
    
    -- Source and target
    source_nut_id UUID REFERENCES nuts(id) ON DELETE CASCADE,
    target_nut_id UUID REFERENCES nuts(id) ON DELETE CASCADE,
    
    -- Chain metadata
    strength INTEGER DEFAULT 1, -- How strong the connection is
    notes TEXT
);

-- Klesha solutions library
CREATE TABLE klesha_solutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Problem
    klesha_type klesha_type NOT NULL,
    trigger_pattern TEXT NOT NULL, -- "When I feel..."
    
    -- Solution
    skillful_action TEXT NOT NULL, -- "I will..."
    solution_type TEXT NOT NULL, -- 'bhakti', 'tapas', 'dana', 'mudita', etc.
    
    -- Effectiveness tracking
    times_used INTEGER DEFAULT 0,
    times_successful INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN times_used = 0 THEN 0
            ELSE (times_successful::DECIMAL / times_used * 100)
        END
    ) STORED,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    needs_practice BOOLEAN DEFAULT FALSE
);

-- Kingdom health tracking
CREATE TABLE kingdom_health (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    kingdom kingdom_type NOT NULL,
    health_percentage INTEGER DEFAULT 100 CHECK (health_percentage >= 0 AND health_percentage <= 100),
    
    -- Corruption tracking
    has_corruption BOOLEAN DEFAULT FALSE,
    corruption_zones zone_type[] DEFAULT '{}',
    klesha_count INTEGER DEFAULT 0,
    
    -- Stats
    total_nuts INTEGER DEFAULT 0,
    resolved_nuts INTEGER DEFAULT 0,
    pending_nuts INTEGER DEFAULT 0
);

-- Session tracking (for game state)
CREATE TABLE game_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Current state
    current_kingdom kingdom_type,
    current_zone zone_type,
    
    -- Progress
    total_nuts_captured INTEGER DEFAULT 0,
    kleshas_transformed INTEGER DEFAULT 0,
    solutions_created INTEGER DEFAULT 0,
    
    -- Unlocks
    spirit_kingdom_unlocked BOOLEAN DEFAULT FALSE,
    thoughts_hall_unlocked BOOLEAN DEFAULT FALSE,
    
    -- Active session
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for performance
CREATE INDEX idx_nuts_kingdom_zone ON nuts(kingdom, zone);
CREATE INDEX idx_nuts_klesha ON nuts(is_klesha, klesha_type);
CREATE INDEX idx_nuts_created_at ON nuts(created_at DESC);
CREATE INDEX idx_nut_chains_source ON nut_chains(source_nut_id);
CREATE INDEX idx_nut_chains_target ON nut_chains(target_nut_id);
CREATE INDEX idx_klesha_solutions_type ON klesha_solutions(klesha_type, is_active);

-- Row Level Security (RLS)
ALTER TABLE nuts ENABLE ROW LEVEL SECURITY;
ALTER TABLE nut_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE klesha_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kingdom_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Policies (for now, allow all for local dev)
CREATE POLICY "Allow all for nuts" ON nuts FOR ALL USING (true);
CREATE POLICY "Allow all for nut_chains" ON nut_chains FOR ALL USING (true);
CREATE POLICY "Allow all for klesha_solutions" ON klesha_solutions FOR ALL USING (true);
CREATE POLICY "Allow all for kingdom_health" ON kingdom_health FOR ALL USING (true);
CREATE POLICY "Allow all for game_sessions" ON game_sessions FOR ALL USING (true);

-- Initial data
INSERT INTO kingdom_health (kingdom, health_percentage) VALUES
    ('body', 80),
    ('mind', 60),
    ('spirit', 0);

-- Add update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_nuts_updated_at BEFORE UPDATE ON nuts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_klesha_solutions_updated_at BEFORE UPDATE ON klesha_solutions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_sessions_updated_at BEFORE UPDATE ON game_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();