#!/bin/bash

# AI Chat PPT - Vercel Build Script
echo "🚀 Starting Vercel build process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Current directory: $(pwd)"
    echo "📁 Directory contents:"
    ls -la
    exit 1
fi

echo "✅ Found package.json in $(pwd)"
echo "📦 Installing dependencies..."
npm install

echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Error: Build failed. No build directory found."
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build directory contents:"
ls -la build/

echo "🎯 Build process completed!"
