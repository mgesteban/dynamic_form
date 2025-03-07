// This file should be placed in the "api" directory at the root of your project
// Vercel will automatically treat it as a serverless function at the route /api/sessions

// Define our session data (this is our "database" for this simple app)
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

  // Handle GET request - return sessions data
  if (req.method === 'GET') {
    return res.status(200).json(sessionsData);
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
};
