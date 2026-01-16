-- FINAL RLS FIX
-- This strategy works even if 'owner_id' is missing or null on the event.
-- It works by checking: Does this event belong to a Certificate that belongs to ME?

-- 1. Enable RLS (Ensure it's on)
ALTER TABLE public.verification_events ENABLE ROW LEVEL SECURITY;

-- 2. Drop all previous restrictive policies
DROP POLICY IF EXISTS "Users can view own verification events" ON public.verification_events;
DROP POLICY IF EXISTS "Issuers can view verification events for their certs" ON public.verification_events;
DROP POLICY IF EXISTS "Debug: Allow all authenticated to view all events" ON public.verification_events;

-- 3. Create the "Join-Based" Policy (The most robust method)
CREATE POLICY "View events for my certificates"
ON public.verification_events FOR SELECT
TO authenticated
USING (
  -- Check if the event's certificate belongs to the current user
  EXISTS (
    SELECT 1 FROM public.certificates
    WHERE certificates.id = verification_events.certificate_id
    AND certificates.user_id = auth.uid()
  )
  OR
  -- Fallback: Check if owner_id is set directly (for performance in future)
  owner_id = auth.uid()
);

-- 4. Grant Permissions (Ensure no permission denied errors)
GRANT ALL ON public.verification_events TO authenticated;
GRANT ALL ON public.verification_events TO anon;
