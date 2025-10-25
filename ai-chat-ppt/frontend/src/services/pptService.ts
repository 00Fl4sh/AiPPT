import { Presentation } from '../types';

export const generatePowerPoint = async (presentation: Presentation): Promise<Blob> => {
    try {
        // Try to use backend server for real PowerPoint generation
        const response = await fetch('http://localhost:5000/api/generate-pptx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ presentation })
        });
        

        if (response.ok) {
            const blob = await response.blob();
            return blob;
        } else {
            throw new Error('Backend server not available');
        }
    } catch (error) {
        console.log('Backend server not available, using HTML fallback');
        // Fallback to HTML generation if backend is not available
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${presentation.title}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh;
            padding: 20px;
            animation: backgroundShift 10s ease-in-out infinite;
        }
        
        @keyframes backgroundShift {
            0%, 100% { background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); }
            50% { background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%); }
        }
        
        .presentation-container {
            max-width: 1200px;
            margin: 0 auto;
            background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 25px;
            box-shadow: 
                0 30px 80px rgba(0,0,0,0.15),
                0 15px 40px rgba(0,0,0,0.1),
                inset 0 1px 0 rgba(255,255,255,0.8);
            overflow: hidden;
            animation: containerFloat 6s ease-in-out infinite;
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        @keyframes containerFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .slide { 
            background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
            margin: 0; 
            padding: 80px 60px; 
            min-height: 700px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            page-break-after: always;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            position: relative;
            overflow: hidden;
            animation: slideInUp 0.8s ease-out;
        }
        
        @keyframes slideInUp {
            from { 
                opacity: 0; 
                transform: translateY(50px) scale(0.95); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }
        
        .slide::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
            border-radius: 0 0 3px 3px;
        }
        
        .slide::after {
            content: '';
            position: absolute;
            top: 20px;
            right: 20px;
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
            border-radius: 50%;
            animation: float 4s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .slide:last-child {
            border-bottom: none;
        }
        
        .slide-title { 
            font-family: 'Playfair Display', serif;
            font-size: 42px; 
            font-weight: 700; 
            color: #2c3e50; 
            margin-bottom: 40px;
            line-height: 1.2;
            position: relative;
            animation: titleReveal 1s ease-out;
        }
        
        @keyframes titleReveal {
            from { 
                opacity: 0; 
                transform: translateX(-30px); 
            }
            to { 
                opacity: 1; 
                transform: translateX(0); 
            }
        }
        
        .slide-title::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 0;
            width: 60px;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 2px;
            animation: underlineGrow 1s ease-out 0.5s both;
        }
        
        @keyframes underlineGrow {
            from { width: 0; }
            to { width: 60px; }
        }
        
        .slide-content { 
            font-size: 22px; 
            line-height: 1.8; 
            color: #34495e;
            flex: 1;
            animation: contentFadeIn 1s ease-out 0.3s both;
            font-weight: 400;
        }
        
        @keyframes contentFadeIn {
            from { 
                opacity: 0; 
                transform: translateY(20px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        
        .bullet-points { 
            margin-left: 0; 
            padding-left: 0;
            list-style: none;
        }
        
        .bullet-points li { 
            margin-bottom: 20px; 
            font-size: 20px;
            line-height: 1.7;
            padding-left: 40px;
            position: relative;
            animation: bulletSlideIn 0.6s ease-out;
            animation-fill-mode: both;
        }
        
        @keyframes bulletSlideIn {
            from { 
                opacity: 0; 
                transform: translateX(-30px); 
            }
            to { 
                opacity: 1; 
                transform: translateX(0); 
            }
        }
        
        .bullet-points li::before {
            content: '✨';
            position: absolute;
            left: 0;
            top: 0;
            font-size: 18px;
            animation: bulletPulse 2s ease-in-out infinite;
        }
        
        @keyframes bulletPulse {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
            50% { transform: scale(1.2) rotate(10deg); opacity: 1; }
        }
        
        .bullet-points li:nth-child(1) { animation-delay: 0.1s; }
        .bullet-points li:nth-child(2) { animation-delay: 0.2s; }
        .bullet-points li:nth-child(3) { animation-delay: 0.3s; }
        .bullet-points li:nth-child(4) { animation-delay: 0.4s; }
        .bullet-points li:nth-child(5) { animation-delay: 0.5s; }
        
        .title-slide { 
            text-align: center; 
            padding: 100px 60px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .title-slide::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
            0%, 100% { transform: translateX(-100%) translateY(-100%) rotate(0deg); }
            50% { transform: translateX(0%) translateY(0%) rotate(180deg); }
        }
        
        .title-slide h1 { 
            font-family: 'Playfair Display', serif;
            font-size: 64px; 
            color: white; 
            margin-bottom: 40px;
            font-weight: 700;
            text-shadow: 0 4px 8px rgba(0,0,0,0.3);
            animation: titleGlow 2s ease-in-out infinite alternate;
            position: relative;
            z-index: 1;
        }
        
        @keyframes titleGlow {
            from { 
                text-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3); 
            }
            to { 
                text-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.6); 
            }
        }
        
        .title-slide p { 
            font-size: 32px; 
            color: rgba(255,255,255,0.95);
            font-weight: 300;
            animation: subtitleFade 1.5s ease-out 0.5s both;
            position: relative;
            z-index: 1;
        }
        
        @keyframes subtitleFade {
            from { 
                opacity: 0; 
                transform: translateY(30px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        
        .slide-number {
            position: absolute;
            bottom: 30px;
            right: 40px;
            color: #667eea;
            font-size: 16px;
            font-weight: 600;
            background: rgba(102, 126, 234, 0.1);
            padding: 8px 16px;
            border-radius: 20px;
            border: 1px solid rgba(102, 126, 234, 0.2);
            animation: numberPulse 2s ease-in-out infinite;
        }
        
        @keyframes numberPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .slide {
            position: relative;
        }
        
        /* Hover effects */
        .slide:hover {
            transform: translateY(-5px);
            box-shadow: 
                0 40px 100px rgba(0,0,0,0.2),
                0 20px 50px rgba(0,0,0,0.15),
                inset 0 1px 0 rgba(255,255,255,0.8);
            transition: all 0.4s ease;
        }
        
        .slide:hover::after {
            animation: float 2s ease-in-out infinite;
        }
        
        /* Print styles */
        @media print {
            body { 
                background: white; 
                padding: 0;
                animation: none;
            }
            .slide { 
                page-break-after: always; 
                animation: none;
                box-shadow: none;
            }
            .slide::before,
            .slide::after {
                display: none;
            }
            .presentation-container {
                box-shadow: none;
                animation: none;
            }
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            .slide {
                padding: 60px 40px;
                min-height: 500px;
            }
            .slide-title {
                font-size: 32px;
            }
            .slide-content {
                font-size: 18px;
            }
            .title-slide h1 {
                font-size: 48px;
            }
            .title-slide p {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="presentation-container">
        ${presentation.slides.map((slide, index) => {
            const isTitleSlide = slide.type === 'title';
            const slideClass = isTitleSlide ? 'slide title-slide' : 'slide';

            if (isTitleSlide) {
                return `
              <div class="${slideClass}">
                <h1>${slide.title}</h1>
                ${slide.content ? `<p>${slide.content}</p>` : ''}
                <div class="slide-number">Slide ${index + 1}</div>
              </div>
            `;
            } else if (slide.type === 'bullet') {
                const bulletPoints = slide.content.split('\n').filter(point => point.trim());
                return `
              <div class="${slideClass}">
                <div class="slide-title">${slide.title}</div>
                <div class="slide-content">
                  <ul class="bullet-points">
                    ${bulletPoints.map(point => `<li>${point.trim()}</li>`).join('')}
                  </ul>
                </div>
                <div class="slide-number">Slide ${index + 1}</div>
              </div>
            `;
            } else {
                return `
              <div class="${slideClass}">
                <div class="slide-title">${slide.title}</div>
                <div class="slide-content">${slide.content}</div>
                <div class="slide-number">Slide ${index + 1}</div>
              </div>
            `;
            }
        }).join('')}
    </div>
</body>
</html>
  `.trim();

        const blob = new Blob([htmlContent], { type: 'text/html' });
        return blob;
    }
};

export const downloadPowerPoint = (blob: Blob, filename: string = 'presentation.html') => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};