-- Add latency_ms column to verification_events table
ALTER TABLE verification_events 
ADD COLUMN IF NOT EXISTS latency_ms INTEGER DEFAULT 0;

-- Comment: This tracks the time in milliseconds it took for the verification to complete (DB query + Network)
