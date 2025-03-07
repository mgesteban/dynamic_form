require('dotenv').config();
const { supabase } = require('../db/supabase');

async function initializeDatabase() {
  console.log('Initializing Supabase database directly...');
  
  try {
    // Create sessions table
    console.log('Creating sessions table...');
    const { error: sessionsError } = await supabase.from('sessions').insert([
      { id: 1, day: 'Monday', date: 'March 10', time: '4:00 PM - 5:00 PM', max_attendees: 10 },
      { id: 2, day: 'Tuesday', date: 'March 11', time: '4:00 PM - 5:00 PM', max_attendees: 10 },
      { id: 3, day: 'Thursday', date: 'March 13', time: '2:00 PM - 3:00 PM', max_attendees: 10 },
      { id: 5, day: 'Thursday', date: 'March 13', time: '4:00 PM - 5:00 PM', max_attendees: 10 }
    ]).select();
    
    if (sessionsError) {
      console.error('Error creating sessions:', sessionsError);
      if (sessionsError.code === '42P01') {
        console.error('The "sessions" table does not exist. Please create it manually in the Supabase SQL Editor.');
        console.log('Use the SQL in setup/create_tables.sql to create the tables.');
      }
    } else {
      console.log('Sessions table populated successfully.');
    }
    
    // Check if we can query the sessions table
    console.log('Verifying sessions table...');
    const { data, error } = await supabase
      .from('sessions')
      .select('*');
    
    if (error) {
      console.error('Error accessing sessions table:', error);
    } else {
      console.log(`Successfully accessed sessions table! Found ${data.length} sessions.`);
      console.log(data);
    }
    
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
}

// Run the initialization
initializeDatabase().catch(console.error);
