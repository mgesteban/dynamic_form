// This file should be placed in the "api" directory at the root of your project
// Vercel will automatically treat it as a serverless function at the route /api/sessions

// Updated on March 6, 2025
// Define our session data (this is our "database" for this simple app)
const sessionsData = [
  { id: 1, day: 'Monday', date: 'March 10', time: '4:00 PM - 5:00 PM', attendees: [], maxAttendees: 10 },
  { id: 2, day: 'Tuesday', date: 'March 11', time: '4:00 PM - 5:00 PM', attendees: [], maxAttendees: 10 },
  { id: 3, day: 'Thursday', date: 'March 13', time: '2:00 PM - 3:00 PM', attendees: [], maxAttendees: 10 },
  { id: 5, day: 'Thursday', date: 'March 13', time: '4:00 PM - 5:00 PM', attendees: [], maxAttendees: 10 },
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

  // Log request for debugging
  console.log('API request received:', req.method, req.url);
  
  // Handle GET request - return sessions data
  if (req.method === 'GET') {
    console.log('Returning updated session data');
    return res.status(200).json(sessionsData);
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
};
