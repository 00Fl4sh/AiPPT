# AI Chat PPT - AI-Powered PowerPoint Generator

An advanced AI-powered chat application that generates and edits professional PowerPoint presentations using Google's Gemini AI model. Built with React, TypeScript, and modern web technologies.

## 🎯 Project Overview

This application provides a chat-based interface similar to MagicSlides AI-Slide, allowing users to create, edit, and download PowerPoint presentations through natural language conversations with AI.

## ✨ Features

### Core Features
- 🤖 **AI-Powered Chat Interface**: Interactive chat with Gemini AI for presentation creation
- 📊 **Real PowerPoint Generation**: Generate actual PPTX files using pptxgenjs
- ✏️ **Dynamic Editing**: Edit existing presentations through natural language prompts
- 👁️ **Live Preview**: Real-time preview of generated slides
- 📥 **Download Support**: Download presentations as PPTX files
- 📚 **Chat History**: Save and revisit past conversations and presentations

### Advanced Features
- 🚀 **Real-Time Streaming**: Live AI responses with word-by-word streaming
- 👥 **Real-Time Collaboration**: Multi-user activity tracking
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🎨 **Modern UI**: Beautiful interface built with React and Tailwind CSS
- ⚡ **Real-Time Status**: Live connection and activity indicators

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **AI Integration**: Google Gemini 2.0 Flash (gemini-2.0-flash-exp)
- **PowerPoint Generation**: pptxgenjs
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Real-Time Features**: Custom streaming implementation

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

## 🚀 Setup Instructions

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd ai-chat-ppt
npm install
```

### 2. Get Gemini API Key
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Copy the API key

### 3. Configure Environment Variables
- Copy `env.example` to `.env`
- Add your Gemini API key:
```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the Development Server
```bash
npm start
```

### 5. Open in Browser
- Navigate to `http://localhost:3000`

## 📱 Usage Guide

### Creating Presentations
1. **Start a New Presentation**
   - Type a description in the chat interface
   - Example: "Create a presentation about renewable energy with 5 slides"
   - AI will generate structured slides with content

2. **Edit Existing Presentations**
   - Use natural language to modify presentations
   - Example: "Add a slide about solar panels" or "Change the title to 'Green Energy Solutions'"
   - AI will update the presentation accordingly

3. **Download Presentations**
   - Click the "Download" button to save as PPTX file
   - Files are generated using pptxgenjs for professional formatting

4. **View Chat History**
   - Access the "History" tab to see past conversations
   - Click on any history item to reload that conversation
   - All presentations are saved locally

### Real-Time Features
- **Live AI Responses**: Watch AI responses stream in real-time
- **Progressive Generation**: See slides appear as they're created
- **Collaboration Status**: View real-time collaboration indicators
- **Status Updates**: Monitor connection and activity status

## 🏗️ Project Structure

```
ai-chat-ppt/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ChatInterface.tsx          # Main chat interface
│   │   ├── PresentationPreview.tsx    # Presentation preview
│   │   ├── ChatHistory.tsx           # Chat history component
│   │   ├── RealTimeCollaboration.tsx # Real-time collaboration
│   │   ├── RealTimeStatus.tsx        # Status indicators
│   │   ├── StreamingMessage.tsx      # Streaming messages
│   │   └── TypingIndicator.tsx       # Typing indicators
│   ├── services/           # API and utility services
│   │   ├── geminiService.ts          # Gemini AI integration
│   │   ├── pptService.ts             # PowerPoint generation
│   │   ├── chatHistoryService.ts     # Local storage management
│   │   └── realTimeService.ts        # Real-time features
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx            # Main application component
│   └── index.tsx          # Application entry point
├── package.json           # Dependencies and scripts
├── README.md              # Project documentation
└── .env.example          # Environment variables template
```

## 🚀 Deployment

### Local Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Set environment variables in Netlify dashboard

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

## 📊 Features Implementation

### ✅ Core Requirements Met
- [x] Chat interface similar to MagicSlides AI-Slide
- [x] Gemini AI integration (gemini-2.0-flash-exp)
- [x] Real PowerPoint generation using pptxgenjs
- [x] Live preview of generated slides
- [x] Dynamic editing via natural language prompts
- [x] Download functionality for PPTX files

### ✅ Plus Points Implemented
- [x] Real-time streaming for AI responses
- [x] Download option for PPTX files
- [x] Chat history with conversation management
- [x] Real-time collaboration features
- [x] Responsive design for mobile and desktop

## 🔌 API Integration

The application uses Google's Gemini 2.0 Flash model for:
- **Content Generation**: Creating structured presentation content from user prompts
- **Dynamic Editing**: Modifying existing presentations based on natural language requests
- **Slide Structuring**: Organizing content into appropriate slide formats (title, content, bullet points)

## 🎨 Customization

### AI Prompts
Modify prompts in `src/services/geminiService.ts` to customize AI behavior:
```typescript
const systemPrompt = `Your custom AI instructions here...`;
```

### PowerPoint Styling
Adjust presentation styling in `src/services/pptService.ts`:
```typescript
slideObj.addText(title, {
  fontSize: 28,
  bold: true,
  color: '363636'
});
```

### UI Components
Update components in `src/components/` directory for custom styling and behavior.

## 🐛 Troubleshooting

### Common Issues

1. **API Key Error**
   - Ensure `REACT_APP_GEMINI_API_KEY` is set in `.env` file
   - Verify the API key is valid and has proper permissions

2. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check Node.js version (requires v16+)

3. **Download Issues**
   - Ensure browser allows file downloads
   - Check that pptxgenjs is properly imported

4. **Real-Time Features Not Working**
   - Verify browser supports modern JavaScript features
   - Check console for any JavaScript errors

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🎯 Future Enhancements

- [ ] PDF export functionality
- [ ] Advanced slide templates
- [ ] Multi-language support
- [ ] Cloud storage integration
- [ ] Advanced collaboration features
- [ ] Slide animations and transitions

---

**Built with ❤️ using React, TypeScript, and Google Gemini AI**