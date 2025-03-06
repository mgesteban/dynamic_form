# Mini Forum Sign-up System

A simple sign-up system for mini forums with a maximum of 10 attendees per session. Features 5 different day/time options.

## Live Demo

[View the live demo on Vercel](https://your-vercel-deployment-url.vercel.app)

## Project Structure

```
mini-forum-signup/
├── package.json
├── server.js
├── vercel.json
└── public/
    └── index.html
```

## Local Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mini-forum-signup.git
   cd mini-forum-signup
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Access the application at `http://localhost:3000`

## Deployment to Vercel

### Option 1: One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mini-forum-signup)

### Option 2: Manual Deployment

1. Push your code to GitHub:
   ```
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Install Vercel CLI (optional):
   ```
   npm install -g vercel
   ```

3. Deploy using Vercel CLI:
   ```
   vercel
   ```

4. Or connect your GitHub repository to Vercel through the Vercel dashboard.

## How It Works

This application uses:
- **Express.js**: For the backend API
- **Plain HTML/CSS/JS**: For the frontend interface
- **In-memory data storage** in production (Vercel)
- **File-based storage** during local development

The application detects whether it's running on Vercel and automatically switches between file-based and in-memory storage.

## Features

- Clean, responsive design
- Form validation
- Real-time session availability updates
- Admin view for tracking registrations
- Seamless deployment to Vercel

## Customization

- Edit the session details in `server.js` to change dates and times
- Modify the styling in `index.html` to match your branding

## Notes on Persistence

When deployed to Vercel, this application uses in-memory storage which will reset when the serverless function goes cold. For a production application, you would want to connect to a database like MongoDB, PostgreSQL (via Vercel Postgres), or a serverless database.

## License

MIT
