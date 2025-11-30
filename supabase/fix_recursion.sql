-- Drop problematic policies
DROP POLICY IF EXISTS "Users can view members of calendars they belong to" ON calendar_members;
DROP POLICY IF EXISTS "Users can view calendars they are members of" ON calendars;

-- Create a secure function to check membership without recursion
CREATE OR REPLACE FUNCTION public.is_member_of(_calendar_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM calendar_members
    WHERE calendar_id = _calendar_id
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create policies using the function

-- 1. Calendar Members Policy
CREATE POLICY "Users can view members of calendars they belong to"
  ON calendar_members FOR SELECT
  USING (
    -- User can see their own membership
    auth.uid() = user_id
    OR
    -- OR user can see other members if they are a member of that calendar
    is_member_of(calendar_id)
  );

-- 2. Calendars Policy
CREATE POLICY "Users can view calendars they are members of"
  ON calendars FOR SELECT
  USING (
    is_member_of(id)
  );
