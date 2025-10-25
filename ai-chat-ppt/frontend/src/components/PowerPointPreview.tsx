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

  // const renderSlide = (slide: Slide, index: number) => {
  //   return (
      <div
        key={slide.id}
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          // padding: 'clamp(8px, 2vw, 16px)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          animation: 'slideIn 0.5s ease-out',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
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
        <div className="slide-content" style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'auto'
        }}>
          {slide.type === 'title' ? (
            <div style={{ textAlign: 'center' }}>
              <h1 className="slide-title" style={{
                fontSize: 'clamp(20px, 5vw, 32px)',
                fontWeight: '700',
                marginBottom: 'clamp(8px, 2vw, 16px)',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                animation: 'titleGlow 2s ease-in-out infinite alternate',
                lineHeight: '1.2'
              }}>
                {slide.title}
              </h1>
              {slide.content && (
                <p className="slide-text" style={{
                  fontSize: 'clamp(12px, 3vw, 16px)',
                  lineHeight: '1.4',
                  opacity: 0.9,
                  animation: 'fadeInUp 1s ease-out 0.5s both'
                }}>
                  {slide.content}
                </p>
              )}
            </div>
          ) : slide.type === 'bullet' ? (
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                marginBottom: '20px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {slide.title}
              </h2>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                fontSize: '16px',
                lineHeight: '1.6'
              }}>
                {slide.content.split('\n').filter(point => point.trim()).map((point, i) => (
                  <li key={i} style={{
                    marginBottom: '10px',
                    paddingLeft: '24px',
                    position: 'relative',
                    animation: `slideInLeft 0.6s ease-out ${i * 0.1}s both`
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      top: '2px',
                      fontSize: '14px',
                      animation: 'pulse 2s ease-in-out infinite'
                    }}>✨</span>
                    {point.trim()}
                  </li>
                ))}
              </ul>
            </div>
          ) : slide.type === 'swot' ? (
            <div>
              <h2 style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: '600',
                marginBottom: '30px',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {slide.title}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 'clamp(10px, 2vw, 20px)',
                marginTop: 'clamp(10px, 2vw, 20px)'
              }}>
                {['Strengths', 'Weaknesses', 'Opportunities', 'Threats'].map((section, i) => (
                  <div key={section} style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    animation: `fadeInScale 0.8s ease-out ${i * 0.1}s both`
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '10px',
                      color: section === 'Strengths' ? '#4ade80' : 
                             section === 'Weaknesses' ? '#f87171' :
                             section === 'Opportunities' ? '#fbbf24' : '#a78bfa'
                    }}>
                      {section}
                    </h3>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>
                      {slide.content.split('\n').filter(line => line.toLowerCase().includes(section.toLowerCase())).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : slide.type === 'timeline' ? (
            <div>
              <h2 style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: '600',
                marginBottom: '30px',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {slide.title}
              </h2>
              <div style={{
                position: 'relative',
                paddingLeft: '30px',
                borderLeft: '3px solid rgba(255,255,255,0.3)'
              }}>
                {slide.content.split('\n').filter(point => point.trim()).map((point, i) => (
                  <div key={i} style={{
                    marginBottom: '25px',
                    position: 'relative',
                    animation: `slideInLeft 0.7s ease-out ${i * 0.15}s both`
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '-39px',
                      top: '5px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: '#667eea',
                      border: '3px solid #ffffff',
                      boxShadow: '0 0 0 2px #667eea'
                    }} />
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '5px'
                    }}>
                      {point.split(':')[0]?.trim()}
                    </h3>
                    <p style={{
                      fontSize: '16px',
                      opacity: 0.9
                    }}>
                      {point.split(':').slice(1).join(':').trim()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : slide.type === 'pros-cons' ? (
            <div>
              <h2 style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: '600',
                marginBottom: '30px',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {slide.title}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 'clamp(15px, 3vw, 30px)',
                marginTop: 'clamp(10px, 2vw, 20px)'
              }}>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '15px',
                    color: '#4ade80'
                  }}>Pros</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {slide.content.split('\n').filter(line => line.toLowerCase().includes('pro') || line.startsWith('+')).map((pro, i) => (
                      <li key={i} style={{
                        marginBottom: '8px',
                        fontSize: '16px',
                        animation: `slideInLeft 0.6s ease-out ${i * 0.1}s both`
                      }}>
                        ✓ {pro.replace(/^[+\s]*/, '').trim()}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '15px',
                    color: '#f87171'
                  }}>Cons</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {slide.content.split('\n').filter(line => line.toLowerCase().includes('con') || line.startsWith('-')).map((con, i) => (
                      <li key={i} style={{
                        marginBottom: '8px',
                        fontSize: '16px',
                        animation: `slideInLeft 0.6s ease-out ${i * 0.1}s both`
                      }}>
                        ✗ {con.replace(/^[-\s]*/, '').trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : slide.type === 'metrics' ? (
            <div>
              <h2 style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: '600',
                marginBottom: '30px',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {slide.title}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 'clamp(10px, 2vw, 20px)',
                marginTop: 'clamp(10px, 2vw, 20px)'
              }}>
                {slide.content.split('\n').filter(point => point.trim()).map((metric, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.2)',
                    animation: `bounceIn 0.8s ease-out ${i * 0.2}s both`
                  }}>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      marginBottom: '10px'
                    }}>
                      {metric.split(':')[0]?.trim()}
                    </div>
                    <div style={{
                      fontSize: '16px',
                      opacity: 0.9
                    }}>
                      {metric.split(':').slice(1).join(':').trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : slide.type === 'three-column' ? (
            <div>
              <h2 style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: '600',
                marginBottom: '30px',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {slide.title}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginTop: '20px'
              }}>
                {[1, 2, 3].map((col, colIndex) => {
                  const columnItems = slide.content.split('\n').filter(point => point.trim());
                  const itemsPerColumn = Math.ceil(columnItems.length / 3);
                  const startIndex = colIndex * itemsPerColumn;
                  const endIndex = Math.min(startIndex + itemsPerColumn, columnItems.length);
                  const columnData = columnItems.slice(startIndex, endIndex);
                  
                  return (
                    <div key={col} style={{
                      background: 'rgba(255,255,255,0.1)',
                      padding: '20px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      animation: `slideInUp 0.6s ease-out ${colIndex * 0.1}s both`
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '15px',
                        textAlign: 'center'
                      }}>
                        Column {col}
                      </h3>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {columnData.map((item, i) => (
                          <li key={i} style={{
                            marginBottom: '8px',
                            fontSize: '14px',
                            paddingLeft: '20px',
                            position: 'relative'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: 0,
                              top: '2px',
                              fontSize: '12px'
                            }}>•</span>
                            {item.trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: '600',
                marginBottom: '30px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {slide.title}
              </h2>
              <div style={{
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                lineHeight: '1.6',
                opacity: 0.9
              }}>
                {slide.content}
              </div>
            </div>
          )}
        </div>
        
        {/* Slide Number */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: 'rgba(255,255,255,0.2)',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          {index + 1} / {presentation.slides.length}
        </div>
      </div>
    );
  // };

  return (
    <div className="powerpoint-preview">
      {/* Header */}
      <div className="header" style={{
        background: '#ffffff',
        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
        borderBottom: '1px solid #e9ecef',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0',
        width: '100%',
        boxSizing: 'border-box',
        flexWrap: 'wrap',
        gap: 'clamp(4px, 1vw, 8px)',
        minHeight: '60px'
      }}>
        <div className="header-title" style={{ minWidth: '150px', flex: '1', maxWidth: 'calc(100% - 200px)' }}>
          <h3 style={{
            fontSize: 'clamp(14px, 2.5vw, 16px)',
            fontWeight: '600',
            margin: 0,
            color: '#2d3748',
            wordBreak: 'break-word'
          }}>
            {presentation.title}
          </h3>
          <p style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: '#718096',
            margin: '2px 0 0 0'
          }}>
            {presentation.slides.length} slides
          </p>
        </div>
        <div className="header-buttons" style={{ 
          display: 'flex', 
          gap: 'clamp(4px, 1vw, 8px)', 
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          minWidth: 'fit-content'
        }}>
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: 'clamp(6px, 2vw, 8px) clamp(10px, 3vw, 12px)',
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: 'clamp(11px, 2.5vw, 12px)',
              color: '#ffffff',
              whiteSpace: 'nowrap',
              minWidth: 'fit-content'
            }}
          >
            {isPreviewMode ? <EyeOff style={{ width: '14px', height: '14px' }} /> : <Eye style={{ width: '14px', height: '14px' }} />}
            {isPreviewMode ? 'Hide' : 'Show'}
          </button>
              {onEditSlide && (
                <button
                  onClick={() => onEditSlide(currentSlide, presentation.slides[currentSlide])}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)',
                    background: '#1f2937',
                    color: '#ffffff',
                    border: '1px solid #374151',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: 'clamp(10px, 2vw, 12px)',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ✏️ Edit Slide
                </button>
              )}
              <button
                onClick={onDownload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)',
                  background: '#1f2937',
                  color: '#ffffff',
                  border: '1px solid #374151',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: 'clamp(10px, 2vw, 12px)',
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}
              >
                <Download style={{ width: '14px', height: '14px' }} />
                Download
              </button>
        </div>
      </div>

      {/* Slide Preview */}
      {isPreviewMode ? (
        <div className="slide-container" style={{
          width: 'min(1000px, calc(100vw - 100px))',
          height: 'min(650px, calc(100vh - 220px))',
          maxWidth: 'calc(100vw - 100px)',
          maxHeight: 'calc(100vh - 220px)',
          minWidth: '320px',
          minHeight: '200px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          background: '#ffffff',
          aspectRatio: '16/9',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
            {/* Show only current slide */}
            {presentation.slides.map((slide, index) => (
              <div
                key={slide.id}
                id={`slide-${index}`}
                 style={{
                   width: '100%',
                   height: '100%',
                   background: template.colors.background,
                   borderRadius: '16px',
                   padding: '40px',
                   color: template.colors.text,
                   position: index === currentSlide ? 'relative' : 'absolute',
                   top: 0,
                   left: 0,
                   opacity: index === currentSlide ? 1 : 0,
                   visibility: index === currentSlide ? 'visible' : 'hidden',
                   overflow: 'hidden',
                   boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                   cursor: 'pointer',
                   display: 'flex',
                   flexDirection: 'column',
                   justifyContent: 'center',
                   alignItems: 'center',
                   fontFamily: template.layout.titleFont,
                   border: `1px solid ${template.colors.primary}20`,
                   backdropFilter: 'blur(5px)',
                   transition: 'opacity 0.6s ease-in-out, visibility 0.6s ease-in-out',
                   boxSizing: 'border-box'
                 }}
                  onClick={() => setCurrentSlide(index)}
                  onMouseEnter={(e) => {
                    if (index === currentSlide) {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index === currentSlide) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.1)';
                    }
                  }}
                >
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
                  
                  {/* Slide Number Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: index === currentSlide 
                      ? template.colors.primary
                      : 'rgba(0,0,0,0.1)',
                    color: index === currentSlide ? '#ffffff' : template.colors.text,
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backdropFilter: 'blur(10px)',
                    border: index === currentSlide ? `2px solid ${template.colors.secondary}` : 'none',
                    boxShadow: index === currentSlide 
                      ? `0 4px 12px ${template.colors.primary}40` 
                      : 'none',
                    zIndex: 10
                  }}>
                    {index === currentSlide ? '●' : '○'} {index + 1}
                  </div>
                  
                    {/* Slide Content */}
                    <div style={{
                      position: 'relative',
                      zIndex: 1,
                      width: '100%',
                      height: '100%',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '40px',
                      boxSizing: 'border-box',
                      overflow: 'hidden'
                    }}>
                    {slide.type === 'title' ? (
                      <div style={{ textAlign: 'center' }}>
                          <h1 style={{
                            fontSize: `${Math.min(template.layout.titleSize, 48)}px`,
                            fontWeight: '700',
                            marginBottom: '20px',
                            textShadow: '0 6px 12px rgba(0,0,0,0.4)',
                            animation: 'titleGlow 2s ease-in-out infinite alternate',
                            fontFamily: template.layout.titleFont,
                            background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            lineHeight: '1.2',
                            letterSpacing: '-0.02em',
                            wordWrap: 'break-word',
                            maxWidth: '100%'
                          }}>
                            {slide.title}
                          </h1>
                        {slide.content && (
                          <p style={{
                            fontSize: `${template.layout.contentSize}px`,
                            opacity: 0.9,
                            animation: 'fadeInUp 1s ease-out 0.5s both',
                            fontFamily: template.layout.contentFont
                          }}>
                            {slide.content}
                          </p>
                        )}
                      </div>
                    ) : slide.type === 'bullet' ? (
                      <div>
                        <h2 style={{
                          fontSize: `${template.layout.titleSize - 4}px`,
                          fontWeight: '600',
                          marginBottom: '30px',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          fontFamily: template.layout.titleFont
                        }}>
                          {slide.title}
                        </h2>
                          <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            fontSize: `${Math.min(template.layout.contentSize, 18)}px`,
                            lineHeight: '1.5',
                            maxWidth: '900px',
                            maxHeight: '400px',
                            margin: '0 auto',
                            fontFamily: template.layout.contentFont,
                            textAlign: 'center',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden'
                          }}>
                          {slide.content.split('\n').filter(point => point.trim()).slice(0, 6).map((point, i) => (
                            <li key={i} style={{
                              marginBottom: '20px',
                              paddingLeft: '40px',
                              position: 'relative',
                              animation: `slideInLeft 0.6s ease-out ${i * 0.1}s both`,
                              background: 'rgba(255,255,255,0.05)',
                              padding: '12px 16px 12px 40px',
                              borderRadius: '8px',
                              border: `1px solid ${template.colors.primary}20`,
                              backdropFilter: 'blur(5px)',
                              textAlign: 'center',
                              width: '100%',
                              maxWidth: '800px',
                              margin: '0 auto 20px auto'
                            }}>
                              <span style={{
                                position: 'absolute',
                                left: '12px',
                                top: '12px',
                                fontSize: '18px',
                                animation: 'pulse 2s ease-in-out infinite',
                                color: template.colors.secondary
                              }}>✨</span>
                              {point.trim()}
                            </li>
                          ))}
                          {slide.content.split('\n').filter(point => point.trim()).length > 6 && (
                            <div style={{
                              background: 'rgba(255, 193, 7, 0.9)',
                              color: '#000',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              marginTop: '10px',
                              textAlign: 'center',
                              border: '1px solid #ffc107'
                            }}>
                              ⚠️ Content truncated - {slide.content.split('\n').filter(point => point.trim()).length - 6} more items
                            </div>
                          )}
                        </ul>
                      </div>
                    ) : slide.type === 'image' ? (
                      <div style={{ textAlign: 'center' }}>
                        <h2 style={{
                          fontSize: `${template.layout.titleSize - 4}px`,
                          fontWeight: '600',
                          marginBottom: '30px',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          fontFamily: template.layout.titleFont
                        }}>
                          {slide.title}
                        </h2>
                        <div style={{
                          width: '100%',
                          maxWidth: '600px',
                          height: '300px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto',
                          border: '2px solid rgba(255,255,255,0.3)',
                          position: 'relative',
                          overflow: 'hidden',
                          backgroundImage: `url(https://picsum.photos/600/300?random=${Math.floor(Math.random() * 1000)}), linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                          backgroundSize: 'cover, cover',
                          backgroundPosition: 'center, center',
                          backgroundRepeat: 'no-repeat, no-repeat',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                        }}>
                          {/* Fallback content in case image doesn't load */}
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            color: 'rgba(255,255,255,0.8)',
                            zIndex: 1
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
                              fontWeight: '500',
                              marginBottom: '8px'
                            }}>
                              {slide.content ? slide.content.replace(/\[Image: /g, '').replace(/\]/g, '') : 'Visual Content'}
                            </div>
                          </div>
                          
                          <div style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            right: '0',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                            // padding: '20px',
                            color: 'white',
                            textAlign: 'center'
                          }}>
                            <div style={{
                              fontSize: '12px',
                              opacity: 0.9,
                              textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                            }}>
                              High-quality random image
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 style={{
                          fontSize: `${template.layout.titleSize - 4}px`,
                          fontWeight: '600',
                          marginBottom: '30px',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          fontFamily: template.layout.titleFont
                        }}>
                          {slide.title}
                        </h2>
                        <div style={{
                          fontSize: `${template.layout.contentSize}px`,
                          lineHeight: '1.8',
                          opacity: 0.9,
                          maxWidth: '700px',
                          margin: '0 auto',
                          fontFamily: template.layout.contentFont
                        }}>
                          {slide.content}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            
            {/* Navigation Controls - Fixed at bottom */} 
          <div className="navigation-controls" style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.8)',
            padding: '8px 10px',
            borderRadius: '25px',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                background: currentSlide === 0 ? '#6b7280' : '#1f2937',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
                opacity: currentSlide === 0 ? 0.5 : 1,
                transition: 'all 0.2s ease',
                boxShadow: currentSlide === 0 ? 'none' : '0 2px 8px rgba(31, 41, 55, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (currentSlide !== 0) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.background = '#374151';
                }
              }}
              onMouseLeave={(e) => {
                if (currentSlide !== 0) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = '#1f2937';
                }
              }}
            >
              <ChevronLeft style={{ width: '14px', height: '14px' }} />
            </button>
            
            {/* Compact Slide Counter */}
            <div style={{
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: '500',
              minWidth: '40px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              // padding: '2px 6px'
            }}>
              {currentSlide + 1}/{presentation.slides.length}
            </div>
            
            {/* Compact Dots */}
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              {presentation.slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: index === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: index === currentSlide ? 'scale(1.2)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.transform = 'scale(1.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = index === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.4)';
                    e.currentTarget.style.transform = index === currentSlide ? 'scale(1.2)' : 'scale(1)';
                  }}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              disabled={currentSlide === presentation.slides.length - 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                background: currentSlide === presentation.slides.length - 1 ? '#6b7280' : '#1f2937',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                cursor: currentSlide === presentation.slides.length - 1 ? 'not-allowed' : 'pointer',
                opacity: currentSlide === presentation.slides.length - 1 ? 0.5 : 1,
                transition: 'all 0.2s ease',
                boxShadow: currentSlide === presentation.slides.length - 1 ? 'none' : '0 2px 8px rgba(31, 41, 55, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (currentSlide !== presentation.slides.length - 1) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.background = '#374151';
                }
              }}
              onMouseLeave={(e) => {
                if (currentSlide !== presentation.slides.length - 1) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = '#1f2937';
                }
              }}
            >
              <ChevronRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </div>
      ) : (
        /* Content View when preview is hidden */
        <div style={{
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          height: 'calc(100% - 60px)',
          overflow: 'hidden',
          maxHeight: 'calc(100vh - 120px)'
        }}>
            <h3 style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '16px',
              borderBottom: '2px solid #e2e8f0',
              // paddingBottom: '8px'
            }}>
              {presentation.title}
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
                  <p style={{
                    fontSize: '14px',
                    color: '#718096',
                    margin: '0 0 8px 0'
                  }}>
                    {presentation.slides.length} slides • Created {presentation.createdAt ? (presentation.createdAt instanceof Date ? presentation.createdAt.toLocaleDateString() : new Date(presentation.createdAt).toLocaleDateString()) : 'Recently'}
                  </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'clamp(8px, 2vw, 12px)'
            }}>
              {presentation.slides.map((slide, index) => (
                    <div key={slide.id} style={{
                      background: '#f7fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      // padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderLeft: '4px solid #3b82f6',
                      position: 'relative'
                    }}
                    onClick={() => {
                      setCurrentSlide(index);
                      setIsPreviewMode(true);
                    }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#edf2f7';
                  e.currentTarget.style.borderColor = '#cbd5e0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f7fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      background: '#3b82f6',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {index + 1}
                    </span>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#2d3748',
                      margin: '0'
                    }}>
                      {slide.title}
                    </h4>
                    <span style={{
                      background: '#e2e8f0',
                      color: '#4a5568',
                      // padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'uppercase'
                    }}>
                      {slide.type}
                    </span>
                  </div>
                  
                      <p style={{
                        fontSize: '12px',
                        color: '#718096',
                        margin: '0',
                        lineHeight: '1.4',
                        maxHeight: '40px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {slide.content.length > 100 ? slide.content.substring(0, 100) + '...' : slide.content}
                      </p>
                      
                      {onEditSlide && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditSlide(index, slide);
                          }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#1f2937',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            // padding: '4px 8px',
                            fontSize: '10px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(31, 41, 55, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#374151';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#1f2937';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          ✏️ Edit
                        </button>
                      )}
                    </div>
              ))}
            </div>

            <div style={{
              marginTop: '20px',
              // padding: '12px',
              background: '#edf2f7',
              borderRadius: '6px',
              border: '1px solid #cbd5e0'
            }}>
              <p style={{
                fontSize: '12px',
                color: '#4a5568',
                margin: '0',
                textAlign: 'center'
              }}>
                💡 Click on any slide to preview it, or use the "Show Preview" button to see the full presentation
              </p>
            </div>
        </div>
      )}
    </div>
  );
};

export default PowerPointPreview;
