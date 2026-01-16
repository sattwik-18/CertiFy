-- FIX DASHBOARD DATA & REALTIME
-- Run this script to ensure the dashboard can read verification events

-- 1. Ensure owner_id column exists (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'verification_events' AND column_name = 'owner_id') THEN
        ALTER TABLE public.verification_events ADD COLUMN owner_id uuid references auth.users(id);
    END IF;
END $$;

-- 2. Backfill owner_id for any events that have it missing
-- (Matches certificate_id to certificate.user_id)
UPDATE public.verification_events ve
SET owner_id = c.user_id
FROM public.certificates c
WHERE ve.certificate_id = c.id
AND ve.owner_id IS NULL;

-- 3. Fix RLS Policy for SELCT (Reading events)
-- Drop to be safe
DROP POLICY IF EXISTS "Issuers can view verification events for their certs" ON public.verification_events;
DROP POLICY IF EXISTS "Users can view own verification events" ON public.verification_events;

-- Recreate robust policy:
-- Authenticated users can see events where they are the owner OR (optional) they are the verifier
CREATE POLICY "Users can view own verification events"
ON public.verification_events FOR SELECT
TO authenticated
USING (
  auth.uid() = owner_id
);

-- 4. Enable Realtime explicitly again (Commented out as it's already done)
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.verification_events;

-- 5. Grant permissions just in case
GRANT SELECT, INSERT, UPDATE, DELETE ON public.verification_events TO authenticated;
GRANT SELECT, INSERT ON public.verification_events TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
