# Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- GitHub repository with your code
- Vercel account (free)
- Gemini API key

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set the following settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `./` (root of your project)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# For production deployment
vercel --prod
```

### 3. Environment Variables
In your Vercel dashboard, add these environment variables:
- `REACT_APP_GEMINI_API_KEY`: Your Gemini API key

### 4. Build Configuration
The project includes:
- `vercel.json`: Vercel configuration
- `.vercelignore`: Files to ignore during deployment

## 🔧 Troubleshooting

### Common Issues:

1. **404 Error**
   - Ensure `vercel.json` is in the root directory
   - Check that build folder exists
   - Verify the routes configuration

2. **Build Failures**
   - Check Node.js version (should be 16+)
   - Ensure all dependencies are in package.json
   - Run `npm run build` locally to test

3. **Environment Variables**
   - Make sure `REACT_APP_GEMINI_API_KEY` is set in Vercel dashboard
   - Variable name must start with `REACT_APP_`

4. **Static Files Not Loading**
   - Check that static folder exists in build directory
   - Verify asset paths in index.html

## 📁 Project Structure for Deployment
```
ai-chat-ppt/
├── build/                 # Production build (generated)
├── public/                # Static assets
├── src/                   # Source code
├── package.json           # Dependencies
├── vercel.json           # Vercel configuration
├── .vercelignore         # Vercel ignore file
└── .env                  # Environment variables (local only)
```

## 🎯 Deployment Checklist
- [ ] Code pushed to GitHub
- [ ] `npm run build` works locally
- [ ] `vercel.json` configuration file exists
- [ ] Environment variables set in Vercel dashboard
- [ ] Build folder contains all necessary files
- [ ] Static assets are properly referenced
