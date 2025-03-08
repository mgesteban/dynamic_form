# MiniForum: Dynamic Registration System Template

A modern, efficient registration system designed for organizing and managing forum sessions with limited attendance. This project combines a responsive frontend experience with robust backend data management all connected to a Supabase database and deployable using Vercel.

## Template Features

This template gives you:

- **Ready-to-use Registration System**: Complete system for managing sessions with capacity limits
- **Full Supabase Integration**: Database setup with relational structure and row-level security
- **API Endpoints**: RESTful endpoints for session retrieval and signup processing
- **Responsive Frontend**: Clean interface showing sessions and available spots
- **Deployment-Ready**: Configuration for Vercel serverless deployment

## Quick Start

1. **Use this template**
   - Click the "Use this template" button on GitHub to create your own repository

2. **Clone your new repository**
   ```
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

3. **Install dependencies**
   ```
   npm install
   ```

4. **Set up Supabase**
   - Create a Supabase account at [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example` with your credentials:
     ```
     SUPABASE_URL=https://your-project-id.supabase.co
     SUPABASE_KEY=your-supabase-anon-key
     ```
   - Initialize your database schema using the setup scripts in `/setup`

5. **Run the server locally**
   ```
   npm run dev
   ```

6. **Visit http://localhost:3000 in your browser**

## Project Structure

- **api/**: API endpoint handlers
- **db/**: Database utilities and connection
- **public/**: Static frontend files
- **setup/**: Database initialization scripts

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **Database**: [Supabase](https://supabase.com) - open source Firebase alternative
- **Deployment**: [Vercel](https://vercel.com) - for seamless serverless deployment

## Deployment

This template is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set your environment variables in the Vercel dashboard
4. Deploy!

For detailed deployment instructions, see the `deploy-guide.md` file.

## Customizing the Template

This template provides a solid foundation that you can extend in many ways:

- Modify the database schema for additional fields
- Customize the frontend styling
- Add user authentication
- Implement admin interfaces
- Add email notifications

## License

MIT License - feel free to use this template for any purpose.
