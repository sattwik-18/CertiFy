-- Add owner_id to verification_events for efficient Realtime filtering
ALTER TABLE public.verification_events 
ADD COLUMN owner_id uuid references auth.users(id);

-- Update RLS to use owner_id (more efficient than join)
DROP POLICY IF EXISTS "Issuers can view verification events for their certs" ON public.verification_events;

CREATE POLICY "Issuers can view verification events for their certs"
  ON public.verification_events FOR SELECT
  USING (
    auth.uid() = owner_id
  );

-- Index for performance
CREATE INDEX IF NOT EXISTS verification_events_owner_id_idx ON public.verification_events(owner_id);

-- Enable Realtime for this table (if not already)
ALTER PUBLICATION supabase_realtime ADD TABLE verification_events;
