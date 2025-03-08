/**
 * This script directly creates database tables and sample data in Supabase
 * using the JavaScript API rather than SQL Editor.
 * 
 * Run this file with: node setup/setup-database-directly.js
 */

require('dotenv').config();
const { supabase } = require('../db/supabase');

async function setupDatabase() {
  console.log('Setting up Supabase database directly via API calls...');
  
  try {
    // Step 1: Create sessions table using RPC (call to database function)
    console.log('Step 1: Creating sessions table...');
    const createSessionsTable = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'sessions',
      column_definitions: `
        id SERIAL PRIMARY KEY,
        day TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        max_attendees INTEGER NOT NULL DEFAULT 10
      `
    });
    
    if (createSessionsTable.error) {
      console.error('Error creating sessions table:', createSessionsTable.error);
      console.log('\nFallback: Attempting to insert data directly (if table exists)...');
    } else {
      console.log('✓ Sessions table created successfully');
    }
    
    // Step 2: Create attendees table
    console.log('\nStep 2: Creating attendees table...');
    const createAttendeesTable = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'attendees',
      column_definitions: `
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(session_id, email)
      `
    });
    
    if (createAttendeesTable.error) {
      console.error('Error creating attendees table:', createAttendeesTable.error);
    } else {
      console.log('✓ Attendees table created successfully');
    }
    
    // Step 3: Insert sample data
    console.log('\nStep 3: Inserting sample session data...');
    const insertData = await supabase.from('sessions').upsert([
      { id: 1, day: 'Monday', date: 'March 10', time: '4:00 PM - 5:00 PM', max_attendees: 10 },
      { id: 2, day: 'Tuesday', date: 'March 11', time: '4:00 PM - 5:00 PM', max_attendees: 10 },
      { id: 3, day: 'Thursday', date: 'March 13', time: '2:00 PM - 3:00 PM', max_attendees: 10 },
      { id: 5, day: 'Thursday', date: 'March 13', time: '4:00 PM - 5:00 PM', max_attendees: 10 }
    ], { onConflict: 'id' });
    
    if (insertData.error) {
      console.error('Error inserting sample data:', insertData.error);
      
      if (insertData.error.code === '42P01') {
        console.error('\n❌ The "sessions" table does not exist. Please follow the manual setup instructions.');
        console.log('See: setup/detailed-supabase-instructions.md');
      }
    } else {
      console.log('✓ Sample data inserted successfully');
    }
    
    // Step 4: Verify data
    console.log('\nStep 4: Verifying database setup...');
    const { data, error } = await supabase.from('sessions').select('*');
    
    if (error) {
      console.error('Error verifying setup:', error);
    } else {
      console.log(`✓ Setup successful! Found ${data.length} sessions in database.`);
      console.log('\nSessions data:');
      console.table(data);
    }
    
    console.log('\n=================================');
    console.log('Direct setup attempt completed.');
    console.log('=================================');
    
    if (createSessionsTable.error || createAttendeesTable.error || insertData.error || error) {
      console.log('\n⚠️ There were some errors during setup.');
      console.log('You may need to create the tables manually using SQL.');
      console.log('Follow the instructions in: setup/detailed-supabase-instructions.md');
    }
    
  } catch (error) {
    console.error('Unexpected error during setup:', error.message);
    console.log('\nPlease follow the manual setup instructions in:');
    console.log('setup/detailed-supabase-instructions.md');
  }
}

// Run the setup
setupDatabase().catch(console.error);
