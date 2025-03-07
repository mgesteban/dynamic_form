// This file should be placed in the "api" directory at the root of your project
// Vercel will automatically treat it as a serverless function at the route /api/sessions

// Load environment variables
require('dotenv').config();

// Import Supabase client - using local version for serverless compatibility
const { supabase } = require('./supabase-client');

// Export the handler function for the API route
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Log request for debugging
  console.log('API request received:', req.method, req.url);
  
  // Handle GET request - fetch sessions data from Supabase
  if (req.method === 'GET') {
    try {
      console.log('Fetching sessions from Supabase');
      
      // Using the sessions_with_counts view to get attendee counts
      const { data, error } = await supabase
        .from('sessions_with_counts')
        .select('*')
        .order('id');
      
      if (error) {
        console.error('Error fetching sessions:', error);
        return res.status(500).json({ 
          message: 'Failed to retrieve sessions', 
          error: error.message 
        });
      }
      
      // Format the data to match the frontend expectations
      const formattedSessions = data.map(session => ({
        id: session.id,
        day: session.day,
        date: session.date,
        time: session.time,
        maxAttendees: session.max_attendees,
        attendees: [], // We don't actually return the attendees list for privacy reasons
        attendeeCount: session.attendee_count || 0
      }));
      
      console.log(`Returning ${formattedSessions.length} sessions from Supabase`);
      return res.status(200).json(formattedSessions);
    } catch (err) {
      console.error('Unexpected error fetching sessions:', err);
      return res.status(500).json({ 
        message: 'Server error while retrieving sessions', 
        error: err.message 
      });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
};
