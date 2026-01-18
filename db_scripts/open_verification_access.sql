-- DEBUG: OPEN ACCESS TO VERIFICATION EVENTS
-- This script temporarily allows any logged-in user to see ALL verification events.
-- Use this to check if the data exists but is being hidden by RLS.

DROP POLICY IF EXISTS "Users can view own verification events" ON public.verification_events;
DROP POLICY IF EXISTS "Issuers can view verification events for their certs" ON public.verification_events;

-- Permissive Policy
CREATE POLICY "Debug: Allow all authenticated to view all events"
ON public.verification_events FOR SELECT
TO authenticated
USING (true);

-- Ensure owner_id is actually populated (Audit)
-- If this update affects 0 rows, then your previous rows have no owner_id!
UPDATE public.verification_events
SET owner_id = (SELECT user_id FROM public.certificates WHERE id = verification_events.certificate_id)
WHERE owner_id IS NULL;
