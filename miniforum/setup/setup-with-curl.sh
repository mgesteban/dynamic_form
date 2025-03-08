#!/bin/bash
# This script sets up Supabase tables and data using direct REST API calls
# Run with: bash setup/setup-with-curl.sh

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

echo "Setting up Supabase database using direct REST API calls..."
echo "Using URL: $SUPABASE_URL"
echo "Using key: ${SUPABASE_KEY:0:8}...${SUPABASE_KEY:(-8)}" # Shows first 8 and last 8 chars

# Step 1: Create sessions table using PostgreSQL
echo ""
echo "==== Step 1: Creating sessions table ===="
curl -X POST "$SUPABASE_URL/rest/v1/rpc/execute_sql" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE TABLE IF NOT EXISTS sessions (id SERIAL PRIMARY KEY, day TEXT NOT NULL, date TEXT NOT NULL, time TEXT NOT NULL, max_attendees INTEGER NOT NULL DEFAULT 10)"
  }'
echo ""

# Step 2: Create attendees table
echo ""
echo "==== Step 2: Creating attendees table ===="
curl -X POST "$SUPABASE_URL/rest/v1/rpc/execute_sql" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE TABLE IF NOT EXISTS attendees (id SERIAL PRIMARY KEY, session_id INTEGER NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), UNIQUE(session_id, email))"
  }'
echo ""

# Step 3: Add foreign key constraint
echo ""
echo "==== Step 3: Adding foreign key constraint ===="
curl -X POST "$SUPABASE_URL/rest/v1/rpc/execute_sql" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "ALTER TABLE attendees ADD CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE"
  }'
echo ""

# Step 4: Insert sample data
echo ""
echo "==== Step 4: Inserting sample data ===="
curl -X POST "$SUPABASE_URL/rest/v1/sessions" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d '[
    {"id": 1, "day": "Monday", "date": "March 10", "time": "4:00 PM - 5:00 PM", "max_attendees": 10},
    {"id": 2, "day": "Tuesday", "date": "March 11", "time": "4:00 PM - 5:00 PM", "max_attendees": 10},
    {"id": 3, "day": "Thursday", "date": "March 13", "time": "2:00 PM - 3:00 PM", "max_attendees": 10},
    {"id": 5, "day": "Thursday", "date": "March 13", "time": "4:00 PM - 5:00 PM", "max_attendees": 10}
  ]'
echo ""

# Step 5: Create view for sessions with counts
echo ""
echo "==== Step 5: Creating view for session counts ===="
curl -X POST "$SUPABASE_URL/rest/v1/rpc/execute_sql" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE OR REPLACE VIEW sessions_with_counts AS SELECT s.id, s.day, s.date, s.time, s.max_attendees, COUNT(a.id) AS attendee_count FROM sessions s LEFT JOIN attendees a ON s.id = a.session_id GROUP BY s.id, s.day, s.date, s.time, s.max_attendees"
  }'
echo ""

# Step 6: Verify data
echo ""
echo "==== Step 6: Verifying data ===="
curl -X GET "$SUPABASE_URL/rest/v1/sessions?select=*" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY"
echo ""

echo ""
echo "==== Database setup complete ===="
echo "If you encountered any errors, please check the Supabase dashboard"
echo "and follow the manual setup instructions in setup/detailed-supabase-instructions.md"
