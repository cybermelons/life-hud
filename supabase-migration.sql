-- Create nuts table for anonymous sync
CREATE TABLE nuts (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('note', 'urge', 'task')),
    timestamp TIMESTAMPTZ NOT NULL,
    kingdom TEXT,
    zone TEXT,
    session_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient queries by session
CREATE INDEX idx_nuts_session_timestamp ON nuts (session_id, timestamp DESC);

-- Enable Row Level Security
ALTER TABLE nuts ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous access (session-based isolation)
CREATE POLICY "Users can only access their own session data" ON nuts
FOR ALL 
USING (session_id = current_setting('request.session_id', true));

-- For now, allow all operations for anonymous users
-- (In production, you'd want more restrictive policies)
CREATE POLICY "Allow anonymous access" ON nuts
FOR ALL 
TO anon
USING (true);