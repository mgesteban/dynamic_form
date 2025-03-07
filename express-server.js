const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

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

// Global sessions data for serverless environment
// In a production app, you'd use a database instead
let sessionsData = [
  { id: 1, day: 'Monday', date: 'March 10', time: '4:00 PM - 5:00 PM', attendees: [], maxAttendees: 10 },
  { id: 2, day: 'Tuesday', date: 'March 11', time: '4:00 PM - 5:00 PM', attendees: [], maxAttendees: 10 },
  { id: 3, day: 'Thursday', date: 'March 13', time: '2:00 PM - 3:00 PM', attendees: [], maxAttendees: 10 },
  { id: 5, day: 'Thursday', date: 'March 13', time: '4:00 PM - 5:00 PM', attendees: [], maxAttendees: 10 },
];

// Routes
// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all sessions - debug version with error handling
app.get('/api/sessions', (req, res) => {
  try {
    // Add a console log for debugging (will show in Vercel logs)
    console.log('Sessions requested, returning:', JSON.stringify(sessionsData).substring(0, 100) + '...');
    res.json(sessionsData);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Failed to retrieve sessions', error: error.message });
  }
});

// Sign up for a session
app.post('/api/signup', (req, res) => {
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
    
    // Find the selected session
    const sessionIndex = sessionsData.findIndex(session => session.id === parseInt(sessionId));
    
    // Validate session exists
    if (sessionIndex === -1) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    const session = sessionsData[sessionIndex];
    
    // Check if session is full
    if (session.attendees.length >= session.maxAttendees) {
      return res.status(400).json({ message: 'This session is full. Please select another session.' });
    }
    
    // Check if user is already registered for this session
    if (session.attendees.some(attendee => attendee.email === email)) {
      return res.status(400).json({ message: 'You are already registered for this session.' });
    }
    
    // Add attendee to session
    session.attendees.push({ name, email });
    
    // Return success
    res.status(201).json({ 
      message: `Thank you, ${name}! You have successfully signed up for the ${session.day} session.` 
    });
  } catch (error) {
    console.error('Error processing signup:', error);
    res.status(500).json({ message: 'Failed to process signup', error: error.message });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// For Vercel - export the Express app
module.exports = app;
