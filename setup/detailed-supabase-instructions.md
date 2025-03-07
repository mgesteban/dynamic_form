# Detailed Supabase Setup Instructions

It looks like you're having trouble accessing the SQL Editor in your Supabase project. Let me provide detailed instructions on how to create the necessary tables for MiniForum.

## 1. Accessing the Supabase Dashboard

First, make sure you're properly logged in to Supabase:

1. Go to https://app.supabase.com/sign-in
2. Log in with your credentials
3. You should see your projects dashboard

## 2. Finding Your Project

Find and select your project "ozqlhaprezyrluocvnms" in the projects list. If you don't see it:
- Make sure you're logged in with the correct account
- Check if you've been invited to the project (check your email)
- You might need to request access from the project owner

## 3. Using the SQL Editor

Once in your project:

1. Navigate to the "SQL Editor" in the left sidebar menu
2. Click "New Query" to create a new SQL query
3. Paste the following SQL code:

```sql
-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  day TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  max_attendees INTEGER NOT NULL DEFAULT 10
);

-- Create attendees table with foreign key to sessions
CREATE TABLE IF NOT EXISTS attendees (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, email)
);

-- Insert sample session data
INSERT INTO sessions (id, day, date, time, max_attendees)
VALUES 
  (1, 'Monday', 'March 10', '4:00 PM - 5:00 PM', 10),
  (2, 'Tuesday', 'March 11', '4:00 PM - 5:00 PM', 10),
  (3, 'Thursday', 'March 13', '2:00 PM - 3:00 PM', 10),
  (5, 'Thursday', 'March 13', '4:00 PM - 5:00 PM', 10)
ON CONFLICT (id) DO NOTHING;

-- Create view to get sessions with attendee counts
CREATE OR REPLACE VIEW sessions_with_counts AS
SELECT 
  s.id,
  s.day,
  s.date,
  s.time,
  s.max_attendees,
  COUNT(a.id) AS attendee_count
FROM 
  sessions s
LEFT JOIN 
  attendees a ON s.id = a.session_id
GROUP BY 
  s.id, s.day, s.date, s.time, s.max_attendees;
```

4. Click "Run" to execute the SQL

## 4. Alternative: Creating Tables Individually in Table Editor

If you prefer using the Table Editor interface instead of SQL:

1. In the left sidebar, click on "Table Editor"
2. Click "Create a new table"
3. For the sessions table:
   - Name: `sessions`
   - Columns:
     - `id` (type: int8, Primary Key, Identity)
     - `day` (type: text, Not Nullable)
     - `date` (type: text, Not Nullable)
     - `time` (type: text, Not Nullable)
     - `max_attendees` (type: int4, Default: 10, Not Nullable)
   - Click "Save"

4. Create the attendees table:
   - Name: `attendees`
   - Columns:
     - `id` (type: int8, Primary Key, Identity)
     - `session_id` (type: int8, Not Nullable, Foreign Key to sessions.id)
     - `name` (type: text, Not Nullable)
     - `email` (type: text, Not Nullable)
     - `created_at` (type: timestamptz, Default: now())
   - Add a unique constraint on (session_id, email)
   - Click "Save"

## 5. Checking Vercel Environment Variables

Your Vercel deployment needs the correct environment variables:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Make sure you have these variables set:
   - `SUPABASE_URL`: https://ozqlhaprezyrluocvnms.supabase.co
   - `SUPABASE_KEY`: (your anon key from .env)
4. If you've made changes, redeploy your project

## 6. Permissions Check

If you're still having issues:

1. In the Supabase dashboard, go to Authentication → Policies
2. Make sure your tables have appropriate policies
3. For simple testing, you can enable anonymous access:
   - Click on your table name
   - Go to "Policies" tab
   - Click "New Policy"
   - Select "Enable read access to everyone" and/or "Enable insert access to everyone"
   - Save the policy

If you need more help or screenshots, please let me know!
