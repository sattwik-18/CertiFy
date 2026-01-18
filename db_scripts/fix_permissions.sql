-- FIX PERMISSIONS SCRIPT
-- Run this in your Supabase SQL Editor

-- 1. Enable RLS on certificates (ensure it is on)
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- 2. Fix 'certificates' Table Policies
-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can insert their own certificates" ON certificates;
DROP POLICY IF EXISTS "Users can read their own certificates" ON certificates;
DROP POLICY IF EXISTS "Users can update their own certificates" ON certificates;
DROP POLICY IF EXISTS "Users can delete their own certificates" ON certificates;

-- Create correct INSERT policy
CREATE POLICY "Users can insert their own certificates"
ON certificates FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create correct SELECT policy
CREATE POLICY "Users can read their own certificates"
ON certificates FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create correct DELETE policy
CREATE POLICY "Users can delete their own certificates"
ON certificates FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 3. Fix Storage Permissions for 'certificates' bucket
-- Note: 'storage' schema policies require careful handling. 
-- We allow authenticated users to upload to the 'certificates' bucket/folder.

DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'certificates' AND auth.uid() = owner );

DROP POLICY IF EXISTS "Allow authenticated selects" ON storage.objects;
CREATE POLICY "Allow authenticated selects"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'certificates' AND auth.uid() = owner );

-- If your bucket is public, the SELECT policy above isn't strictly needed for publicUrl access,
-- but good for ensuring ownership checks if you ever turn off Public.

-- 4. Fix Profiles (just in case)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
CREATE POLICY "Users can read their own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);
