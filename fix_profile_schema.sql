-- FIX PROFILES SCHEMA
-- The 'profiles' table is missing the 'name' column, causing the app to fail profile creation/loading.
-- This prevents the Dashboard from loading verification data (since it needs a user ID).

-- 1. Add 'name' column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'name') THEN
        ALTER TABLE public.profiles ADD COLUMN name text;
    END IF;
END $$;

-- 2. Add 'email' column if it doesn't exist (just to be safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE public.profiles ADD COLUMN email text;
    END IF;
END $$;

-- 3. Relax RLS on profiles to ensure 'ensureProfile' can run
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 4. Reload the schema cache
NOTIFY pgrst, 'reload config';
