#!/bin/bash

# AI Chat PPT - Deployment Script
echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
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

echo ""
echo "🎯 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Connect your repository to Vercel"
echo "3. Set environment variables in Vercel dashboard:"
echo "   - REACT_APP_GEMINI_API_KEY"
echo "4. Deploy!"

echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
