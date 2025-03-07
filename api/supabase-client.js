// This file provides a Supabase client for the API routes
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get environment variables with fallbacks that won't cause initialization errors
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ozqlhaprezyrluocvnms.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96cWxoYXByZXp5cmx1b2N2bm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMDY5NzgsImV4cCI6MjA1Njg4Mjk3OH0.itoYfnZgxX4s4FM-uCmCHGkLrZ3AP-0imEwZiP4eGzw';

// Debug environment information (helpful for Vercel debugging)
console.log('Supabase client init - environment details:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SUPABASE_URL defined:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_KEY defined:', !!process.env.SUPABASE_KEY);
console.log('Using explicit URL:', SUPABASE_URL);

// Create Supabase client with explicit values
let supabase;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('Supabase client created successfully');
} catch (error) {
  console.error('Error creating Supabase client:', error.message);
  // Create empty mock to prevent crashes
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: { message: 'Supabase client initialization failed' } }),
      insert: () => ({ error: { message: 'Supabase client initialization failed' } })
    })
  };
}

module.exports = { supabase };
