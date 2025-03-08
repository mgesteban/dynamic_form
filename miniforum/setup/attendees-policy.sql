-- RLS Policy for attendees table
-- Run this in Supabase SQL Editor

-- First, make sure RLS is enabled on the attendees table
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public to insert attendees (for signups)
CREATE POLICY "allow_insert_attendees"
ON public.attendees
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to allow public to read attendees (for counting, etc.)
CREATE POLICY "allow_select_attendees"
ON public.attendees
AS PERMISSIVE
FOR SELECT
TO public
USING (true);
