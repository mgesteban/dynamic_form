# Active Context: MiniForum

## Current Focus
Setting up the Supabase infrastructure and database schema for the forum registration system.

## Recent Activities
- Project initialization
- Documentation setup
- Planning database schema

## Active Decisions

### Database Schema Design
1. Sessions Table
   ```sql
   CREATE TABLE sessions (
     id SERIAL PRIMARY KEY,
     day TEXT NOT NULL,
     date TEXT NOT NULL,
     time TEXT NOT NULL,
     max_attendees INTEGER DEFAULT 30
   );
   ```

2. Attendees Table
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

## Next Steps

1. **Supabase Setup**
   - Create new Supabase project
   - Get project URL and anon key
   - Set up environment variables

2. **Database Implementation**
   - Create tables using schema
   - Add session data
   - Configure row-level security

3. **Application Setup**
   - Initialize Express application
   - Create API endpoints
   - Implement frontend interface

## Current Considerations

1. **Data Structure**
   - Session information format
   - Attendee registration details
   - Capacity management

2. **Security**
   - Email uniqueness per session
   - Capacity enforcement
   - Input validation

3. **User Experience**
   - Clear session display
   - Simple registration process
