import { supabase } from '../db/supabase.js';

export async function registerAttendee(req, res) {
  const { sessionId, name, email, classification } = req.body;

  // Validate required fields
  if (!sessionId || !name || !email || !classification) {
    return res.status(400).json({
      error: 'Missing required fields',
      details: 'Session ID, name, email, and classification are required'
    });
  }

  // Validate classification
  const validClassifications = ['Faculty', 'Administrator', 'Classified'];
  if (!validClassifications.includes(classification)) {
    return res.status(400).json({
      error: 'Invalid classification',
      details: 'Classification must be Faculty, Administrator, or Classified'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Invalid email format',
      details: 'Please provide a valid email address'
    });
  }

  try {
    // Check session exists and has capacity
    const { data: session, error: sessionError } = await supabase
      .from('sessions_with_counts')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({
        error: 'Session not found',
        details: 'The requested session does not exist'
      });
    }

    if (session.current_attendees >= session.max_attendees) {
      return res.status(400).json({
        error: 'Session full',
        details: 'This session has reached its maximum capacity'
      });
    }

    // Attempt registration
    const { error: registrationError } = await supabase
      .from('attendees')
      .insert([
        {
          session_id: sessionId,
          name,
          email,
          classification
        }
      ]);

    if (registrationError) {
      // Check if it's a unique constraint violation
      if (registrationError.code === '23505') {
        return res.status(400).json({
          error: 'Duplicate registration',
          details: 'You have already registered for this session'
        });
      }

      throw registrationError;
    }

    res.status(201).json({
      success: true,
      message: `Thank you ${name}! You have successfully registered for the ${session.day} session at ${session.time}.`
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      error: 'Registration failed',
      details: err.message
    });
  }
}
