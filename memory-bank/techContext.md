# Technical Context: MiniForum

## Technology Stack

### Frontend
- **Languages**: HTML, CSS, JavaScript
- **Approach**: Vanilla JS without frameworks
- **Features**: Session display, registration form

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **API Style**: RESTful JSON API
- **Key Libraries**: 
  - @supabase/supabase-js: Database client
  - dotenv: Environment configuration
  - express: Web framework

### Database
- **Service**: Supabase
- **Type**: PostgreSQL
- **Features**: 
  - Relational tables
  - Row-level security
  - Real-time capabilities

## Required Setup

### 1. Supabase Project
- Create new project at supabase.com
- Get project URL and anon key
- Set up environment variables

### 2. Database Schema
```sql
-- Sessions table
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  day TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  max_attendees INTEGER DEFAULT 30
);

-- Attendees table
CREATE TABLE attendees (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES sessions(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(session_id, email)
);
```

### 3. Environment Variables
```
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-anon-key
PORT=3000
```

## API Design

### Endpoints
1. `GET /api/sessions`
   - List all available sessions
   - Include attendee counts

2. `POST /api/signup`
   - Register for a session
   - Validate capacity and duplicates

### Response Format
```json
// Sessions response
{
  "sessions": [
    {
      "id": 1,
      "day": "Wednesday",
      "date": "April 9",
      "time": "1:30 p.m. – 2:30 p.m.",
      "max_attendees": 30,
      "current_attendees": 0
    }
  ]
}

// Signup response
{
  "success": true,
  "message": "Registration successful"
}
```

## Technical Constraints

1. **Data Integrity**
   - Prevent duplicate registrations
   - Enforce session capacity limits
   - Validate email format

2. **Security**
   - Secure database access
   - Input validation
   - Error handling

3. **Performance**
   - Efficient database queries
   - Quick response times
   - Handle concurrent registrations
