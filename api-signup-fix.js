// This file should be placed in the "api" directory at the root of your project
// Vercel will automatically treat it as a serverless function at the route /api/signup

// Import the sessions data from our "database"
// Note: In a real app, this would be a database connection
// For this simple app, we're using a shared data object which will reset on each deployment
const sessionsData = [
  { id: 1, day: 'Monday', date: 'March 10', time: '10:00 AM - 11:30 AM', attendees: [], maxAttendees: 10 },
  { id: 2, day: 'Wednesday', date: 'March 12', time: '2:00 PM - 3:30 PM', attendees: [], maxAttendees: 10 },
  { id: 3, day: 'Friday', date: 'March 14', time: '9:00 AM - 10:30 AM', attendees: [], maxAttendees: 10 },
  { id: 4, day: 'Tuesday', date: 'March 18', time: '1:00 PM - 2:30 PM', attendees: [], maxAttendees: 10 },
  { id: 5, day: 'Thursday', date: 'March 20', time: '3:00 PM - 4:30 PM', attendees: [], maxAttendees: 10 },
];

// Export the handler function for the API route
module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
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
    return res.status(201).json({ 
      message: `Thank you, ${name}! You have successfully signed up for the ${session.day} session.` 
    });
  } catch (error) {
    console.error('Error processing signup:', error);
    return res.status(500).json({ message: 'Failed to process signup', error: error.message });
  }
};
