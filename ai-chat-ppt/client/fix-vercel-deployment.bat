@echo off
REM AI Chat PPT - Fix Vercel Deployment Script

echo 🚀 Fixing Vercel deployment issues...

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Error: Not in a git repository. Please initialize git first.
    pause
    exit /b 1
)

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ Error: package.json not found in current directory.
    echo 📁 Current directory: %CD%
    echo 📁 Directory contents:
    dir
    pause
    exit /b 1
)

echo ✅ Found package.json in %CD%
echo 📁 Directory contents:
dir

echo.
echo 🔧 Adding all files to git...
git add .

echo 💾 Committing changes...
git commit -m "Fix Vercel root directory detection and deployment configuration"

echo 🚀 Pushing to GitHub...
git push origin main

echo.
echo ✅ All changes pushed to GitHub!
echo.
echo 🎯 CRITICAL NEXT STEPS:
echo.
echo 1. Go to Vercel Dashboard: https://vercel.com
echo 2. Delete the existing project (if any)
echo 3. Import your GitHub repository: https://github.com/00Fl4sh/AiPPT
echo 4. Set these EXACT settings:
echo    - Framework Preset: Create React App
echo    - Root Directory: ./ (leave completely empty)
echo    - Build Command: npm run build
echo    - Output Directory: build
echo    - Install Command: npm install
echo    - Node.js Version: 18.x
echo 5. Add environment variable: REACT_APP_GEMINI_API_KEY
echo 6. Deploy!
echo.
echo 📖 For detailed instructions, see VERCEL_DEPLOYMENT_SOLUTION.md
echo.
echo 🔄 If it still fails, try:
echo    - Use Vercel CLI: npm i -g vercel && vercel
echo    - Try Netlify instead: https://netlify.com
echo.
pause
