-- NUCLEAR OPTION: DISABLE RLS
-- If this script works and data appears, we KNOW 100% that our RLS policies were the problem.

ALTER TABLE public.verification_events DISABLE ROW LEVEL SECURITY;

-- Also set verified_at to NOW() for any nulls, to fix sorting
UPDATE public.verification_events 
SET verified_at = now() 
WHERE verified_at IS NULL;
