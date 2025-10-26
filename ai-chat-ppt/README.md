# AI Chat PPT - AI-Powered PowerPoint Generator

An advanced AI-powered chat application that generates and edits professional PowerPoint presentations using Google's Gemini AI model. Built with React frontend, featuring real-time slide editing, responsive design, and professional presentation templates.

## ✨ Features

- **AI-Powered Generation**: Create professional PowerPoint presentations using natural language prompts
- **Real-time Slide Editing**: Edit individual slides with AI assistance and preview changes instantly
- **Professional Templates**: 9+ presentation templates including Executive, Tech Innovation, Creative, and Academic styles
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices with perfect 16:9 aspect ratio
- **Interactive Chat Interface**: Natural conversation flow with AI for presentation creation and editing
- **File Upload Support**: Upload documents and URLs for content extraction
- **Slide Preview**: Real-time preview of slides with thumbnail navigation
- **Download Support**: Export presentations as PowerPoint files
- **Chat History**: Save and restore previous conversations
- **Black Gradient Theme**: Modern, professional dark theme with elegant styling

## 🏗️ Project Structure

```
ai-chat-ppt/
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── PowerPointPreview.tsx    # Main preview component
│   │   │   ├── ChatInterface.tsx        # Chat interface
│   │   │   └── FileUpload.tsx          # File upload component
│   │   ├── services/           # API services
│   │   │   ├── geminiService.ts        # Gemini AI integration
│   │   │   ├── pptService.ts           # PowerPoint generation
│   │   │   └── chatHistoryService.ts   # Chat history management
│   │   ├── types/              # TypeScript definitions
│   │   │   ├── index.ts               # Main types
│   │   │   └── templates.ts            # Template definitions
│   │   └── App.tsx            # Main application
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   ├── tsconfig.json          # TypeScript config
│   └── .env                   # Environment variables
├── vercel.json                # Deployment config
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-chat-ppt
```

2. **Install dependencies**
```bash
cd frontend
npm install
```

3. **Set up environment variables**
```bash
# Create .env file in frontend directory
echo "REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here" > .env
```

### Development

**Start the application**
```bash
cd frontend
npm start
```

The application will run on `http://localhost:3000`

### Production Build
```bash
cd frontend
npm run build
```

## 📦 Dependencies

### Frontend
- **React 18** with TypeScript
- **Google Gemini AI** for content generation
- **Lucide React** for icons
- **React Scripts** for build tools
- **pptxgenjs** for PowerPoint generation
- **Responsive CSS** with clamp() functions

## 🎨 Templates

The application includes 9 professional presentation templates:

1. **Executive Premium** - Luxury business template with gold accents
2. **Tech Innovation** - Cutting-edge template for technology presentations
3. **Creative Flow** - Artistic template with vibrant colors
4. **Minimalist Elegance** - Clean and simple design
5. **Modern Professional** - Sleek contemporary business template
6. **Academic Insight** - Structured template for educational content
7. **Bold Statement** - High-contrast impactful design
8. **Eco-Friendly** - Natural and organic feel
9. **Dark Elegance** - Sophisticated dark theme

## 🚀 Deployment

### Vercel Deployment
This project is configured for Vercel deployment with frontend-only architecture.

1. **Connect to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel
```

2. **Environment Variables**
Set the following in Vercel dashboard:
- `REACT_APP_GEMINI_API_KEY` - Your Gemini API key

### Manual Deployment
```bash
# Build frontend
cd frontend && npm run build
```

## 🔧 Environment Variables

### Required Setup:

1. **Create `.env` file** in the `frontend` directory:
```bash
# Navigate to frontend directory
cd frontend

# Create .env file (Windows)
echo. > .env

# Create .env file (Mac/Linux)
touch .env
```

2. **Add your Gemini API key** to the `.env` file:
```env
REACT_APP_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

3. **Get your API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Security Note:
- ✅ Never commit the `.env` file to version control
- ✅ The `.env` file is already included in `.gitignore`
- ✅ Use `.env.example` as a template for other developers

## 🛠️ Development Features

### Slide Editing
- **Real-time Preview**: See changes instantly as you edit
- **Accept/Reject**: Choose to keep or discard edits
- **Template Integration**: Edits respect selected template styling
- **Responsive Design**: Works perfectly on all device sizes

### Chat Interface
- **AI Robot Icon**: Visual indicator for AI responses
- **Fixed Height**: Scrollable chat area with proper overflow
- **Message History**: Persistent chat history with local storage
- **File Upload**: Support for document and URL processing

### PowerPoint Generation
- **Professional Output**: High-quality PowerPoint files
- **Template Support**: All 9 templates fully supported
- **Download Feature**: Direct download of generated presentations
- **16:9 Aspect Ratio**: Standard presentation format

## 🐛 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Ensure `REACT_APP_GEMINI_API_KEY` is set correctly
   - Check that the API key has proper permissions
   - Verify the key is not expired

2. **Build Errors**
   - Run `npm install` in the frontend directory
   - Clear node_modules and reinstall if needed
   - Check Node.js version (requires 18+)

3. **Thumbnail Display Issues**
   - Clear browser cache
   - Check responsive design settings
   - Ensure proper container sizing

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review the code comments for implementation details
- Create an issue in the repository
