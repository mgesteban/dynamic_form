const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// For Vercel: use in-memory storage as Vercel's serverless functions don't support file system persistence
let sessionsData = null;

// Default sessions data
const defaultSessions = [
  { id: 1, day: 'Monday', date: 'March 10', time: '10:00 AM - 11:30 AM', attendees: [], maxAttendees: 10 },
  { id: 2, day: 'Wednesday', date: 'March 12', time: '2:00 PM - 3:30 PM', attendees: [], maxAttendees: 10 },
  { id: 3, day: 'Friday', date: 'March 14', time: '9:00 AM - 10:30 AM', attendees: [], maxAttendees: 10 },
  { id: 4, day: 'Tuesday', date: 'March 18', time: '1:00 PM - 2:30 PM', attendees: [], maxAttendees: 10 },
  { id: 5, day: 'Thursday', date: 'March 20', time: '3:00 PM - 4:30 PM', attendees: [], maxAttendees: 10 },
];

// Use file system for local development, memory for serverless environment (Vercel)
const isVercel = process.env.VERCEL === '1';
const DATA_FILE = path.join(__dirname, 'sessions.json');

// Initialize sessions data
const initializeSessions = () => {
  if (isVercel) {
    // In Vercel, use in-memory storage
    if (sessionsData === null) {
      sessionsData = [...defaultSessions];
    }
    return;
  }
  
  // Local development: use file system
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultSessions, null, 2));
      console.log('Initial sessions data created.');
    }
  } catch (err) {
    console.error('Error creating sessions data:', err);
  }
};

// Read sessions data
const getSessions = () => {
  if (isVercel) {
    // Use memory storage in Vercel
    if (sessionsData === null) {
      sessionsData = [...defaultSessions];
    }
    return sessionsData;
  }
  
  // Use file system for local development
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading sessions data:', err);
    return [...defaultSessions];
  }
};

// Write sessions data
const saveSessions = (sessions) => {
  if (isVercel) {
    // Use memory storage in Vercel
    sessionsData = [...sessions];
    return;
  }
  
  // Use file system for local development
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(sessions, null, 2));
  } catch (err) {
    console.error('Error saving sessions data:', err);
  }
};

// Initialize data on startup
initializeSessions();

// Routes
// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all sessions
app.get('/api/sessions', (req, res) => {
  const sessions = getSessions();
  res.json(sessions);
});

// Sign up for a session
app.post('/api/signup', (req, res) => {
  const { name, email, sessionId } = req.body;
  
  // Validate input
  if (!name || !email || !sessionId) {
    return res.status(400).json({ message: 'Please provide name, email, and session ID' });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }
  
  // Get sessions
  const sessions = getSessions();
  
  // Find the selected session
  const sessionIndex = sessions.findIndex(session => session.id === parseInt(sessionId));
  
  // Validate session exists
  if (sessionIndex === -1) {
    return res.status(404).json({ message: 'Session not found' });
  }
  
  const session = sessions[sessionIndex];
  
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
  
  // Save updated sessions
  saveSessions(sessions);
  
  // Return success
  res.status(201).json({ 
    message: `Thank you, ${name}! You have successfully signed up for the ${session.day} session.` 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
