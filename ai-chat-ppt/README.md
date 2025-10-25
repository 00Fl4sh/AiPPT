# AI Chat PPT - AI-Powered PowerPoint Generator

An advanced AI-powered chat application that generates and edits professional PowerPoint presentations using Google's Gemini AI model. Built with React, TypeScript, and modern web technologies.

## 🎯 Project Overview

This application provides a chat-based interface that allows users to create, edit, and download PowerPoint presentations through natural language conversations with AI. It features a modern, responsive design with real-time slide editing capabilities.

## ✨ Features

### Core Features
- 🤖 **AI-Powered Chat Interface**: Interactive chat with Gemini AI for presentation creation
- 📊 **Real PowerPoint Generation**: Generate actual PPTX files using pptxgenjs
- ✏️ **Dynamic Slide Editing**: Edit individual slides with preview and accept/reject options
- 👁️ **Live Preview**: Real-time preview of generated slides with responsive design
- 📥 **Download Support**: Download presentations as PPTX files
- 📚 **Chat History**: Save and revisit past conversations and presentations
- 🎨 **Slide Templates**: Multiple presentation templates for different use cases

### Advanced Features
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful interface with black gradient theme and smooth animations
- ⚡ **Real-Time Editing**: Live slide editing with instant preview updates
- 🔄 **Slide Navigation**: Easy navigation between slides with preview mode
- 💾 **Local Storage**: Automatic saving of chat history and presentations

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: CSS-in-JS with responsive design
- **AI Integration**: Google Gemini 2.0 Flash (gemini-2.0-flash-exp)
- **PowerPoint Generation**: pptxgenjs
- **State Management**: React Hooks (useState, useEffect)
- **File Handling**: Local file upload and URL processing
- **Storage**: Local storage for chat history and presentations

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

2. **Edit Individual Slides**
   - Click the "Edit" button on any slide in the preview
   - Use natural language to modify specific slides
   - Preview changes before accepting or rejecting them
   - Example: "Make this slide more professional" or "Add bullet points"

3. **Download Presentations**
   - Click the "Download" button to save as PPTX file
   - Files are generated using pptxgenjs for professional formatting

4. **View Chat History**
   - Access the "History" tab to see past conversations
   - Click on any history item to reload that conversation
   - All presentations are saved locally

### Slide Editing Features
- **Live Preview**: See slide changes in real-time
- **Accept/Reject**: Choose to keep or discard slide modifications
- **Responsive Design**: Preview works on all device sizes
- **Navigation**: Easy switching between slides during editing

## 🏗️ Project Structure

```
ai-chat-ppt/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ChatInterface.tsx          # Main chat interface with slide editing
│   │   ├── PowerPointPreview.tsx     # Presentation preview with navigation
│   │   ├── PowerPointPreview.css     # Responsive CSS for preview
│   │   ├── ChatHistory.tsx           # Chat history component
│   │   ├── FileUpload.tsx            # File upload component
│   │   └── StepByStepProgress.tsx   # Progress indicator
│   ├── services/           # API and utility services
│   │   ├── geminiService.ts          # Gemini AI integration
│   │   ├── pptService.ts             # PowerPoint generation
│   │   └── chatHistoryService.ts     # Local storage management
│   ├── types/              # TypeScript type definitions
│   │   ├── index.ts                  # Core types
│   │   └── templates.ts              # Template definitions
│   ├── App.tsx            # Main application component
│   ├── App.css            # Global styles
│   └── index.tsx          # Application entry point
├── backend/               # Backend server (optional)
│   ├── server.js         # Express server
│   └── package.json      # Backend dependencies
├── package.json           # Frontend dependencies and scripts
├── README.md              # Project documentation
├── .gitignore            # Git ignore patterns
└── env.example           # Environment variables template
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
- [x] Chat interface with AI-powered presentation generation
- [x] Gemini AI integration (gemini-2.0-flash-exp)
- [x] Real PowerPoint generation using pptxgenjs
- [x] Live preview of generated slides with responsive design
- [x] Individual slide editing with preview and accept/reject options
- [x] Download functionality for PPTX files
- [x] Chat history with conversation management
- [x] File upload support for documents and URLs

### ✅ Advanced Features Implemented
- [x] Responsive design for all device sizes (mobile, tablet, desktop)
- [x] Modern UI with black gradient theme
- [x] Slide navigation with preview mode
- [x] Local storage for chat history and presentations
- [x] Template support for different presentation types

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
   - Check that the API key is correctly copied without extra spaces

2. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check Node.js version (requires v16+)
   - Clear node_modules and package-lock.json, then run `npm install` again

3. **Download Issues**
   - Ensure browser allows file downloads
   - Check that pptxgenjs is properly imported
   - Try downloading in a different browser

4. **Slide Editing Not Working**
   - Ensure you're clicking the "Edit" button on individual slides
   - Check that the chat interface is properly loaded
   - Refresh the page if slide editing becomes unresponsive

5. **Responsive Design Issues**
   - Clear browser cache and reload the page
   - Check that CSS files are properly loaded
   - Test on different screen sizes

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
- [ ] Advanced slide templates with custom themes
- [ ] Multi-language support
- [ ] Cloud storage integration (Google Drive, Dropbox)
- [ ] Slide animations and transitions
- [ ] Voice-to-text input for slide creation
- [ ] Advanced AI prompts for different presentation styles
- [ ] Export to different formats (PDF, images)
- [ ] Presentation sharing and collaboration
- [ ] Advanced slide layouts and formatting options

---

**Built with ❤️ using React, TypeScript, and Google Gemini AI**