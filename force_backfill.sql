-- FORCE DATA VISIBILITY
-- Run this to verify if data appears when we force ownership

-- 1. Check if we have events
SELECT count(*) as total_events FROM verification_events;

-- 2. Force ALL events to have the owner_id of the CURRENT USER (if testing as one user)
-- WARNING: This assigns ALL verification events to the user who created the certs.
-- This relies on certificates having the correct user_id.

UPDATE verification_events
SET owner_id = certificates.user_id
FROM certificates
WHERE verification_events.certificate_id = certificates.id;

-- 3. Check nulls
SELECT count(*) as null_owners FROM verification_events WHERE owner_id IS NULL;

-- 4. Re-apply Permissive Policy just in case
DROP POLICY IF EXISTS "Debug: Allow all authenticated to view all events" ON public.verification_events;
CREATE POLICY "Debug: Allow all authenticated to view all events"
ON public.verification_events FOR SELECT
TO authenticated
USING (true);
