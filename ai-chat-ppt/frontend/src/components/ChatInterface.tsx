import React, { useState, useRef, useEffect } from "react";
import { Send, Download, FileText, Upload, Link, Youtube } from "lucide-react";
import { Message, Presentation } from "../types";
import { generateSlides, editSlides } from "../services/geminiService";
import { generatePowerPoint, downloadPowerPoint } from "../services/pptService";
import { saveChatHistory } from "../services/chatHistoryService";
import StepByStepProgress from "./StepByStepProgress";
import FileUpload from "./FileUpload";

interface ChatInterfaceProps {
  onPresentationGenerated: (presentation: Presentation) => void;
  currentPresentation?: Presentation;
  preFilledMessage?: string;
  onClearPreFilledMessage?: () => void;
  selectedTemplate?: string;
  restoredMessages?: Message[];
  onClearRestoredMessages?: () => void;
  onSlideEdit?: (slideIndex: number, slide: any) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onPresentationGenerated,
  currentPresentation,
  preFilledMessage,
  onClearPreFilledMessage,
  selectedTemplate = "corporate-blue",
  restoredMessages = [],
  onClearRestoredMessages,
  onSlideEdit,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any>(null);
  const [editedSlide, setEditedSlide] = useState<any>(null);
  const [showEditPreview, setShowEditPreview] = useState(false);
  const [isProcessingEdit, setIsProcessingEdit] = useState(false);

  // Restore messages when restoredMessages prop changes
  useEffect(() => {
    if (restoredMessages && restoredMessages.length > 0) {
      setMessages(restoredMessages);
      // Clear the restored messages after loading them
      if (onClearRestoredMessages) {
        onClearRestoredMessages();
      }
    }
  }, [restoredMessages, onClearRestoredMessages]);
  const [stepProgress, setStepProgress] = useState<{
    currentStep: number;
    totalSteps: number;
    currentSlide?: { title: string; type: string };
    isComplete: boolean;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastEditTimeRef = useRef<number>(0);
  const [urlInput, setUrlInput] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "file" | "url">("text");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for slide edit events from App.tsx
  useEffect(() => {
    const handleStartSlideEdit = (event: CustomEvent) => {
      const { slideIndex, slide } = event.detail;
      const now = Date.now();
      
      // Debounce: prevent calls within 1 second of each other
      if (now - lastEditTimeRef.current < 1000) {
        console.log('Edit call too soon, ignoring duplicate');
        return;
      }
      
      // Prevent multiple rapid calls
      if (isProcessingEdit) {
        console.log('Edit already in progress, ignoring duplicate call');
        return;
      }
      
      lastEditTimeRef.current = now;
      setIsProcessingEdit(true);
      
      // Always clear existing state first
      setIsEditingMode(false);
      setEditingSlide(null);
      setEditedSlide(null);
      setShowEditPreview(false);
      
      // Small delay to ensure state is cleared before starting new edit
      setTimeout(() => {
        // Directly set edit mode without calling handleSlideEdit
        setIsEditingMode(true);
        setEditingSlide({ ...slide, index: slideIndex });
        setShowEditPreview(false);
        
        // Add a single comprehensive message
        const editMessage = `Editing slide ${slideIndex + 1}: "${slide.title}"

Here's the current slide content. What changes would you like to make?

📄 **Slide ${slideIndex + 1}: ${slide.title}**
📝 **Type:** ${slide.type}
📋 **Content:**
${slide.content}`;
        
        addMessage(editMessage, 'assistant');
        
        // Call the parent's onSlideEdit function if provided
        if (onSlideEdit) {
          onSlideEdit(slideIndex, slide);
        }
        
        setIsProcessingEdit(false);
      }, 50);
    };

    window.addEventListener('startSlideEdit', handleStartSlideEdit as EventListener);
    
    return () => {
      window.removeEventListener('startSlideEdit', handleStartSlideEdit as EventListener);
    };
  }, [isProcessingEdit, onSlideEdit]);

  // Pre-fill input when preFilledMessage is provided
  useEffect(() => {
    if (preFilledMessage) {
      setInputValue(preFilledMessage);
    }
  }, [preFilledMessage]);

  const addMessage = (content: string, role: "user" | "assistant") => {
    const message: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      role,
      timestamp: new Date(),
    };
    setMessages((prev) => {
      const updatedMessages = [...prev, message];
      return updatedMessages;
    });
  };

