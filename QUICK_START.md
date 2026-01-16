# Quick Start Guide

Your Certify application is ready to run! Follow these simple steps:

## 🚀 Starting the Application

### Option 1: Use the Start Script (Easiest)

Run the start script:

```powershell
.\start-local.ps1
```

This will open two PowerShell windows:
- One for the backend server (port 5000)
- One for the frontend server (port 3000)

### Option 2: Manual Start

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

## 📍 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 🎯 First Steps

1. **Sign Up** - Create a new organization account
   - Go to the Sign In page
   - Click "Request Access" or navigate to signup
   - Create your organization

2. **Issue a Certificate** - After logging in:
   - Go to "Issue New" tab
   - Fill in recipient details
   - Upload a document (optional)
   - Click "Secure & Finalize Credential"

3. **Verify a Certificate** - Use the public verification:
   - Click "Verify Certificate" in the navigation
   - Enter a certificate ID (e.g., CRT-1234-AB)
   - View the verification results

## 🔧 Troubleshooting

### Backend won't start
- Make sure you're in the `server` directory
- Check that `.env` file exists in the `server` directory
- Verify Node.js is installed: `node --version`

### Frontend won't start
- Make sure you're in the project root
- Check that `.env.local` file exists
- Try deleting `node_modules` and running `npm install` again

### Database errors
- The database file `server/dev.db` should be created automatically
- If you get migration errors, run: `cd server && npm run prisma:migrate`

### Port already in use
- Backend uses port 5000
- Frontend uses port 3000
- Close any other applications using these ports

## 📝 Notes

- The database uses SQLite (file: `server/dev.db`) for easy local development
- Email service is disabled by default (emails will be logged to console)
- Blockchain is in mock mode (simulated transactions)
- All data is stored locally in the SQLite database

## 🛑 Stopping the Servers

- Press `Ctrl+C` in each PowerShell window
- Or simply close the PowerShell windows

Happy coding! 🎉

