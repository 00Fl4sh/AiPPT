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
        minHeight: 'clamp(400px, 50vh, 600px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(16px, 4vw, 24px)'
      }}>
        {/* Slide Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(8px, 2vw, 16px)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(4px, 1vw, 6px)',
              padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
              background: currentSlide === 0 ? '#f3f4f6' : '#1f2937',
              color: currentSlide === 0 ? '#9ca3af' : '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              fontWeight: '500',
              cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: currentSlide === 0 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (currentSlide !== 0) {
                const target = e.target as HTMLButtonElement;
                target.style.background = '#374151';
                target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentSlide !== 0) {
                const target = e.target as HTMLButtonElement;
                target.style.background = '#1f2937';
                target.style.transform = 'translateY(0)';
              }
            }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(4px, 1vw, 8px)',
            background: '#ffffff',
            padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
            borderRadius: '20px',
            border: '1px solid #e5e7eb',
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            fontWeight: '500',
            color: '#374151'
          }}>
            <span>{currentSlide + 1}</span>
            <span style={{ color: '#9ca3af' }}>/</span>
            <span>{presentation.slides.length}</span>
          </div>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide === presentation.slides.length - 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(4px, 1vw, 6px)',
              padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
              background: currentSlide === presentation.slides.length - 1 ? '#f3f4f6' : '#1f2937',
              color: currentSlide === presentation.slides.length - 1 ? '#9ca3af' : '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              fontWeight: '500',
              cursor: currentSlide === presentation.slides.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: currentSlide === presentation.slides.length - 1 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (currentSlide !== presentation.slides.length - 1) {
                const target = e.target as HTMLButtonElement;
                target.style.background = '#374151';
                target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentSlide !== presentation.slides.length - 1) {
                const target = e.target as HTMLButtonElement;
                target.style.background = '#1f2937';
                target.style.transform = 'translateY(0)';
              }
            }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Slide Preview */}
        {isPreviewMode && (
          <div className="slide-container" style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            minHeight: 'clamp(300px, 40vh, 500px)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div className="slide-content" style={{
              padding: 'clamp(20px, 5vw, 40px)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              background: template.colors.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: template.colors.text || '#ffffff',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Slide Background Pattern */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                animation: 'float 6s ease-in-out infinite'
              }} />
              
              {/* Slide Content */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '800px'
              }}>
                {presentation.slides[currentSlide]?.type === 'title' ? (
                  <div>
                    <h1 className="slide-title" style={{
                      fontSize: 'clamp(24px, 6vw, 48px)',
                      fontWeight: '700',
                      marginBottom: 'clamp(16px, 4vw, 24px)',
                      textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                      lineHeight: '1.2'
                    }}>
                      {presentation.slides[currentSlide].title}
                    </h1>
                    <div className="slide-text" style={{
                      fontSize: 'clamp(16px, 4vw, 24px)',
                      lineHeight: '1.6',
                      opacity: '0.9',
                      maxWidth: '80%',
                      margin: '0 auto'
                    }}>
                      {presentation.slides[currentSlide].content}
                    </div>
                  </div>
                ) : presentation.slides[currentSlide]?.type === 'bullet' ? (
                  <div>
                    <h2 className="slide-title" style={{
                      fontSize: 'clamp(20px, 5vw, 32px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(16px, 4vw, 24px)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      {presentation.slides[currentSlide].title}
                    </h2>
                    <div className="slide-text" style={{
                      fontSize: 'clamp(14px, 3vw, 18px)',
                      lineHeight: '1.8',
                      textAlign: 'left',
                      maxWidth: '90%',
                      margin: '0 auto'
                    }}>
                      {presentation.slides[currentSlide].content.split('\n').map((line, idx) => (
                        <div key={idx} style={{ marginBottom: 'clamp(8px, 2vw, 12px)' }}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : presentation.slides[currentSlide]?.type === 'image' ? (
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
                      width: '100%',
                      height: 'clamp(200px, 40vw, 400px)',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed rgba(255,255,255,0.3)',
                      margin: '0 auto',
                      maxWidth: '80%'
                    }}>
                      <div style={{
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: 'clamp(14px, 3vw, 16px)'
                      }}>
                        📸 {presentation.slides[currentSlide].content}
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
                  <div>
                    <h2 className="slide-title" style={{
                      fontSize: 'clamp(20px, 5vw, 32px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(16px, 4vw, 24px)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      {presentation.slides[currentSlide].title}
                    </h2>
                    <div className="slide-text" style={{
                      fontSize: 'clamp(14px, 3vw, 16px)',
                      lineHeight: '1.8',
                      textAlign: 'left'
                    }}>
                      {presentation.slides[currentSlide].content}
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
          padding: 'clamp(8px, 2vw, 12px) 0',
          scrollbarWidth: 'thin'
        }}>
          {presentation.slides.map((slide, index) => (
            <button
              key={slide.id}
              id={`slide-${index}`}
              onClick={() => goToSlide(index)}
              style={{
                flex: '0 0 auto',
                width: 'clamp(80px, 15vw, 120px)',
                height: 'clamp(60px, 10vw, 90px)',
                background: index === currentSlide ? '#1f2937' : '#ffffff',
                border: `2px solid ${index === currentSlide ? '#1f2937' : '#e5e7eb'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(4px, 1vw, 8px)',
                overflow: 'hidden',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                if (index !== currentSlide) {
                  target.style.borderColor = '#9ca3af';
                  target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                if (index !== currentSlide) {
                  target.style.borderColor = '#e5e7eb';
                  target.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{
                fontSize: 'clamp(10px, 2vw, 12px)',
                fontWeight: '600',
                color: index === currentSlide ? '#ffffff' : '#374151',
                textAlign: 'center',
                lineHeight: '1.2',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {slide.title}
              </div>
              <div style={{
                position: 'absolute',
                bottom: '2px',
                right: '4px',
                fontSize: 'clamp(8px, 1.5vw, 10px)',
                color: index === currentSlide ? '#ffffff' : '#9ca3af',
                fontWeight: '500'
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