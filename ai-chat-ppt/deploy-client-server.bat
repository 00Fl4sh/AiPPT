@echo off
REM AI Chat PPT - Client-Server Structure Deployment Script

echo 🚀 Deploying client-server structure...

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Error: Not in a git repository. Please initialize git first.
    pause
    exit /b 1
)

REM Check if client folder exists
if not exist "client" (
    echo ❌ Error: client folder not found. Please check project structure.
    pause
    exit /b 1
)

echo ✅ Found client folder
echo 📁 Project structure:
echo   - client/ (React frontend)
echo   - backend/ (Node.js backend)

echo.
echo 🔧 Adding all files to git...
git add .

echo 💾 Committing changes...
git commit -m "Fix client-server structure for Vercel deployment"

echo 🚀 Pushing to GitHub...
git push origin main

echo.
echo ✅ All changes pushed to GitHub!
echo.
echo 🎯 CRITICAL VERCEL SETTINGS:
echo.
echo 1. Go to Vercel Dashboard: https://vercel.com
echo 2. Delete the existing project (if any)
echo 3. Import your GitHub repository: https://github.com/00Fl4sh/AiPPT
echo 4. Set these EXACT settings:
echo    - Framework Preset: Create React App
echo    - Root Directory: client (IMPORTANT!)
echo    - Build Command: npm run build
echo    - Output Directory: build
echo    - Install Command: npm install
echo    - Node.js Version: 18.x
echo 5. Add environment variable: REACT_APP_GEMINI_API_KEY
echo 6. Deploy!
echo.
echo 📖 For detailed instructions, see CLIENT_SERVER_STRUCTURE_DEPLOYMENT.md
echo.
echo 🔄 If it still fails, try:
echo    - Netlify: https://netlify.com (set Base Directory to "client")
echo    - Railway: https://railway.app (for full stack)
echo.
pause
