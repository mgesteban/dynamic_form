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
