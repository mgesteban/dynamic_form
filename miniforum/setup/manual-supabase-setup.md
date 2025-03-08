# Manual Supabase Table Setup

Yes, creating the tables manually using SQL in the Supabase dashboard is the best approach. Follow these steps:

## 1. Log into Supabase

1. Go to [Supabase](https://app.supabase.com) and log in
2. Select your project: `ozqlhaprezyrluocvnms`

## 2. Access the SQL Editor

1. In the left sidebar, click on **SQL Editor**
2. Click **+ New Query** to create a new SQL query

## 3. Create the Tables

Copy and paste the following SQL code into the SQL Editor:

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
INSERT INTO sessions (day, date, time, max_attendees)
VALUES 
  ('Monday', 'March 10', '4:00 PM - 5:00 PM', 10),
  ('Tuesday', 'March 11', '4:00 PM - 5:00 PM', 10),
  ('Thursday', 'March 13', '2:00 PM - 3:00 PM', 10),
  ('Thursday', 'March 13', '4:00 PM - 5:00 PM', 10)
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

4. Click the **Run** button to execute this SQL

## 4. Verify the Tables Were Created

1. In the left sidebar, click on **Table Editor**
2. You should see the new tables: `sessions` and `attendees`
3. Click on the `sessions` table to verify it contains the sample data

## 5. Set Up Row-Level Security (RLS) Policies

For this simple app, you'll need public access to the tables:

1. In Table Editor, select the `sessions` table
2. Click on **Authentication** in the table tab navigation
3. Enable RLS by turning on the toggle (if it's not already enabled)
4. Click **New Policy**
5. Select **For full access to all users**
6. Click **Save Policy**

Repeat the same steps for the `attendees` table.

## 6. Verify Vercel Environment Variables

Make sure your Vercel deployment has these environment variables:

- `SUPABASE_URL`: https://ozqlhaprezyrluocvnms.supabase.co
- `SUPABASE_KEY`: [your anon key from .env]

## 7. Test Your Deployment

After setting up the tables and environment variables, your deployment should work correctly. Test it by visiting your Vercel deployed site.
