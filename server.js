// Add this near the top of your server.js file
console.log('Server version: March 7, 2025 - Supabase integration');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const { supabase, checkConnection } = require('./db/supabase');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS to ensure API requests work
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

// No more in-memory sessions data - we now use Supabase database

// Routes
// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all sessions from Supabase
app.get('/api/sessions', async (req, res) => {
  try {
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
    res.json(formattedSessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Failed to retrieve sessions', error: error.message });
  }
});

// Sign up for a session with Supabase
app.post('/api/signup', async (req, res) => {
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
    res.status(201).json({ 
      message: `Thank you, ${name}! You have successfully signed up for the ${session.day} session.` 
    });
  } catch (error) {
    console.error('Error processing signup:', error);
    res.status(500).json({ message: 'Failed to process signup', error: error.message });
  }
});

// Check database connection and initialize server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  
  // Verify Supabase connection before starting server
  checkConnection()
    .then(connected => {
      if (connected) {
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT} with Supabase connection`);
        });
      } else {
        console.error('Failed to connect to Supabase. Check your credentials.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Error connecting to Supabase:', error);
      process.exit(1);
    });
}

// For Vercel - export the Express app
module.exports = app;