  const handleSlideEdit = (slideIndex: number, slide: any) => {
    // Prevent duplicate edit mode activation
    if (isEditingMode && editingSlide && editingSlide.index === slideIndex) {
      console.log('Already editing this slide, skipping duplicate call');
      return;
    }
    
    // Prevent multiple rapid calls
    if (isProcessingEdit) {
      console.log('Edit processing in progress, skipping duplicate call');
      return;
    }
    
    setIsProcessingEdit(true);
    
    // Clear any existing edit state first
    setIsEditingMode(false);
    setEditingSlide(null);
    setEditedSlide(null);
    setShowEditPreview(false);
    
    // Small delay to ensure state is cleared
    setTimeout(() => {
      setIsEditingMode(true);
      setEditingSlide({ ...slide, index: slideIndex });
      setShowEditPreview(false);
      
      // Add a single comprehensive message instead of multiple messages
      const editMessage = `Editing slide ${slideIndex + 1}: "${slide.title}"

Here's the current slide content. What changes would you like to make?

📄 **Slide ${slideIndex + 1}: ${slide.title}**
📝 **Type:** ${slide.type}
📋 **Content:**
${slide.content}`;
      
      addMessage(editMessage, 'assistant');
      
      // Call the parent's onSlideEdit function if provided
      if (onSlideEdit) {
        onSlideEdit(slideIndex, slide);
      }
      
      setIsProcessingEdit(false);
    }, 100);
  };

