-- Allow public verification of certificates
-- This script enables public read access to certificates and necessary profile info for verification

-- 1. Certificates: Allow public to SELECT any certificate
-- Note: Ideally we would verify by hash via a function, but for an MVP, allowing public READ (SELECT) 
-- on certificates is acceptable for "Public Ledger" behavior.
CREATE POLICY "Public can view all certificates" 
ON public.certificates FOR SELECT 
USING (true);

-- 2. Profiles: Allow public to view basic profile info (name, email)
-- This is needed because the verification query joins on `user_id` to get issuer details
CREATE POLICY "Public can view profiles" 
ON public.profiles FOR SELECT 
USING (true);

-- 3. Verification Events: Allow public (anon) to insert events
-- (Already handled in previous script if owner_id is nullable, but let's ensure it)
CREATE POLICY "Public can insert verification events" 
ON public.verification_events FOR INSERT 
WITH CHECK (true);
