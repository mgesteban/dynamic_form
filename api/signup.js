// This file should be placed in the "api" directory at the root of your project
// Vercel will automatically treat it as a serverless function at the route /api/signup

// Load environment variables
require('dotenv').config();

// Import Supabase client
const { supabase } = require('../db/supabase');

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

  // Handle POST request - sign up for a session
  if (req.method === 'POST') {
    try {
      const { name, email, sessionId } = req.body;
      console.log('Signup request received:', { name, email, sessionId });
      
      // Validate input
      if (!name || !email || !sessionId) {
        return res.status(400).json({ message: 'Please provide name, email, and session ID' });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
      }
      
      // Convert sessionId to integer if it's a string
      const sessionIdInt = parseInt(sessionId);
      
      // First check if the session exists
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionIdInt)
        .single();
      
      if (sessionError || !session) {
        console.error('Error finding session:', sessionError);
        return res.status(404).json({ message: 'Session not found' });
      }
      
      // Check if the session is full
      const { data: countData, error: countError } = await supabase
        .from('attendees')
        .select('count', { count: 'exact' })
        .eq('session_id', sessionIdInt);
      
      if (countError) {
        console.error('Error checking session capacity:', countError);
        return res.status(500).json({ message: 'Failed to check session capacity' });
      }
      
      const currentAttendeeCount = countData.length;
      if (currentAttendeeCount >= session.max_attendees) {
        return res.status(400).json({ message: 'This session is full. Please select another session.' });
      }
      
      // Check if user is already registered for this session
      const { data: existingAttendee, error: checkError } = await supabase
        .from('attendees')
        .select('*')
        .eq('session_id', sessionIdInt)
        .eq('email', email);
      
      if (checkError) {
        console.error('Error checking existing registration:', checkError);
        return res.status(500).json({ message: 'Failed to check registration status' });
      }
      
      if (existingAttendee && existingAttendee.length > 0) {
        return res.status(400).json({ message: 'You are already registered for this session.' });
      }
      
      // Add the attendee to the database
      const { error: insertError } = await supabase
        .from('attendees')
        .insert([
          { session_id: sessionIdInt, name, email }
        ]);
      
      if (insertError) {
        console.error('Error registering attendee:', insertError);
        
        // Special handling for unique constraint violations
        if (insertError.code === '23505') {
          return res.status(400).json({ message: 'You are already registered for this session.' });
        }
        
        return res.status(500).json({ message: 'Failed to register for session' });
      }
      
      // Return success
      return res.status(201).json({ 
        message: `Thank you, ${name}! You have successfully signed up for the ${session.day} session.` 
      });
    } catch (error) {
      console.error('Error processing signup:', error);
      return res.status(500).json({ message: 'Failed to process signup', error: error.message });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
};
