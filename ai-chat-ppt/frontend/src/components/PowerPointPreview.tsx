import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Eye, EyeOff } from 'lucide-react';
import { Presentation, Slide } from '../types';
import { PRESENTATION_TEMPLATES } from '../types/templates';
import './PowerPointPreview.css';

interface PowerPointPreviewProps {
  presentation: Presentation;
  onDownload: () => void;
  onEditSlide?: (slideIndex: number, slide: Slide) => void;
  selectedTemplate?: string;
}

const PowerPointPreview: React.FC<PowerPointPreviewProps> = ({ presentation, onDownload, onEditSlide, selectedTemplate = 'executive-premium' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(true);

  // Get the selected template
  const template = PRESENTATION_TEMPLATES.find(t => t.id === selectedTemplate) || PRESENTATION_TEMPLATES[0];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % presentation.slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + presentation.slides.length) % presentation.slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    // Scroll to the selected slide
    const slideElement = document.getElementById(`slide-${index}`);
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="powerpoint-preview">
      {/* Header */}
      <div className="header" style={{
        background: '#ffffff',
        padding: 'clamp(12px, 3vw, 20px)',
        borderRadius: '12px 12px 0 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'clamp(8px, 2vw, 12px)'
      }}>
        <div className="header-title" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(8px, 2vw, 12px)',
          flex: 1,
          minWidth: '200px'
        }}>
          <h2 style={{
            fontSize: 'clamp(16px, 4vw, 24px)',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0,
            lineHeight: '1.2'
          }}>
            {presentation.title}
          </h2>
          <span style={{
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            color: '#6b7280',
            background: '#f3f4f6',
            padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)',
            borderRadius: '20px',
            fontWeight: '500'
          }}>
            {presentation.slides.length} slides
          </span>
        </div>
        
        <div className="header-buttons" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(8px, 2vw, 12px)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(4px, 1vw, 6px)',
              padding: 'clamp(6px, 1.5vw, 10px) clamp(12px, 3vw, 16px)',
              background: isPreviewMode ? '#1f2937' : '#f3f4f6',
              color: isPreviewMode ? '#ffffff' : '#374151',
              border: 'none',
              borderRadius: '8px',
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = isPreviewMode ? '#374151' : '#e5e7eb';
              target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = isPreviewMode ? '#1f2937' : '#f3f4f6';
              target.style.transform = 'translateY(0)';
            }}
          >
            {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
            {isPreviewMode ? 'Hide Preview' : 'Show Preview'}
          </button>
          
          <button
            onClick={onDownload}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(4px, 1vw, 6px)',
              padding: 'clamp(6px, 1.5vw, 10px) clamp(12px, 3vw, 16px)',
              background: '#1f2937',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
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
            <Download size={16} />
            Download PPT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        background: '#f8fafc',
        padding: 'clamp(16px, 4vw, 24px)',
        borderRadius: '0 0 12px 12px',
        minHeight: 'clamp(300px, 45vh, 500px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(12px, 3vw, 20px)',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>

        {/* Slide Preview */}
        {isPreviewMode && (
          <div className="slide-container" style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            border: '1px solid #333333',
            width: '100%',
            maxWidth: 'clamp(320px, 90vw, 900px)',
            aspectRatio: '16/9',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 'clamp(200px, 50vh, 500px)'
          }}>
            <div className="slide-content" style={{
              padding: 'clamp(16px, 4vw, 48px)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              background: template.colors.background || 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)',
              color: template.colors.text || '#ffffff',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 'clamp(200px, 40vh, 400px)',
              boxSizing: 'border-box',
              width: '100%'
            }}>
              {/* Slide Background Pattern */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                animation: 'float 6s ease-in-out infinite'
              }} />
              
              {/* Slide Content */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 'clamp(8px, 2vw, 16px)',
                boxSizing: 'border-box'
              }}>
                {presentation.slides[currentSlide]?.type === 'title' ? (
                  <div style={{ 
                    width: '100%', 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    <h1 className="slide-title" style={{
                      fontSize: 'clamp(24px, 6vw, 48px)',
                      fontWeight: '700',
                      marginBottom: 'clamp(16px, 4vw, 24px)',
                      textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                      lineHeight: '1.1',
                      wordWrap: 'break-word',
                      maxWidth: '95%',
                      color: template.colors.text || '#ffffff',
                      fontFamily: template.layout.titleFont || 'inherit'
                    }}>
                      {presentation.slides[currentSlide].title}
                    </h1>
                    {presentation.slides[currentSlide].content && (
                      <div className="slide-text" style={{
                        fontSize: 'clamp(16px, 4vw, 24px)',
                        lineHeight: '1.4',
                        opacity: '0.9',
                        maxWidth: '90%',
                        margin: '0 auto',
                        wordWrap: 'break-word',
                        color: template.colors.text || '#ffffff',
                        fontFamily: template.layout.contentFont || 'inherit',
                        fontWeight: '400'
                      }}>
                        {presentation.slides[currentSlide].content}
                      </div>
                    )}
                  </div>
                ) : presentation.slides[currentSlide]?.type === 'bullet' ? (
                  <div style={{ 
                    width: '100%', 
                    maxWidth: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <h2 className="slide-title" style={{
                      fontSize: 'clamp(20px, 5vw, 32px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(16px, 4vw, 24px)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      textAlign: 'center',
                      wordWrap: 'break-word',
                      color: template.colors.text || '#ffffff',
                      fontFamily: template.layout.titleFont || 'inherit',
                      maxWidth: '95%'
                    }}>
                      {presentation.slides[currentSlide].title}
                    </h2>
                    <div className="slide-text" style={{
                      fontSize: 'clamp(14px, 3vw, 18px)',
                      lineHeight: '1.6',
                      textAlign: 'left',
                      maxWidth: '95%',
                      margin: '0 auto',
                      wordWrap: 'break-word',
                      color: template.colors.text || '#ffffff',
                      fontFamily: template.layout.contentFont || 'inherit',
                      width: '100%'
                    }}>
                      {presentation.slides[currentSlide].content.split('\n').filter(line => line.trim()).map((line, idx) => (
                        <div key={idx} style={{ 
                          marginBottom: 'clamp(8px, 2vw, 12px)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 'clamp(8px, 2vw, 12px)',
                          padding: 'clamp(4px, 1vw, 8px) 0'
                        }}>
                          <span style={{
                            color: template.colors.accent || template.colors.secondary || '#ffffff',
                            fontSize: 'clamp(12px, 2.5vw, 16px)',
                            fontWeight: 'bold',
                            marginTop: '2px',
                            flexShrink: 0,
                            minWidth: 'clamp(12px, 2.5vw, 16px)'
                          }}>•</span>
                          <span style={{ 
                            flex: 1, 
                            wordWrap: 'break-word',
                            lineHeight: '1.5'
                          }}>{line.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : presentation.slides[currentSlide]?.type === 'image' ? (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    padding: 'clamp(8px, 2vw, 16px)',
                    boxSizing: 'border-box'
                  }}>
                    <h2 className="slide-title" style={{
                      fontSize: 'clamp(20px, 5vw, 36px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(16px, 4vw, 24px)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      textAlign: 'center',
                      fontFamily: template.layout.titleFont || 'inherit',
                      color: template.colors.text || '#ffffff',
                      maxWidth: '95%',
                      wordWrap: 'break-word'
                    }}>
                      {presentation.slides[currentSlide].title}
                    </h2>
                    <div style={{
                      width: '100%',
                      height: 'clamp(250px, 45vh, 400px)',
                      maxHeight: '65%',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid rgba(255,255,255,0.3)',
                      margin: '0 auto',
                      maxWidth: '95%',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundImage: `url(https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                    }}>
                      {/* Image overlay for better text visibility */}
                      <div style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                        padding: 'clamp(12px, 3vw, 20px)',
                        color: 'white',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: 'clamp(14px, 3vw, 18px)',
                          fontWeight: '500',
                          marginBottom: 'clamp(4px, 1vw, 8px)',
                          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                          lineHeight: '1.4',
                          wordWrap: 'break-word'
                        }}>
                          {presentation.slides[currentSlide].content}
                        </div>
                        <div style={{
                          fontSize: 'clamp(10px, 2vw, 12px)',
                          opacity: 0.8,
                          textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                        }}>
                          Professional image placeholder
                        </div>
                      </div>
                      
                      {/* Fallback content if image doesn't load */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.9)',
                        zIndex: 1,
                        display: 'none'
                      }}>
                        <div style={{
                          fontSize: '48px',
                          marginBottom: '16px',
                          opacity: 0.7
                        }}>
                          🖼️
                        </div>
                        <div style={{
                          fontSize: '18px',
                          fontWeight: '500'
                        }}>
                          {presentation.slides[currentSlide].content}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : presentation.slides[currentSlide]?.type === 'swot' ? (
                  <div>
                    <h2 className="slide-title" style={{
                      fontSize: 'clamp(20px, 5vw, 32px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(16px, 4vw, 24px)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      {presentation.slides[currentSlide].title}
                    </h2>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: 'clamp(12px, 3vw, 20px)',
                      marginTop: 'clamp(8px, 2vw, 16px)'
                    }}>
                      {presentation.slides[currentSlide].content.split('\n').map((line, idx) => (
                        <div key={idx} style={{
                          background: 'rgba(255,255,255,0.1)',
                          padding: 'clamp(12px, 3vw, 20px)',
                          borderRadius: '12px',
                          fontSize: 'clamp(12px, 2.5vw, 14px)',
                          lineHeight: '1.4',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : presentation.slides[currentSlide]?.type === 'timeline' ? (
                  <div>
                    <h2 className="slide-title" style={{
                      fontSize: 'clamp(20px, 5vw, 32px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(16px, 4vw, 24px)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      {presentation.slides[currentSlide].title}
                    </h2>
                    <div style={{
                      position: 'relative',
                      paddingLeft: 'clamp(20px, 4vw, 40px)'
                    }}>
                      {presentation.slides[currentSlide].content.split('\n').map((line, idx) => (
                        <div key={idx} style={{
                          position: 'relative',
                          marginBottom: 'clamp(12px, 3vw, 20px)',
                          paddingLeft: 'clamp(20px, 4vw, 30px)'
                        }}>
                          <div style={{
                            position: 'absolute',
                            left: '-clamp(8px, 2vw, 12px)',
                            top: 'clamp(4px, 1vw, 8px)',
                            width: 'clamp(12px, 3vw, 16px)',
                            height: 'clamp(12px, 3vw, 16px)',
                            background: '#ffffff',
                            borderRadius: '50%',
                            border: '3px solid #667eea'
                          }} />
                          <div style={{
                            position: 'absolute',
                            left: '-clamp(4px, 1vw, 6px)',
                            top: 'clamp(20px, 4vw, 28px)',
                            width: '2px',
                            height: 'clamp(20px, 4vw, 30px)',
                            background: 'rgba(255,255,255,0.3)'
                          }} />
                          <div style={{
                            fontSize: 'clamp(14px, 3vw, 16px)',
                            lineHeight: '1.6',
                            color: 'rgba(255,255,255,0.9)'
                          }}>
                            {line}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : presentation.slides[currentSlide]?.type === 'metrics' ? (
                  <div>
                    <h2 className="slide-title" style={{
                      fontSize: 'clamp(20px, 5vw, 32px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(16px, 4vw, 24px)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      {presentation.slides[currentSlide].title}
                    </h2>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: 'clamp(12px, 3vw, 20px)',
                      marginTop: 'clamp(8px, 2vw, 16px)'
                    }}>
                      {presentation.slides[currentSlide].content.split('\n').map((line, idx) => (
                        <div key={idx} style={{
                          background: 'rgba(255,255,255,0.15)',
                          padding: 'clamp(12px, 3vw, 20px)',
                          borderRadius: '12px',
                          textAlign: 'center',
                          border: '1px solid rgba(255,255,255,0.2)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{
                            fontSize: 'clamp(16px, 4vw, 20px)',
                            fontWeight: '700',
                            color: '#ffffff',
                            marginBottom: 'clamp(4px, 1vw, 8px)'
                          }}>
                            {line.split(':')[0]}
                          </div>
                          <div style={{
                            fontSize: 'clamp(12px, 2.5vw, 14px)',
                            color: 'rgba(255,255,255,0.8)'
                          }}>
                            {line.split(':')[1]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : presentation.slides[currentSlide]?.type === 'pros-cons' ? (
                  <div>
                    <h2 className="slide-title" style={{
                      fontSize: 'clamp(20px, 5vw, 32px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(16px, 4vw, 24px)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      {presentation.slides[currentSlide].title}
                    </h2>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 'clamp(16px, 4vw, 32px)',
                      marginTop: 'clamp(8px, 2vw, 16px)'
                    }}>
                      <div style={{
                        background: 'rgba(76, 175, 80, 0.2)',
                        padding: 'clamp(12px, 3vw, 20px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(76, 175, 80, 0.3)'
                      }}>
                        <h3 style={{
                          fontSize: 'clamp(16px, 3.5vw, 18px)',
                          fontWeight: '600',
                          marginBottom: 'clamp(8px, 2vw, 12px)',
                          color: '#4CAF50',
                          textAlign: 'center'
                        }}>
                          Pros
                        </h3>
                        <div style={{
                          fontSize: 'clamp(12px, 2.5vw, 14px)',
                          lineHeight: '1.6',
                          color: 'rgba(255,255,255,0.9)'
                        }}>
                          {presentation.slides[currentSlide].content.split('Cons:')[0].replace('Pros:', '').split('\n').filter(line => line.trim()).map((line, idx) => (
                            <div key={idx} style={{ marginBottom: 'clamp(4px, 1vw, 6px)' }}>
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{
                        background: 'rgba(244, 67, 54, 0.2)',
                        padding: 'clamp(12px, 3vw, 20px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(244, 67, 54, 0.3)'
                      }}>
                        <h3 style={{
                          fontSize: 'clamp(16px, 3.5vw, 18px)',
                          fontWeight: '600',
                          marginBottom: 'clamp(8px, 2vw, 12px)',
                          color: '#F44336',
                          textAlign: 'center'
                        }}>
                          Cons
                        </h3>
                        <div style={{
                          fontSize: 'clamp(12px, 2.5vw, 14px)',
                          lineHeight: '1.6',
                          color: 'rgba(255,255,255,0.9)'
                        }}>
                          {presentation.slides[currentSlide].content.split('Cons:')[1]?.split('\n').filter(line => line.trim()).map((line, idx) => (
                            <div key={idx} style={{ marginBottom: 'clamp(4px, 1vw, 6px)' }}>
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : presentation.slides[currentSlide]?.type === 'three-column' ? (
                  <div>
                    <h2 className="slide-title" style={{
                      fontSize: 'clamp(20px, 5vw, 32px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(16px, 4vw, 24px)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      {presentation.slides[currentSlide].title}
                    </h2>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 'clamp(12px, 3vw, 20px)',
                      marginTop: 'clamp(8px, 2vw, 16px)'
                    }}>
                      {presentation.slides[currentSlide].content.split('\n').map((line, idx) => (
                        <div key={idx} style={{
                          background: 'rgba(255,255,255,0.1)',
                          padding: 'clamp(12px, 3vw, 20px)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            fontSize: 'clamp(14px, 3vw, 16px)',
                            lineHeight: '1.6',
                            color: 'rgba(255,255,255,0.9)'
                          }}>
                            {line}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}>
                    <h2 className="slide-title" style={{
                      fontSize: 'clamp(20px, 5vw, 32px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(16px, 4vw, 24px)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      color: template.colors.text || '#ffffff',
                      fontFamily: template.layout.titleFont || 'inherit',
                      maxWidth: '95%',
                      wordWrap: 'break-word'
                    }}>
                      {presentation.slides[currentSlide].title}
                    </h2>
                    <div className="slide-text" style={{
                      fontSize: 'clamp(14px, 3vw, 18px)',
                      lineHeight: '1.6',
                      textAlign: 'left',
                      maxWidth: '95%',
                      margin: '0 auto',
                      color: template.colors.text || '#ffffff',
                      fontFamily: template.layout.contentFont || 'inherit',
                      wordWrap: 'break-word',
                      width: '100%'
                    }}>
                      {presentation.slides[currentSlide].content.split('\n').filter(line => line.trim()).map((line, idx) => (
                        <div key={idx} style={{ 
                          marginBottom: 'clamp(8px, 2vw, 12px)',
                          padding: 'clamp(4px, 1vw, 8px) 0',
                          lineHeight: '1.5'
                        }}>
                          {line.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Slide Number */}
              <div style={{
                position: 'absolute',
                bottom: 'clamp(8px, 2vw, 12px)',
                right: 'clamp(8px, 2vw, 12px)',
                background: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                padding: 'clamp(4px, 1vw, 8px) clamp(8px, 2vw, 12px)',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {currentSlide + 1} / {presentation.slides.length}
              </div>
            </div>
          </div>
        )}

        {/* Slide Thumbnails */}
        <div style={{
          display: 'flex',
          gap: 'clamp(8px, 2vw, 12px)',
          overflowX: 'auto',
          padding: 'clamp(8px, 2vw, 12px)',
          scrollbarWidth: 'thin',
          justifyContent: 'flex-start',
          width: '100%',
          maxWidth: '100%',
          alignItems: 'center'
        }}>
          {presentation.slides.map((slide, index) => (
            <button
              key={slide.id}
              id={`slide-${index}`}
              onClick={() => goToSlide(index)}
              style={{
                flex: '0 0 auto',
                width: 'clamp(70px, 12vw, 100px)',
                aspectRatio: '16/9',
                background: index === currentSlide ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)' : 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
                border: `2px solid ${index === currentSlide ? '#ffffff' : '#444444'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(3px, 0.8vw, 6px)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: index === currentSlide ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)',
                minWidth: '50px',
                maxWidth: '100px'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                if (index !== currentSlide) {
                  target.style.borderColor = '#ffffff';
                  target.style.transform = 'translateY(-2px)';
                  target.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)';
                }
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                if (index !== currentSlide) {
                  target.style.borderColor = '#444444';
                  target.style.transform = 'translateY(0)';
                  target.style.background = 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)';
                }
              }}
            >
              <div style={{
                fontSize: 'clamp(8px, 1.5vw, 10px)',
                fontWeight: '600',
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: '1.1',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                padding: '2px'
              }}>
                {slide.title}
              </div>
              <div style={{
                position: 'absolute',
                bottom: '1px',
                right: '2px',
                fontSize: 'clamp(7px, 1.2vw, 9px)',
                color: '#ffffff',
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(0,0,0,0.7)'
              }}>
                {index + 1}
              </div>
            </button>
          ))}
        </div>

        {/* Edit Button */}
        {onEditSlide && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 'clamp(8px, 2vw, 16px)'
          }}>
            <button
              onClick={() => onEditSlide(currentSlide, presentation.slides[currentSlide])}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(4px, 1vw, 6px)',
                padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
                background: '#1f2937',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
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
              ✏️ Edit Slide
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerPointPreview;