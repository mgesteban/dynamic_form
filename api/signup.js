// This file should be placed in the "api" directory at the root of your project
// Vercel will automatically treat it as a serverless function at the route /api/signup

// Import the sessions data to keep everything in sync
// This uses the same data as defined in /api/sessions.js
const sessionsData = [
  { id: 1, day: 'Monday', date: 'March 10', time: '4:00 PM - 5:00 PM', attendees: [], maxAttendees: 10 },
  { id: 2, day: 'Tuesday', date: 'March 11', time: '4:00 PM - 5:00 PM', attendees: [], maxAttendees: 10 },
  { id: 3, day: 'Thursday', date: 'March 13', time: '2:00 PM - 3:00 PM', attendees: [], maxAttendees: 10 },
  { id: 5, day: 'Thursday', date: 'March 13', time: '4:00 PM - 5:00 PM', attendees: [], maxAttendees: 10 },
];

// This is for temporary in-memory storage on the serverless function
// Note: In a real app, you'd use a database instead
let attendees = [];

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
      
      // Find the selected session
      const sessionIndex = sessionsData.findIndex(session => session.id === parseInt(sessionId));
      
      // Validate session exists
      if (sessionIndex === -1) {
        return res.status(404).json({ message: 'Session not found' });
      }
      
      const session = sessionsData[sessionIndex];
      
      // Add to our attendees list (in-memory storage for this simple app)
      attendees.push({ name, email, sessionId: parseInt(sessionId) });
      
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
