# AI Chat PPT - AI-Powered PowerPoint Generator

An advanced AI-powered chat application that generates and edits professional PowerPoint presentations using Google's Gemini AI model. Built with React frontend and Node.js backend.

## 🏗️ Project Structure

```
ai-chat-ppt/
├── frontend/              # React Frontend
│   ├── src/              # React components
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies
│   ├── tsconfig.json     # TypeScript config
│   └── vercel.json       # Frontend deployment
├── backend/              # Node.js Backend API
│   ├── server.js         # Express server
│   ├── package.json      # Backend dependencies
│   └── vercel.json       # Backend deployment
├── vercel.json           # Root deployment config
└── .vercelignore         # Git ignore rules
```

## 🚀 Quick Start

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Backend Development
```bash
cd backend
npm install
npm start
```

### Full Stack Development
```bash
# Terminal 1 - Frontend
cd frontend && npm start

# Terminal 2 - Backend  
cd backend && npm start
```

## 📦 Dependencies

### Frontend
- React 18 with TypeScript
- Google Gemini AI
- Lucide React icons
- React Scripts

### Backend
- Express.js
- pptxgenjs (PowerPoint generation)
- Puppeteer (Web scraping)
- Multer (File uploads)
- CORS support

## 🚀 Deployment

This project is configured for Vercel deployment with separate frontend and backend builds.

## 🔧 Environment Variables

Create `.env` files in both directories:

**Frontend (.env):**
```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

**Backend (.env):**
```
NODE_ENV=production
```

## 📄 License

MIT License
