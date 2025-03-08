const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('Error: Missing Supabase credentials in environment variables.');
  console.error('Make sure SUPABASE_URL and SUPABASE_KEY are set in your .env file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Utility function to check connection
async function checkConnection() {
  try {
    // Simple query to verify connection
    const { data, error } = await supabase.from('sessions').select('count', { count: 'exact' });
    
    if (error) throw error;
    console.log('Successfully connected to Supabase!');
    return true;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error.message);
    return false;
  }
}

module.exports = {
  supabase,
  checkConnection
};
