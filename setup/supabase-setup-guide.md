# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details:
   - Name: miniforum
   - Database Password: (create a secure password)
   - Region: (choose closest to you)
5. Click "Create New Project"
6. Wait for database to be ready (about 1 minute)

## 2. Get Project Credentials

1. In your project dashboard:
   - Go to Project Settings (gear icon)
   - Click "API" in the sidebar
   - Find these values:
     - Project URL
     - anon/public key (NOT the service_role key)
2. Create a `.env` file in the project root:
   ```
   SUPABASE_URL=your-project-url
   SUPABASE_KEY=your-anon-key
   PORT=3000
   ```

## 3. Create Database Tables

1. In your project dashboard:
   - Go to "Table Editor"
   - Click "New Table"

2. Create Sessions Table:
   ```sql
   CREATE TABLE sessions (
     id SERIAL PRIMARY KEY,
     day TEXT NOT NULL,
     date TEXT NOT NULL,
     time TEXT NOT NULL,
     max_attendees INTEGER DEFAULT 30
   );
   ```

3. Create Attendees Table:
   ```sql
   CREATE TABLE attendees (
     id SERIAL PRIMARY KEY,
     session_id INTEGER REFERENCES sessions(id),
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     UNIQUE(session_id, email)
   );
   ```

## 4. Add Session Data

Run these SQL commands in the SQL Editor:

```sql
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
```

## Next Steps

After completing these steps:
1. Verify tables were created successfully
2. Confirm session data was inserted
3. Test querying the data through the Table Editor

Once everything is set up, we'll proceed with implementing the API endpoints and frontend interface.
