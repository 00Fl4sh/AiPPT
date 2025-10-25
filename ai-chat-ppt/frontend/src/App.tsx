import React, { useState, useEffect } from 'react';
import { Presentation, ChatHistory, Message } from './types';
import ChatInterface from './components/ChatInterface';
import PowerPointPreview from './components/PowerPointPreview';
import ChatHistoryComponent from './components/ChatHistory';
import { getChatHistory, deleteChatHistory } from './services/chatHistoryService';
import { generatePowerPoint, downloadPowerPoint } from './services/pptService';
import { FileText, MessageSquare, History } from 'lucide-react';
import './App.css';

function App() {
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | undefined>();
  const [activeTab, setActiveTab] = useState<'chat' | 'preview' | 'history'>('chat');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [preFilledMessage, setPreFilledMessage] = useState<string>('');
  const [selectedTemplate] = useState<string>('executive-premium');
  const [restoredMessages, setRestoredMessages] = useState<Message[]>([]);

  useEffect(() => {
    setChatHistory(getChatHistory());
    
    // Listen for custom event to switch to preview tab
    const handleSwitchToPreview = () => {
      setActiveTab('preview');
    };
    
    window.addEventListener('switchToPreview', handleSwitchToPreview);
    
    return () => {
      window.removeEventListener('switchToPreview', handleSwitchToPreview);
    };
  }, []);

  const handlePresentationGenerated = (presentation: Presentation) => {
    setCurrentPresentation(presentation);
    setActiveTab('preview');
    // Refresh chat history to show the new chat
    setChatHistory(getChatHistory());
  };

  const handleLoadChat = (chat: ChatHistory) => {
    setCurrentPresentation(chat.presentation);
    setActiveTab('chat');
    // Restore the chat messages by passing them to ChatInterface
    setRestoredMessages(chat.messages);
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChatHistory(chatId);
    setChatHistory(getChatHistory());
  };

  const handleDownload = async () => {
    if (!currentPresentation) return;
    
    try {
      const blob = await generatePowerPoint(currentPresentation);
      downloadPowerPoint(blob, `${currentPresentation.title}.pptx`);
    } catch (error) {
      console.error('Error downloading PowerPoint:', error);
    }
  };

  const handleEditSlide = (slideIndex: number, slide: any) => {
    // Switch to chat tab and trigger edit mode
    setActiveTab('chat');
    
    // Create a pre-filled edit prompt
    const editPrompt = `Edit slide ${slideIndex + 1}: "${slide.title}" - Please improve this slide content`;
    
    // Pre-fill the input with edit context
    setPreFilledMessage(editPrompt);
    
    // Trigger the edit mode in ChatInterface by dispatching a custom event
    window.dispatchEvent(new CustomEvent('startSlideEdit', { 
      detail: { slideIndex, slide } 
    }));
  };

  return (
    <div style={{
      height: 'calc(100vh - 100px)',
      background: '#ffffff',
      position: 'relative'
    }}>
      
      {/* Clean Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '60px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                background: '#3b82f6',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: 0
                }}>AI Chat PPT</h1>
                <p style={{
                  fontSize: '0.7rem',
                  color: '#6b7280',
                  margin: 0
                }}>Professional Presentations in seconds with AI</p>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '0.25rem',
              background: '#f3f4f6',
              borderRadius: '12px',
              padding: '0.25rem'
            }}>
              <button
                onClick={() => setActiveTab('chat')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: activeTab === 'chat' ? '#ffffff' : 'transparent',
                  color: activeTab === 'chat' ? '#1f2937' : '#6b7280',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  boxShadow: activeTab === 'chat' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <MessageSquare style={{ width: '18px', height: '18px' }} />
                Chat
              </button>
              {currentPresentation && (
                <button
                  onClick={() => setActiveTab('preview')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: activeTab === 'preview' ? '#ffffff' : 'transparent',
                    color: activeTab === 'preview' ? '#1f2937' : '#6b7280',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    boxShadow: activeTab === 'preview' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  <FileText style={{ width: '18px', height: '18px' }} />
                  Preview
                </button>
              )}
              <button
                onClick={() => setActiveTab('history')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: activeTab === 'history' ? '#ffffff' : 'transparent',
                  color: activeTab === 'history' ? '#1f2937' : '#6b7280',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  boxShadow: activeTab === 'history' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <History style={{ width: '18px', height: '18px' }} />
                History
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Premium Main Content */}
      <main style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '1rem',
        position: 'relative',
        zIndex: 5
      }}>
        {activeTab === 'history' ? (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1.5rem'
              }}>Chat History</h2>
              <ChatHistoryComponent
                history={chatHistory}
                onLoadChat={handleLoadChat}
                onDeleteChat={handleDeleteChat}
              />
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: activeTab === 'chat' ? '1fr' : activeTab === 'preview' ? '1fr' : '1fr 1fr',
            gap: '2rem',
            height: 'calc(50vh - 100px)',
            minHeight: '600px'
          }}>
            {/* Chat Interface */}
            <div style={{
              display: activeTab === 'chat' ? 'block' : activeTab === 'preview' ? 'none' : 'block'
            }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                    <ChatInterface
                      onPresentationGenerated={handlePresentationGenerated}
                      currentPresentation={currentPresentation}
                      preFilledMessage={preFilledMessage}
                      onClearPreFilledMessage={() => setPreFilledMessage('')}
                      selectedTemplate={selectedTemplate}
                      restoredMessages={restoredMessages}
                      onClearRestoredMessages={() => setRestoredMessages([])}
                      onSlideEdit={handleEditSlide}
                    />
              </div>
            </div>

            {/* PowerPoint Preview */}
            <div style={{
              display: activeTab === 'preview' ? 'block' : activeTab === 'chat' ? 'none' : 'block'
            }}>
              {currentPresentation ? (
                <div>
                      <PowerPointPreview 
                        presentation={currentPresentation} 
                        onDownload={handleDownload}
                        onEditSlide={handleEditSlide}
                        selectedTemplate={selectedTemplate}
                      />
                </div>
              ) : (
                <div style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '3rem'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: '#f3f4f6',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <FileText style={{ width: '32px', height: '32px', color: '#6b7280' }} />
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem'
                  }}>No Presentation Yet</h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    lineHeight: '1.6'
                  }}>
                    Start a conversation to generate your first presentation.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
