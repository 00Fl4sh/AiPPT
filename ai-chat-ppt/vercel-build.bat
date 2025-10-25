@echo off
REM AI Chat PPT - Vercel Build Script for Windows

echo 🚀 Starting Vercel build process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Current directory: %CD%
    echo 📁 Directory contents:
    dir
    exit /b 1
)

echo ✅ Found package.json in %CD%
echo 📦 Installing dependencies...
call npm install

echo 🔨 Building the project...
call npm run build

REM Check if build was successful
if not exist "build" (
    echo ❌ Error: Build failed. No build directory found.
    exit /b 1
)

echo ✅ Build completed successfully!
echo 📁 Build directory contents:
dir build

echo 🎯 Build process completed!
