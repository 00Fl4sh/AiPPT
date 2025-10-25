@echo off
REM AI Chat PPT - Push to GitHub Script

echo 🚀 Pushing all changes to GitHub...

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Error: Not in a git repository. Please initialize git first.
    pause
    exit /b 1
)

REM Add all files
echo 📁 Adding all files to git...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "Fix Vercel root directory detection and deployment configuration"

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push origin main

echo.
echo ✅ All changes pushed to GitHub!
echo.
echo 🎯 Next steps:
echo 1. Go to Vercel dashboard
echo 2. Import your GitHub repository
echo 3. Set Framework Preset to "Create React App"
echo 4. Set Root Directory to "./" (empty)
echo 5. Set Build Command to "npm run build"
echo 6. Set Output Directory to "build"
echo 7. Add environment variable: REACT_APP_GEMINI_API_KEY
echo 8. Deploy!

echo.
echo 📖 For detailed instructions, see VERCEL_ROOT_DIRECTORY_FIX.md
pause
