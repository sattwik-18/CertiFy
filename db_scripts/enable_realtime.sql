-- ENABLE REALTIME SCRIPT
-- Run this in your Supabase SQL Editor

-- 1. Add 'certificates' table to the realtime publication
-- This step is REQUIRED for the dashboard to update instantly without refresh.
drop publication if exists supabase_realtime;
create publication supabase_realtime for all tables;
-- ALTER PUBLICATION supabase_realtime ADD TABLE certificates;

-- Note: 'supabase_realtime' usually exists. If the above fails, try:
-- ALTER PUBLICATION supabase_realtime ADD TABLE certificates;
-- But "create publication ... for all tables" is a safe catch-all for development.

-- 2. Verify Replica Identity (Required for UPDATE/DELETE events)
ALTER TABLE certificates REPLICA IDENTITY FULL;

-- 3. (Optional) Re-verify permissions just in case
GRANT SELECT ON certificates TO authenticated;
GRANT SELECT ON certificates TO service_role;
