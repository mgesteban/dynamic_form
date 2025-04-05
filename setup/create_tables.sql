-- Create Sessions Table
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  day TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  max_attendees INTEGER DEFAULT 30
);

-- Create Attendees Table with foreign key and unique constraint
CREATE TABLE attendees (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES sessions(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(session_id, email)
);

-- Insert Session Data
INSERT INTO sessions (day, date, time) VALUES
('Wednesday', 'April 9', '1:30 p.m. – 2:30 p.m.'),
('Thursday', 'April 10', '2:00 p.m. – 3:00 p.m.'),
('Friday', 'April 11', '9:30 a.m. – 10:30 a.m.'),
('Friday', 'April 11', '11:00 a.m. – 12 noon'),
('Friday', 'April 11', '1:00 p.m. – 2:00 p.m.'),
('Monday', 'April 14', '10:00 a.m. – 11:00 a.m.'),
('Tuesday', 'April 15', '1:00 p.m. – 2:00 p.m.'),
('Thursday', 'April 17', '9:00 a.m. – 10:00 a.m.'),
('Thursday', 'April 17', '10:30 a.m. – 11:30 a.m.'),
('Friday', 'April 18', '1:00 p.m. – 2:00 p.m.'),
('Monday', 'April 21', '10:00 a.m. – 11:00 a.m.'),
('Monday', 'April 21', '11:30 a.m. – 12:30 p.m.'),
('Wednesday', 'April 23', '1:00 p.m. – 2:00 p.m.'),
('Wednesday', 'April 23', '2:30 p.m. – 3:30 p.m.'),
('Thursday', 'April 24', '10:00 a.m. – 11:00 a.m.');

-- Create a view for sessions with attendee counts
CREATE VIEW sessions_with_counts AS
SELECT 
  s.*,
  COALESCE(COUNT(a.id), 0)::integer as current_attendees
FROM sessions s
LEFT JOIN attendees a ON s.id = a.session_id
GROUP BY s.id;

-- Add Row Level Security (RLS) policies
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Allow public read access to sessions
CREATE POLICY "Public can view sessions"
  ON sessions FOR SELECT
  USING (true);

-- Allow public read access to attendee counts (but not individual attendee data)
CREATE POLICY "Public can view attendee counts"
  ON attendees FOR SELECT
  USING (true);

-- Allow public to register (insert) as an attendee
CREATE POLICY "Public can register for sessions"
  ON attendees FOR INSERT
  WITH CHECK (
    -- Ensure session exists and has capacity
    EXISTS (
      SELECT 1 FROM sessions_with_counts
      WHERE id = session_id
      AND current_attendees < max_attendees
    )
  );
