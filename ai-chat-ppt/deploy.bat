@echo off
REM AI Chat PPT - Deployment Script for Windows

echo 🚀 Starting deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Build the project
echo 🔨 Building the project...
call npm run build

REM Check if build was successful
if not exist "build" (
    echo ❌ Error: Build failed. No build directory found.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo 📁 Build directory contents:
dir build

echo.
echo 🎯 Next steps:
echo 1. Push your code to GitHub
echo 2. Connect your repository to Vercel
echo 3. Set environment variables in Vercel dashboard:
echo    - REACT_APP_GEMINI_API_KEY
echo 4. Deploy!

echo.
echo 📖 For detailed instructions, see DEPLOYMENT.md
pause
