-- Create nuts table for authenticated users
CREATE TABLE IF NOT EXISTS nuts (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('note', 'urge', 'task')),
    timestamp TIMESTAMPTZ NOT NULL,
    kingdom TEXT,
    zone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_nuts_user_timestamp ON nuts (user_id, timestamp DESC);

-- Enable Row Level Security
ALTER TABLE nuts ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can only access their own data" ON nuts;
DROP POLICY IF EXISTS "Users can insert their own data" ON nuts;
DROP POLICY IF EXISTS "Users can update their own data" ON nuts;
DROP POLICY IF EXISTS "Users can delete their own data" ON nuts;

-- Create policy for authenticated users only
CREATE POLICY "Users can only access their own data" ON nuts
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data" ON nuts
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" ON nuts
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own data" ON nuts
FOR DELETE 
USING (auth.uid() = user_id);