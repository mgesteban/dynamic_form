-- Add classification column to attendees table
ALTER TABLE attendees
ADD COLUMN classification TEXT NOT NULL DEFAULT 'Faculty'
CHECK (classification IN ('Faculty', 'Administrator', 'Classified'));
