// This file provides a Supabase client for the API routes
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('Error: Missing Supabase credentials in environment variables.');
  console.error('Make sure SUPABASE_URL and SUPABASE_KEY are set in Vercel environment variables.');
}

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

module.exports = { supabase };
