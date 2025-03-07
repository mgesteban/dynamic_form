# MiniForum: Dynamic Signup System

MiniForum is a modern, efficient registration system designed for organizing and managing forum sessions with limited attendance. This project combines a responsive frontend experience with robust backend data management, all connected to a Supabase database and deployed using Vercel.

## Project Overview

MiniForum allows organizers to create and manage forum sessions with the following features:

- **Session Management**: Organize multiple sessions with different dates and times
- **Capacity Control**: Automatically enforce maximum attendee limits for each session
- **Real-time Data**: Dynamic updates showing available spots in each session
- **Seamless Signup**: Simple, intuitive interface for attendees to register
- **Data Persistence**: All session and attendee data stored in Supabase

## Technical Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **Database**: [Supabase](https://supabase.com) - open source Firebase alternative
- **Deployment**: [Vercel](https://vercel.com) - for seamless serverless deployment
- **API Structure**: RESTful API endpoints for sessions and signup

## Architecture

The application follows a modern serverless architecture:

1. **Serverless API Routes**: `/api/sessions` and `/api/signup` handle data operations
2. **Supabase Integration**: Secure database connection with proper authentication
3. **Responsive Design**: Works on mobile and desktop devices
4. **Optimized Deployment**: Fast loading times through Vercel's global CDN

## Database Structure

The database uses a relational model with:

- **Sessions table**: Stores forum session details (day, date, time, capacity)
- **Attendees table**: Tracks registrations with foreign key relationships to sessions
- **Unique constraints**: Prevents double-booking and ensures data integrity

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase credentials in `.env`
4. Run locally: `npm run dev`

See the `deploy-guide.md` for detailed deployment instructions with Vercel and Supabase.
