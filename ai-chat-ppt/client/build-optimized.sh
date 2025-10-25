#!/bin/bash

# Optimized build script for Vercel deployment
echo "🚀 Starting optimized build process..."

# Set environment variables
export NODE_ENV=production
export CI=true

# Clean install with optimized settings
echo "📦 Installing dependencies with optimizations..."
npm ci --only=production --no-audit --no-fund --silent

# Build the React app
echo "🔨 Building React application..."
npm run build

# Verify build
if [ -d "build" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build directory size: $(du -sh build | cut -f1)"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Build process completed!"
