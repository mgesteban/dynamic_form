import { supabase } from '../db/supabase.js';

export async function getSessions(req, res) {
  try {
    const { data, error } = await supabase
      .from('sessions_with_counts')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching sessions:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch sessions',
        details: error.message 
      });
    }

    res.json({ sessions: data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      details: err.message 
    });
  }
}
