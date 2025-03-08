# Miniforum Supabase Deployment Guide

This guide explains how to set up the Supabase database and deploy the Miniforum application to Vercel.

## 1. Supabase Setup

Before deploying, you need to set up your Supabase database:

1. Run the initialization script to create tables and initial data:
   ```bash
   node setup/init-supabase.js
   ```

2. Verify that the tables were created successfully in the Supabase dashboard:
   - Log in to your Supabase account
   - Open your project in the Supabase dashboard
   - Navigate to Table Editor to see the `sessions` and `attendees` tables
   - Check if sessions data was inserted correctly

## 2. Vercel Deployment

### Using the Vercel CLI

1. Install Vercel CLI if you haven't already:
   ```bash
   npm install -g vercel
   ```

2. Deploy with environment variables:
   ```bash
   vercel deploy --prod --env SUPABASE_URL=https://your-project-id.supabase.co --env SUPABASE_KEY=your-supabase-anon-key
   ```

### Using Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)

2. Import the project in the Vercel dashboard:
   - Go to https://vercel.com/new
   - Import your Git repository
   - Configure the following environment variables:
     - `SUPABASE_URL`: Your Supabase project URL (from your .env file)
     - `SUPABASE_KEY`: your-supabase-anon-key (use the value from your .env file)
   - Deploy the project

## 3. Test the Deployment

After deploying, test that the Supabase integration works correctly:

1. Visit your deployed site
2. Check if sessions load correctly
3. Try to sign up for a session
4. Verify in Supabase that the attendee data was saved

## Troubleshooting

If you encounter any issues:

1. Check Vercel logs for error messages
2. Verify that environment variables are set correctly
3. Make sure the Supabase tables exist and have the correct structure
4. Test locally before deploying to narrow down the issue