  const handleEditSubmit = async () => {
    if (!editingSlide || !inputValue.trim()) return;
    
    setIsLoading(true);
    try {
      // Create a single slide presentation for editing
      const singleSlidePresentation = {
        id: 'edit-slide',
        title: 'Slide Edit',
        slides: [editingSlide],
        createdAt: new Date()
      };

      const response = await editSlides(
        singleSlidePresentation.slides,
        inputValue,
        (slide, index, total) => {
          setStepProgress({
            currentStep: index,
            totalSteps: total,
            currentSlide: { title: slide.title, type: slide.type },
            isComplete: index === total,
          });
        },
        selectedTemplate
      );

      setEditedSlide(response.slides[0]);
      setShowEditPreview(true);
      
      addMessage(inputValue, 'user');
      
      // Add a message with accept/reject buttons
      const editResultMessage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: `I've edited the slide. Here's the updated version:`,
        role: 'assistant' as const,
        timestamp: new Date(),
        isEditResult: true,
        editedSlide: response.slides[0],
        originalSlide: { ...editingSlide, index: editingSlide.index }
      };
      
      setMessages(prev => [...prev, editResultMessage]);
      
    } catch (error) {
      console.error('Error editing slide:', error);
      addMessage('Sorry, I had trouble editing that slide. Please try again.', 'assistant');
    } finally {
      setIsLoading(false);
      setStepProgress(null);
    }
  };

  const handleAcceptEdit = () => {
    if (!editedSlide || !currentPresentation) return;
    
    // Update the slide in the current presentation
    const updatedSlides = [...currentPresentation.slides];
    updatedSlides[editingSlide.index] = editedSlide;
    
    const updatedPresentation = {
      ...currentPresentation,
      slides: updatedSlides
    };
    
    onPresentationGenerated(updatedPresentation);
    
    // Reset editing state
    setIsEditingMode(false);
    setEditingSlide(null);
    setEditedSlide(null);
    setShowEditPreview(false);
    
    addMessage('Slide updated successfully!', 'assistant');
  };

  const handleRejectEdit = () => {
    setIsEditingMode(false);
    setEditingSlide(null);
    setEditedSlide(null);
    setShowEditPreview(false);
    
    addMessage('❌ Edit rejected. The slide remains unchanged.', 'assistant');
  };

  const saveCurrentChatHistory = (presentation: Presentation) => {
    // Use a longer timeout to ensure all messages are added
    setTimeout(() => {
      setMessages(currentMessages => {
        if (currentMessages.length > 0) {
          saveChatHistory(currentMessages, presentation);
        }
        return currentMessages;
      });
    }, 500);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setInputMode("file");
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setInputMode("text");
  };

  const handleUrlSubmit = async (url: string) => {
    if (!url.trim()) return;

    setUrlInput("");
    addMessage(`Process URL: ${url}`, "user");
    setIsLoading(true);

    try {
      // Process URL content
      const response = await fetch("http://localhost:5000/api/process-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        addMessage(
          `URL processed successfully. Content: ${data.content}`,
          "assistant"
        );

        // Generate presentation from URL content
        const prompt = `Create a presentation based on this URL content: ${data.content}`;
        await generatePresentationFromPrompt(prompt);
      } else {
        throw new Error("Failed to process URL");
      }
    } catch (error) {
      console.error("Error processing URL:", error);
      addMessage(
        "Sorry, I encountered an error processing the URL. Please try again.",
        "assistant"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generatePresentationFromPrompt = async (prompt: string) => {
    const userMessage = prompt;
    
    // If this is a new presentation (not editing), clear the current chat
    if (!currentPresentation) {
      setMessages([]);
    }

    try {
      let response;

      setStepProgress({
        currentStep: 0,
        totalSteps: currentPresentation ? 1 : 4,
        isComplete: false,
      });

      if (currentPresentation) {
        response = await editSlides(
          currentPresentation.slides,
          prompt,
          (slide, index, total) => {
            setStepProgress({
              currentStep: index,
              totalSteps: total,
              currentSlide: { title: slide.title, type: slide.type },
              isComplete: index === total,
            });
          },
          selectedTemplate
        );
      } else {
        response = await generateSlides(prompt, (slide, index, total) => {
          setStepProgress({
            currentStep: index,
            totalSteps: total,
            currentSlide: { title: slide.title, type: slide.type },
            isComplete: index === total,
          });
        }, selectedTemplate);
      }

        const presentation: Presentation = {
          id: Date.now().toString(),
          title: response.title,
          slides: response.slides,
          createdAt: new Date(),
        };

      onPresentationGenerated(presentation);
      
      // More human-like success messages
      const successMessages = [
        "Perfect! I've created your presentation with engaging slides. You can now preview it and download it whenever you're ready!",
        "Great! Your presentation is ready with professional slides. Take a look at the preview and let me know if you'd like any changes!",
        "Excellent! I've crafted your presentation with well-structured slides. You can view it in the preview and download it as needed!",
        "Wonderful! Your presentation is complete with informative slides. Check out the preview and feel free to ask for any modifications!"
      ];
      const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
      addMessage(randomMessage, "assistant");
      
      // Save chat history after adding the assistant message
      saveCurrentChatHistory(presentation);
    } catch (error) {
        console.error("Error generating presentation:", error);
        
        // Handle different types of errors with specific responses
        if (error instanceof Error) {
          if (error.message.includes('CLARIFICATION_NEEDED')) {
            addMessage(error.message.replace('CLARIFICATION_NEEDED: ', ''), 'assistant');
          } else if (error.message.includes('QUESTION_DETECTED')) {
            addMessage(error.message.replace('QUESTION_DETECTED: ', ''), 'assistant');
          } else if (error.message.includes('CONVERSATION_DETECTED')) {
            addMessage(error.message.replace('CONVERSATION_DETECTED: ', ''), 'assistant');
          } else if (error.message.includes('GEMINI_OVERLOADED')) {
            addMessage(
              "🚀 The AI service is temporarily busy with lots of requests! This usually means it's very popular. Please wait about 30 seconds and try again - I'll be ready for you!",
              "assistant"
            );
          } else if (error.message.includes('GEMINI_QUOTA')) {
            addMessage(
              "📊 I've reached my usage limit for today. Don't worry - this resets daily! Please try again tomorrow, or contact support if you need immediate access.",
              "assistant"
            );
          } else if (error.message.includes('GEMINI_AUTH')) {
            addMessage(
              "🔑 There's an issue with the API configuration. Please check that your API key is set up correctly in the environment variables.",
              "assistant"
            );
          } else if (error.message.includes('GEMINI_NETWORK')) {
            addMessage(
              "🌐 I'm having trouble connecting to the AI service. Please check your internet connection and try again in a moment!",
              "assistant"
            );
          } else {
            addMessage(
              (() => {
                const errorMessages = [
                  "Oops! I ran into a small issue while creating your presentation. Let me try that again for you!",
                  "I apologize, but I had a little trouble with that request. Could you try rephrasing it? I'm here to help!",
                  "I'm sorry, but I couldn't process that request properly. Let me know what you'd like to create and I'll do my best!",
                  "I had a small hiccup there. Could you give me another try? I'm ready to help you create something great!"
                ];
                return errorMessages[Math.floor(Math.random() * errorMessages.length)];
              })(),
              "assistant"
            );
          }
        } else {
          const errorMessages = [
            "Oops! I ran into a small issue while creating your presentation. Let me try that again for you!",
            "I apologize, but I had a little trouble with that request. Could you try rephrasing it? I'm here to help!",
            "I'm sorry, but I couldn't process that request properly. Let me know what you'd like to create and I'll do my best!",
            "I had a small hiccup there. Could you give me another try? I'm ready to help you create something great!"
          ];
          const randomErrorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
          addMessage(randomErrorMessage, "assistant");
        }
    } finally {
      setIsLoading(false);
        setStepProgress(null);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear pre-filled message after submission
    if (onClearPreFilledMessage) {
      onClearPreFilledMessage();
    }

    // Handle editing mode
    if (isEditingMode) {
      await handleEditSubmit();
      return;
    }

    if (inputMode === "file" && selectedFile) {
      // Handle file upload
      const formData = new FormData();
      formData.append("file", selectedFile);

      addMessage(`Upload file: ${selectedFile.name}`, "user");
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:5000/api/upload-file", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          addMessage(
            `File processed successfully: ${data.filename}`,
            "assistant"
          );

          // Generate presentation from file content
          const prompt = `Create a presentation based on this file content: ${data.filename}`;
          await generatePresentationFromPrompt(prompt);
        } else {
          throw new Error("Failed to process file");
        }
      } catch (error) {
        console.error("Error processing file:", error);
        addMessage(
          "Sorry, I encountered an error processing the file. Please try again.",
          "assistant"
        );
        setIsLoading(false);
      }
      return;
    }

    if (inputMode === "url" && urlInput.trim()) {
      await handleUrlSubmit(urlInput.trim());
      return;
    }

    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    addMessage(userMessage, "user");
    setIsLoading(true);

      try {
        await generatePresentationFromPrompt(userMessage);
      } catch (error) {
        console.error("Error generating presentation:", error);
        
        // Handle different types of errors with specific responses
        if (error instanceof Error) {
          if (error.message.includes('CLARIFICATION_NEEDED')) {
            addMessage(error.message.replace('CLARIFICATION_NEEDED: ', ''), 'assistant');
          } else if (error.message.includes('QUESTION_DETECTED')) {
            addMessage(error.message.replace('QUESTION_DETECTED: ', ''), 'assistant');
          } else if (error.message.includes('CONVERSATION_DETECTED')) {
            addMessage(error.message.replace('CONVERSATION_DETECTED: ', ''), 'assistant');
          } else if (error.message.includes('GEMINI_OVERLOADED')) {
            addMessage(
              "🚀 The AI service is temporarily busy with lots of requests! This usually means it's very popular. Please wait about 30 seconds and try again - I'll be ready for you!",
              "assistant"
            );
          } else if (error.message.includes('GEMINI_QUOTA')) {
            addMessage(
              "📊 I've reached my usage limit for today. Don't worry - this resets daily! Please try again tomorrow, or contact support if you need immediate access.",
              "assistant"
            );
          } else if (error.message.includes('GEMINI_AUTH')) {
            addMessage(
              "🔑 There's an issue with the API configuration. Please check that your API key is set up correctly in the environment variables.",
              "assistant"
            );
          } else if (error.message.includes('GEMINI_NETWORK')) {
            addMessage(
              "🌐 I'm having trouble connecting to the AI service. Please check your internet connection and try again in a moment!",
              "assistant"
            );
          } else {
            addMessage(
              (() => {
                const errorMessages = [
                  "Oops! I ran into a small issue while creating your presentation. Let me try that again for you!",
                  "I apologize, but I had a little trouble with that request. Could you try rephrasing it? I'm here to help!",
                  "I'm sorry, but I couldn't process that request properly. Let me know what you'd like to create and I'll do my best!",
                  "I had a small hiccup there. Could you give me another try? I'm ready to help you create something great!"
                ];
                return errorMessages[Math.floor(Math.random() * errorMessages.length)];
              })(),
              "assistant"
            );
          }
        } else {
          const errorMessages = [
            "Oops! I ran into a small issue while creating your presentation. Let me try that again for you!",
            "I apologize, but I had a little trouble with that request. Could you try rephrasing it? I'm here to help!",
            "I'm sorry, but I couldn't process that request properly. Let me know what you'd like to create and I'll do my best!",
            "I had a small hiccup there. Could you give me another try? I'm ready to help you create something great!"
          ];
          const randomErrorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
          addMessage(randomErrorMessage, "assistant");
        }
        setIsLoading(false);
        setStepProgress(null);
      }
  };

  const handleDownload = async () => {
    if (!currentPresentation) return;

    try {
      setIsLoading(true);
      const blob = await generatePowerPoint(currentPresentation);
      downloadPowerPoint(blob, `${currentPresentation.title}.html`);
    } catch (error) {
      console.error("Error generating PowerPoint:", error);

        // More human-like error messages for download
        const downloadErrorMessages = [
          "I'm having a little trouble preparing your download. Let me try that again!",
          "Oops! I ran into an issue while creating your file. Could you try again?",
          "I apologize, but I couldn't prepare your download properly. Let me give it another shot!",
          "I had a small hiccup with the download. Could you try again? I'm here to help!"
        ];
        const randomDownloadError = downloadErrorMessages[Math.floor(Math.random() * downloadErrorMessages.length)];
        addMessage(randomDownloadError, "assistant");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "600px",
        maxHeight: "600px",
        overflow: "hidden",
        background: "transparent",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    >
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          background: "transparent",
          scrollBehavior: "smooth",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.8)",
              marginTop: "1rem",
              padding: "1rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#f3f4f6",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}
            >
              <FileText
                style={{ width: "24px", height: "24px", color: "#6b7280" }}
              />
            </div>
             <p
               style={{
                 fontSize: "2rem",
                 fontWeight: "800",
                 color: "#1f2937",
                 marginBottom: "0.5rem",
               }}
             >
               Welcome to AI Chat PPT!
             </p>
             <p
               style={{
                 fontSize: "0.8rem",
                 fontWeight: "500",
                 color: "#6b7280",
                 marginBottom: "1rem",
               }}
             >
               I'm your intelligent presentation assistant. I can help you create, edit, and improve your PowerPoint presentations.
             </p>
             <div
               style={{
                 display: "flex",
                 flexDirection: "column",
                 gap: "0.5rem",
                 textAlign: "left",
                 maxWidth: "400px",
                 margin: "0 auto",
               }}
             >
               <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0" }}>
                 <strong>Try these examples:</strong>
               </p>
               <div style={{ fontSize: "0.7rem", color: "#9ca3af", lineHeight: "1.4" }}>
                 • "Create a presentation about AI in healthcare for medical professionals"
                 <br />
                 • "Make a business proposal for a new product launch"
                 <br />
                 • "Generate slides about climate change solutions"
                 <br />
                 • "Add a slide about market analysis to my presentation"
            </div>
          </div>
            </div>
          )}
          
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: "flex",
                justifyContent:
                  message.role === "user" ? "flex-end" : "flex-start",
                animation: "slideIn 0.3s ease-out",
              }}
            >
        <div
          style={{
            maxWidth: "75%",
            padding: "0.5rem 0.75rem",
            borderRadius:
              message.role === "user"
                ? "12px 12px 4px 12px"
                : "12px 12px 12px 4px",
            background: message.role === "user" ? "#1f2937" : "#f8fafc",
            color: message.role === "user" ? "white" : "#1f2937",
            fontSize: "0.8rem",
            lineHeight: "1.4",
            wordWrap: "break-word",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          {message.role === "assistant" && (
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "#1f2937",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "2px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7.5C15 8.3 14.3 9 13.5 9H10.5C9.7 9 9 8.3 9 7.5V5.5L3 7V9L9 7.5V9.5C9 10.3 9.7 11 10.5 11H13.5C14.3 11 15 10.3 15 9.5V7.5L21 9ZM6 12C6 13.1 6.9 14 8 14S10 13.1 10 12 9.1 10 8 10 6 10.9 6 12ZM16 12C16 13.1 16.9 14 18 14S20 13.1 20 12 19.1 10 18 10 16 10.9 16 12ZM8 16H16C17.1 16 18 16.9 18 18V20C18 21.1 17.1 22 16 22H8C6.9 22 6 21.1 6 20V18C6 16.9 6.9 16 8 16Z"
                  fill="white"
                />
              </svg>
            </div>
          )}
          <div style={{ flex: 1 }}>
            {message.content}
            
            {/* Show accept/reject buttons for edit result messages */}
            {message.isEditResult && message.editedSlide && (
                  <div style={{
                    marginTop: '8px',
                    padding: '10px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '2px solid #1f2937',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(31, 41, 55, 0.15)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Header with black gradient */}
                    <div style={{
                      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                      color: 'white',
                      padding: '6px 10px',
                      margin: '-10px -10px 10px -10px',
                      borderRadius: '6px 6px 0 0',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '8px'
                      }}>
                        📄
                      </div>
                      {message.editedSlide.title}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#475569',
                      marginBottom: '10px',
                      lineHeight: '1.4',
                      maxHeight: '80px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      background: '#f8fafc',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #e2e8f0'
                    }}>
                      {message.editedSlide.content}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '6px',
                      justifyContent: 'flex-end',
                      background: 'linear-gradient(135deg,rgb(221, 229, 239) 0%,rgb(0, 0, 0) 100%)',
                      padding: '8px',
                      margin: '10px -10px -10px -10px',
                      borderRadius: '0 0 6px 6px'
                    }}>
                  <button
                        onClick={() => {
                          // Reject edit
                          setEditedSlide(null);
                          setShowEditPreview(false);
                          addMessage('❌ Edit rejected. The slide remains unchanged.', 'assistant');
                        }}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                          const target = e.target as HTMLButtonElement;
                          target.style.background = 'rgba(255, 255, 255, 0.3)';
                          target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          const target = e.target as HTMLButtonElement;
                          target.style.background = 'rgba(255, 255, 255, 0.2)';
                          target.style.transform = 'translateY(0)';
                        }}
                      >
                        Reject
                  </button>
                  <button
                        onClick={() => {
                          // Accept edit
                          if (message.editedSlide && currentPresentation && message.originalSlide) {
                            const updatedSlides = [...currentPresentation.slides];
                            const slideIndex = message.originalSlide.index || 0;
                            updatedSlides[slideIndex] = message.editedSlide;
                            
                            const updatedPresentation = {
                              ...currentPresentation,
                              slides: updatedSlides
                            };
                            
                            onPresentationGenerated(updatedPresentation);
                            
                            // Reset editing state
                            setIsEditingMode(false);
                            setEditingSlide(null);
                            setEditedSlide(null);
                            setShowEditPreview(false);
                            
                            addMessage('Slide updated successfully!', 'assistant');
                          }
                        }}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                          const target = e.target as HTMLButtonElement;
                          target.style.background = 'rgba(255, 255, 255, 0.3)';
                          target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          const target = e.target as HTMLButtonElement;
                          target.style.background = 'rgba(255, 255, 255, 0.2)';
                          target.style.transform = 'translateY(0)';
                        }}
                      >
                        Accept
                  </button>
            </div>
            </div>
          )}
          </div>
        </div>
      </div>
    ))}
          
          {/* Scroll target for auto-scroll */}
          <div ref={messagesEndRef} />

          {/* Step-by-step progress */}
          {stepProgress && (
            <StepByStepProgress
              currentStep={stepProgress.currentStep}
              totalSteps={stepProgress.totalSteps}
              currentSlide={stepProgress.currentSlide}
              isComplete={stepProgress.isComplete}
            />
          )}

          {/* Slide Edit Preview - Shows the slide being edited */}
          {isEditingMode && editingSlide && (
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '2px solid #1f2937',
              borderRadius: '8px',
              padding: '12px',
              margin: '8px 0',
              boxShadow: '0 4px 16px rgba(31, 41, 55, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Header with black gradient background */}
              <div style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                color: 'white',
                padding: '8px 12px',
                margin: '-12px -12px 12px -12px',
                borderRadius: '6px 6px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px'
                  }}>
                    ✏️
                  </div>
                  Editing Slide
                </div>
              <button
                  onClick={() => {
                    setIsEditingMode(false);
                    setEditingSlide(null);
                    setEditedSlide(null);
                    setShowEditPreview(false);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = 'rgba(255, 255, 255, 0.3)';
                    target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = 'rgba(255, 255, 255, 0.2)';
                    target.style.transform = 'translateY(0)';
                  }}
                >
                  ✕ Cancel
              </button>
            </div>
              
              {/* Slide Preview Card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '10px',
                marginBottom: '10px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}>
                {/* Slide Type Badge */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#1f2937',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '8px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {editingSlide.type}
          </div>
                
                {/* Slide Title */}
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#1e293b',
                  lineHeight: '1.3',
                  marginRight: '60px'
                }}>
                  {editingSlide.title}
        </div>

                {/* Slide Content */}
                <div style={{
                  fontSize: '12px',
                  color: '#475569',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-wrap',
                  background: '#f8fafc',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #e2e8f0'
                }}>
                  {editingSlide.content}
                </div>
              </div>
              
              {/* Instructions and Actions */}
              <div style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                border: '1px solid #374151',
                borderRadius: '6px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(31, 41, 55, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8px',
                    color: 'white'
                  }}>
                    💡
                  </div>
                  Describe the changes you want to make
                </div>
                <div style={{
                  fontSize: '9px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontStyle: 'italic'
                }}>
                  Type your changes below
                </div>
              </div>
            </div>
          )}
          
          {/* Current Presentation Preview */}
          {currentPresentation && !showEditPreview && !isEditingMode && (
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              margin: '16px 0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#374151'
              }}>
                📊 Current Presentation: {currentPresentation.title}
              </h4>
              
              <div style={{
                background: '#f9fafb',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '8px'
                }}>
                  {currentPresentation.slides.length} slides • Created {new Date(currentPresentation.createdAt).toLocaleDateString()}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#4b5563',
                  lineHeight: '1.5'
                }}>
                  {currentPresentation.slides.slice(0, 3).map((slide, index) => (
                    <div key={index} style={{ marginBottom: '4px' }}>
                      <strong>{index + 1}.</strong> {slide.title}
                    </div>
                  ))}
                  {currentPresentation.slides.length > 3 && (
                    <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                      ... and {currentPresentation.slides.length - 3} more slides
                    </div>
                  )}
          </div>
        </div>

              <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => {
                    // Switch to preview tab
                    window.dispatchEvent(new CustomEvent('switchToPreview'));
                  }}
                  style={{
                    padding: '6px 12px',
                    background: '#1f2937',
                    color: 'white',
                    border: '1px solid #374151',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = '#374151';
                    target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = '#1f2937';
                    target.style.transform = 'translateY(0)';
                  }}
                >
                  View Full Preview
                </button>
              </div>
            </div>
          )}
          
          {/* Slide Edit Preview */}
          {showEditPreview && (editingSlide || editedSlide) && (
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              margin: '16px 0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#374151'
              }}>
                {editedSlide ? 'Edited Slide Preview' : 'Current Slide'}
              </h4>
              
              <div style={{
                background: '#f9fafb',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#1f2937'
                }}>
                  {(editedSlide || editingSlide).title}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#4b5563',
                  lineHeight: '1.5'
                }}>
                  {(editedSlide || editingSlide).content}
          </div>
        </div>

              {editedSlide && (
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={handleRejectEdit}
                    style={{
                      padding: '6px 12px',
                      background: '#1f2937',
                      color: 'white',
                      border: '1px solid #374151',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLButtonElement;
                      target.style.background = '#374151';
                      target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLButtonElement;
                      target.style.background = '#1f2937';
                      target.style.transform = 'translateY(0)';
                    }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleAcceptEdit}
                    style={{
                      padding: '6px 12px',
                      background: '#1f2937',
                      color: 'white',
                      border: '1px solid #374151',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLButtonElement;
                      target.style.background = '#374151';
                      target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLButtonElement;
                      target.style.background = '#1f2937';
                      target.style.transform = 'translateY(0)';
                    }}
                  >
                    Accept
                  </button>
            </div>
          )}
            </div>
          )}
            </div>
          
          <div ref={messagesEndRef} />
        </div>

      {/* Input Mode Selector */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          padding: "0.75rem",
          background: "#f9fafb",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.5rem 0.75rem",
            background: inputMode === "text" ? "#ffffff" : "transparent",
            color: inputMode === "text" ? "#1f2937" : "#6b7280",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "0.8rem",
            fontWeight: "500",
          }}
          onClick={() => setInputMode("text")}
        >
          <FileText style={{ width: "14px", height: "14px" }} />
          <span>Text</span>
        </button>
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.5rem 0.75rem",
            background: inputMode === "file" ? "#ffffff" : "transparent",
            color: inputMode === "file" ? "#1f2937" : "#6b7280",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "0.8rem",
            fontWeight: "500",
          }}
          onClick={() => setInputMode("file")}
        >
          <Upload style={{ width: "14px", height: "14px" }} />
          <span>File</span>
        </button>
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.5rem 0.75rem",
            background: inputMode === "url" ? "#ffffff" : "transparent",
            color: inputMode === "url" ? "#1f2937" : "#6b7280",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "0.8rem",
            fontWeight: "500",
          }}
          onClick={() => setInputMode("url")}
        >
          <Link style={{ width: "14px", height: "14px" }} />
          <span>URL</span>
        </button>
      </div>

      {/* File Upload */}
      {inputMode === "file" && (
        <FileUpload
          onFileSelect={handleFileSelect}
          onRemove={handleFileRemove}
          selectedFile={selectedFile}
          isLoading={isLoading}
        />
      )}

      {/* URL Input */}
      {inputMode === "url" && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            padding: "0.75rem",
            background: "#f8f9fa",
            borderTop: "1px solid #e9ecef",
          }}
        >
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter URL (e.g., https://example.com)"
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "0.8rem",
            }}
          />
          <button
            type="button"
            onClick={() => handleUrlSubmit(urlInput)}
            disabled={!urlInput.trim() || isLoading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.5rem 0.75rem",
              background: !urlInput.trim() || isLoading ? "#9ca3af" : "#1f2937",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: !urlInput.trim() || isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              fontSize: "0.8rem",
              fontWeight: "500",
            }}
          >
            <Youtube style={{ width: "14px", height: "14px" }} />
            <span>Process URL</span>
          </button>
        </div>
      )}

      {/* Input - Fixed at bottom */}
      <div
        style={{
          padding: "1rem",
          background: "#f9fafb",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "flex-end",
          }}
        >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              currentPresentation
                ? "Edit your presentation..."
                : "Describe your presentation..."
            }
              disabled={isLoading}
            style={{
              flex: 1,
              padding: "0.5rem 0.75rem",
              background: "#ffffff",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              color: "#1f2937",
              fontSize: "0.8rem",
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#d1d5db";
              e.target.style.boxShadow = "none";
            }}
            />
            <button
              type="submit"
            disabled={(!inputValue.trim() && inputMode === "text") || isLoading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.5rem 0.75rem",
              background:
                (!inputValue.trim() && inputMode === "text") || isLoading
                  ? "#f3f4f6"
                  : "#1f2937",
              color:
                (!inputValue.trim() && inputMode === "text") || isLoading
                  ? "#9ca3af"
                  : "white",
              border: (!inputValue.trim() && inputMode === "text") || isLoading
                ? "none"
                : "1px solid #374151",
              borderRadius: "6px",
              cursor:
                (!inputValue.trim() && inputMode === "text") || isLoading
                  ? "not-allowed"
                  : "pointer",
              transition: "all 0.2s ease",
              fontSize: "0.8rem",
              fontWeight: "500",
              boxShadow: (!inputValue.trim() && inputMode === "text") || isLoading
                ? "none"
                : "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) => {
              if (!((!inputValue.trim() && inputMode === "text") || isLoading)) {
                const target = e.target as HTMLButtonElement;
                target.style.background = '#374151';
                target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!((!inputValue.trim() && inputMode === "text") || isLoading)) {
                const target = e.target as HTMLButtonElement;
                target.style.background = '#1f2937';
                target.style.transform = 'translateY(0)';
              }
            }}
          >
            <Send style={{ width: "14px", height: "14px" }} />
            <span>Send</span>
            </button>
          {currentPresentation && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={isLoading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.5rem 0.75rem",
                background: isLoading ? "#f3f4f6" : "#1f2937",
                color: isLoading ? "#9ca3af" : "white",
                border: isLoading ? "none" : "1px solid #374151",
                borderRadius: "6px",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                fontSize: "0.8rem",
                fontWeight: "500",
                boxShadow: isLoading ? "none" : "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = '#374151';
                  target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = '#1f2937';
                  target.style.transform = 'translateY(0)';
                }
              }}
            >
              <Download style={{ width: "14px", height: "14px" }} />
              <span>Download PPTX</span>
            </button>
          )}
          </form>
      </div>

    </div>
  );
};

export default ChatInterface;
