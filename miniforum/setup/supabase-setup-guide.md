# Supabase Setup Guide for Miniforum

## Database Setup in Supabase SQL Editor

The deployment error indicates that the database tables don't exist. You need to create them manually through the Supabase SQL Editor:

1. Go to https://app.supabase.com/project/ozqlhaprezyrluocvnms/editor
2. In the SQL Editor, paste and execute the following SQL to create the tables:

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

## Vercel Environment Variables

Make sure the Vercel deployment has the correct environment variables:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - `SUPABASE_URL`: https://ozqlhaprezyrluocvnms.supabase.co
   - `SUPABASE_KEY`: (your Supabase anon key)
4. Redeploy your project after adding the environment variables

## Testing the API

After setting up the database tables, test the API:

1. Visit `https://[your-vercel-app-url]/api/sessions` to check if it returns the session data
2. If it still returns an error, check the logs in Vercel for more details

## Troubleshooting

If you still encounter issues:

1. Check Vercel Logs: They provide detailed error messages
2. Verify Table Structure: Make sure tables were created properly
3. Test Queries: Use the Supabase Table Editor to test SQL queries directly
4. Check Environment Variables: Ensure they're correctly set in Vercel
