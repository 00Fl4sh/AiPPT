import { GoogleGenerativeAI } from '@google/generative-ai';
import { Slide } from '../types';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

console.log('API_KEY loaded:', API_KEY ? 'YES' : 'NO');
console.log('API_KEY value:', API_KEY);

if (!API_KEY) {
  console.warn('REACT_APP_GEMINI_API_KEY is not set. Please add your Gemini API key to .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export interface SlideGenerationResponse {
  title: string;
  slides: Slide[];
}

// Helper function to detect if prompt is unclear or needs clarification
const isPromptUnclear = (prompt: string): boolean => {
  const unclearPatterns = [
    /^(hi|hello|hey)$/i,
    /^(what|how|why|when|where|who)\?$/i,
    /^(help|assist|support)$/i,
    /^(create|make|generate)$/i,
    /^(ppt|presentation|slides)$/i,
    /^.{1,10}$/, // Very short prompts
    /^(ok|yes|no|maybe|sure)$/i
  ];
  
  // Don't treat descriptive prompts as unclear
  const descriptiveWords = ['about', 'culture', 'history', 'business', 'technology', 'science', 'health', 'education', 'travel', 'food', 'art', 'music', 'sports', 'environment', 'politics', 'economy'];
  const hasDescriptiveContent = descriptiveWords.some(word => prompt.toLowerCase().includes(word));
  
  // If it has descriptive content and is longer than 10 characters, it's probably clear
  if (hasDescriptiveContent && prompt.trim().length > 10) {
    return false;
  }
  
  return unclearPatterns.some(pattern => pattern.test(prompt.trim()));
};

// Helper function to detect if it's a question
const isQuestion = (prompt: string): boolean => {
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'could', 'would', 'should', 'is', 'are', 'do', 'does', 'did'];
  const lowerPrompt = prompt.toLowerCase();
  return questionWords.some(word => lowerPrompt.startsWith(word)) || prompt.includes('?');
};

// Helper function to detect if it's a conversation
const isConversation = (prompt: string): boolean => {
  const conversationPatterns = [
    /^(thanks|thank you|thx)$/i,
    /^(good|great|awesome|nice|excellent)$/i,
    /^(bad|terrible|awful|horrible)$/i,
    /^(yes|no|maybe|sure|ok|okay)$/i,
    /^(please|pls)$/i
  ];
  
  return conversationPatterns.some(pattern => pattern.test(prompt.trim()));
};

export const generateSlides = async (prompt: string, onProgress?: (slide: any, index: number, total: number) => void, selectedTemplate?: string): Promise<SlideGenerationResponse> => {
  try {
    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Please provide a valid prompt');
    }

    // Check if prompt is unclear and needs clarification
    if (isPromptUnclear(prompt)) {
      const responses = [
        "I'd love to help you create a presentation! Could you tell me more about what you'd like to present? For example, what's the main topic and who will be your audience?",
        "That sounds interesting! To create the best presentation for you, I need a bit more detail. What specific topic would you like to cover, and what are the key points you want to highlight?",
        "I'm excited to help you with your presentation! Could you give me more context about what you'd like to create? What's the subject matter and what's the goal of your presentation?",
        "I'd be happy to create a presentation for you! To make it really effective, could you tell me what topic you want to cover and who you'll be presenting to?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      throw new Error(`CLARIFICATION_NEEDED: ${randomResponse}`);
    }

    // Check if it's a question
    if (isQuestion(prompt)) {
      const responses = [
        "That's a great question! I'm designed to help create presentations, so if you'd like to turn your question into a presentation topic, I'd be happy to help. What would you like to present about?",
        "Interesting question! I specialize in creating PowerPoint presentations. If you'd like to explore your question through a presentation, I can help you structure it. What topic would you like to present?",
        "I love questions! While I'm focused on creating presentations, I'd be delighted to help you turn your question into a presentation. What subject would you like to cover?",
        "That's a thoughtful question! I'm here to help you create presentations. If you'd like to present about this topic, I can help you organize it into slides. What would you like to present?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      throw new Error(`QUESTION_DETECTED: ${randomResponse}`);
    }

    // Check if it's just conversation
    if (isConversation(prompt)) {
      const responses = [
        "You're welcome! I'm here whenever you need help creating or editing presentations. What would you like to work on?",
        "Thanks! I'm glad I could help. If you'd like to create a new presentation or modify an existing one, just let me know what you have in mind!",
        "My pleasure! I'm always happy to help with presentations. What topic would you like to explore in your next presentation?",
        "You're very welcome! I love helping with presentations. Is there a specific topic or project you'd like to work on?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      throw new Error(`CONVERSATION_DETECTED: ${randomResponse}`);
    }

    if (!API_KEY || API_KEY === 'your_gemini_api_key_here' || API_KEY.length < 10) {
      // Fallback to intelligent mock response when API key is not configured
      console.log('Using fallback AI simulation (add your Gemini API key for real AI responses)');
      console.log('API_KEY status:', { hasKey: !!API_KEY, keyLength: API_KEY.length, isDefault: API_KEY === 'your_gemini_api_key_here' });
      
      const slides = [
        {
          id: "slide-1",
          title: "AI in Healthcare: Transforming Medical Practice",
          content: "A comprehensive overview of how artificial intelligence is revolutionizing healthcare delivery, diagnosis, and patient care for medical professionals.",
          type: "title" as const
        },
        {
          id: "slide-2",
          title: "Key Applications of AI in Healthcare",
          content: "• Medical Imaging and Diagnostics\n• Drug Discovery and Development\n• Personalized Treatment Plans\n• Predictive Analytics and Risk Assessment\n• Robotic Surgery and Automation\n• Electronic Health Records Management",
          type: "bullet" as const
        },
        {
          id: "slide-3",
          title: "AI in Healthcare: SWOT Analysis",
          content: "Strengths: Improved diagnostic accuracy, faster drug discovery, enhanced patient outcomes\nWeaknesses: High implementation costs, data privacy concerns, regulatory challenges\nOpportunities: Telemedicine expansion, personalized medicine, preventive care\nThreats: Cybersecurity risks, job displacement concerns, ethical dilemmas",
          type: "swot" as const
        },
            {
              id: "slide-4",
              title: "AI Implementation Timeline",
              content: "Phase 1: Data Collection and Analysis (Months 1-6)\nPhase 2: AI Model Development and Training (Months 7-12)\nPhase 3: Pilot Testing and Validation (Months 13-18)\nPhase 4: Full Deployment and Integration (Months 19-24)",
              type: "timeline" as const
            },
            {
              id: "slide-5",
              title: "AI in Healthcare: Benefits and Challenges",
              content: "Pros:\n+ Improved diagnostic accuracy (up to 95%)\n+ Reduced medical errors and costs\n+ Faster drug discovery and development\n+ Enhanced patient care and outcomes\n\nCons:\n- High initial implementation costs\n- Data privacy and security concerns\n- Need for extensive staff training\n- Regulatory and compliance challenges",
              type: "pros-cons" as const
            },
            {
              id: "slide-6",
              title: "AI Healthcare Impact Metrics",
              content: "Diagnostic Accuracy: 95% improvement\nCost Reduction: 30% average savings\nPatient Satisfaction: 4.8/5 rating\nROI: 300% within 2 years\nTreatment Time: 40% faster\nError Reduction: 85% fewer mistakes",
              type: "metrics" as const
            },
            {
              id: "slide-7",
              title: "AI Technology in Medical Practice",
              content: "Advanced machine learning algorithms for medical imaging analysis, natural language processing for clinical documentation, and predictive analytics for patient care optimization.",
              type: "image" as const
            },
            {
              id: "slide-8",
              title: "AI Healthcare Implementation Framework",
              content: "Clinical Applications: Diagnostic imaging, treatment planning, drug discovery\nTechnical Requirements: Data infrastructure, AI models, integration systems\nSuccess Factors: Staff training, change management, continuous monitoring",
              type: "three-column" as const
            },
            {
              id: "slide-9",
              title: "Conclusion: The Future of AI in Healthcare",
              content: "AI is transforming healthcare delivery, improving patient outcomes, and revolutionizing medical practice. As medical professionals, embracing AI technology will enhance our ability to provide better, faster, and more personalized care to our patients.\n\nThank you for your attention!",
              type: "content" as const
            }
      ];

      // Generate slides one by one with progress updates
      const intelligentResponse: SlideGenerationResponse = {
        title: "AI in Healthcare: Transforming Medical Practice",
        slides: []
      };

      for (let i = 0; i < slides.length; i++) {
        // Simulate individual slide generation
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Add slide to response
        intelligentResponse.slides.push(slides[i]);
        
        // Call progress callback if provided
        if (onProgress) {
          onProgress(slides[i], i + 1, slides.length);
        }
      }
      
      return intelligentResponse;
    }

    const systemPrompt = `You are an expert AI assistant that creates PowerPoint presentations.
    
    CRITICAL: You must ALWAYS respond with ONLY a valid JSON object. Never provide explanations, clarifications, or conversational text. The response must start with { and end with }.
    
    Your job is to create presentations based on user prompts. Even if the prompt seems vague, make reasonable assumptions and create a comprehensive presentation.
    
    User prompt: ${prompt}
    ${selectedTemplate ? `Selected template: ${selectedTemplate}` : ''}
    
    Create a presentation immediately. Use your knowledge to fill in any gaps and make the presentation useful and professional.
    ${selectedTemplate ? `Apply the ${selectedTemplate} template styling and color scheme to the presentation.` : ''}
    
    Return your response as a JSON object with this exact structure:
    {
      "title": "Presentation Title",
      "slides": [
        {
          "id": "slide-1",
          "title": "Slide Title",
          "content": "Slide content or bullet points",
          "type": "title"
        }
      ]
    }
    
    Available slide types: "title", "content", "bullet", "image", "swot", "timeline", "metrics", "pros-cons", "three-column"
    For bullet points, separate each point with a newline character.
    For image slides, use type "image" and put the image description in content field (without brackets).
    Create 3-8 slides that are relevant, informative, and engaging.
    Make the content professional and well-structured.
    
    IMPORTANT: You MUST include at least 1-2 image slides in every presentation to make it more visual and engaging.
    Use image slides for: diagrams, charts, photos, illustrations, visual concepts, data visualizations, or any visual content.
    Examples of when to use image slides: medical imaging, technology diagrams, product photos, data charts, process flows, architectural designs, etc.
    
    For image slides, use simple, searchable keywords in the content field that will work well with image search APIs.
    Examples: "medical technology", "solar panels", "data visualization", "business meeting", "artificial intelligence", "renewable energy", "space exploration", "healthcare innovation"
    
    IMPORTANT: Respond with ONLY the JSON object, no explanations or additional text.`;

    const result = await model.generateContent([systemPrompt, prompt]);
    const response = await result.response;
    const text = response.text();
    
    console.log('AI Response for generateSlides:', text);
    
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        
        // Clean up any markdown formatting in slide content
        if (parsed.slides) {
          parsed.slides.forEach((slide: any) => {
            if (slide.content) {
              // Remove markdown formatting like ***, **, *, etc.
              slide.content = slide.content
                .replace(/\*\*\*/g, '') // Remove ***
                .replace(/\*\*/g, '')   // Remove **
                .replace(/\*/g, '')     // Remove *
                .replace(/###/g, '')    // Remove ###
                .replace(/##/g, '')     // Remove ##
                .replace(/#/g, '')      // Remove #
                .replace(/```/g, '')    // Remove ```
                .replace(/`/g, '')      // Remove `
                .trim();
            }
          });
        }
        
        return parsed;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw JSON string:', jsonMatch[0]);
        throw new Error('Failed to parse AI response JSON');
      }
    } else {
      console.error('No JSON found in AI response:', text);
      throw new Error('No valid JSON response found from AI');
    }
  } catch (error) {
    console.error('Error generating slides:', error);
    
    // Handle specific Gemini API errors
    if (error instanceof Error) {
      if (error.message.includes('503') || error.message.includes('overloaded')) {
        throw new Error('GEMINI_OVERLOADED: The AI service is temporarily busy. Please wait a moment and try again.');
      } else if (error.message.includes('429') || error.message.includes('quota')) {
        throw new Error('GEMINI_QUOTA: API quota exceeded. Please try again later.');
      } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
        throw new Error('GEMINI_AUTH: API key issue. Please check your configuration.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('GEMINI_NETWORK: Network connection issue. Please check your internet and try again.');
      }
    }
    
    throw new Error('Failed to generate slides. Please try again.');
  }
};

export const editSlides = async (currentSlides: Slide[], editPrompt: string, onProgress?: (slide: any, index: number, total: number) => void, selectedTemplate?: string): Promise<SlideGenerationResponse> => {
  try {
    // Validate input
    if (!editPrompt || editPrompt.trim().length === 0) {
      throw new Error('Please provide a valid edit request');
    }
    
    if (!currentSlides || currentSlides.length === 0) {
      throw new Error('No existing slides to edit');
    }

    // Check if edit prompt is unclear
    if (isPromptUnclear(editPrompt)) {
      const responses = [
        "I'd love to help you improve your presentation! Could you be more specific about what you'd like to change? For example, which slide needs updating or what new content you'd like to add?",
        "I'm here to help you edit your presentation! To make the best changes, could you tell me which slide you want to modify and what specific updates you have in mind?",
        "I'd be happy to help you update your presentation! Could you give me more details about what you'd like to change? Which slide and what kind of modifications are you thinking?",
        "I'm excited to help you improve your presentation! To make the right changes, could you tell me which slide you want to work on and what specific updates you'd like to make?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      throw new Error(`CLARIFICATION_NEEDED: ${randomResponse}`);
    }

    // Check if it's a question about the presentation
    if (isQuestion(editPrompt)) {
      const responses = [
        "That's a great question about your presentation! I can help you make changes to improve it. What specific modifications would you like to make to your slides?",
        "I love that you're thinking about your presentation! I'm here to help you edit and improve it. What changes would you like to make?",
        "That's a thoughtful question! I'd be happy to help you modify your presentation. What specific updates are you considering?",
        "Great question! I'm here to help you enhance your presentation. What kind of changes would you like to make to your slides?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      throw new Error(`QUESTION_DETECTED: ${randomResponse}`);
    }

    // Check if it's just conversation
    if (isConversation(editPrompt)) {
      const responses = [
        "You're welcome! I'm always here to help you improve your presentations. What specific changes would you like to make to your slides?",
        "Thanks! I'm glad I could help. If you'd like to modify your presentation, just let me know what updates you have in mind!",
        "My pleasure! I love helping with presentations. What changes would you like to make to your current slides?",
        "You're very welcome! I'm here to help you perfect your presentation. What modifications would you like to work on?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      throw new Error(`CONVERSATION_DETECTED: ${randomResponse}`);
    }

    if (!API_KEY || API_KEY === 'your_gemini_api_key_here' || API_KEY.length < 10) {
      // Fallback to intelligent mock response when API key is not configured
      console.log('Using fallback AI simulation for editing (add your Gemini API key for real AI responses)');
      console.log('API_KEY status for editing:', { hasKey: !!API_KEY, keyLength: API_KEY.length, isDefault: API_KEY === 'your_gemini_api_key_here' });
      
      // Create improved slides based on edit prompt
      const improvedSlides = currentSlides.map((slide, index) => {
        // Enhance the first slide with better content
        if (index === 0) {
          return {
            ...slide,
            title: "AI in Healthcare: Transforming Medical Practice",
            content: "A comprehensive overview of how artificial intelligence is revolutionizing healthcare delivery, diagnosis, and patient care for medical professionals. This enhanced presentation provides deeper insights into AI applications, benefits, and implementation strategies."
          };
        }
        // Enhance the second slide with more detailed applications
        if (index === 1) {
          return {
            ...slide,
            title: "Advanced AI Applications in Healthcare",
            content: "• Medical Imaging and Diagnostics (95% accuracy improvement)\n• Drug Discovery and Development (40% faster)\n• Personalized Treatment Plans (AI-driven precision medicine)\n• Predictive Analytics and Risk Assessment (Early disease detection)\n• Robotic Surgery and Automation (Minimally invasive procedures)\n• Electronic Health Records Management (Intelligent data processing)\n• Telemedicine and Remote Monitoring (AI-powered patient care)\n• Clinical Decision Support Systems (Evidence-based recommendations)"
          };
        }
        // Add more specific content to SWOT analysis
        if (index === 2) {
          return {
            ...slide,
            title: "AI in Healthcare: Comprehensive SWOT Analysis",
            content: "Strengths: Improved diagnostic accuracy (95%), faster drug discovery, enhanced patient outcomes, reduced medical errors\nWeaknesses: High implementation costs ($2M+), data privacy concerns (HIPAA compliance), regulatory challenges (FDA approval)\nOpportunities: Telemedicine expansion (300% growth), personalized medicine (precision treatment), preventive care (early intervention)\nThreats: Cybersecurity risks (data breaches), job displacement concerns (automation), ethical dilemmas (AI bias)"
          };
        }
        // Keep other slides but enhance them slightly
        return {
          ...slide,
          content: slide.content + `\n\n[Enhanced with: ${editPrompt}]`
        };
      });
      
      // Simulate individual slide generation
      for (let i = 0; i < improvedSlides.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Call progress callback if provided
        if (onProgress) {
          onProgress(improvedSlides[i], i + 1, improvedSlides.length);
        }
      }
      
      const intelligentResponse: SlideGenerationResponse = {
        title: `Enhanced AI in Healthcare Presentation (Updated: ${editPrompt})`,
        slides: improvedSlides
      };
      
      return intelligentResponse;
    }

    const systemPrompt = `You are an expert AI assistant that edits PowerPoint presentations.
    
    CRITICAL: You must ALWAYS respond with ONLY a valid JSON object. Never provide explanations, clarifications, or conversational text. The response must start with { and end with }.
    
    Your job is to edit presentations based on user requests. Make the requested changes and improvements immediately.
    
    Current slides: ${JSON.stringify(currentSlides)}
    Edit request: ${editPrompt}
    ${selectedTemplate ? `Selected template: ${selectedTemplate}` : ''}
    
    Make the appropriate changes to the presentation. You can:
    - Edit existing slides (change content, rephrase, improve)
    - Add new slides with unique IDs
    - Remove slides if requested
    - Reorganize the presentation
    - Improve grammar, style, and clarity
    - Make content more professional or engaging
    - Add image slides when relevant (use type "image" and describe the image in content)
    
    IMPORTANT: Always consider adding image slides to make presentations more visual and engaging.
    Use image slides for: diagrams, charts, photos, illustrations, visual concepts, data visualizations.
    
    Return your response as a JSON object with this exact structure:
    {
      "title": "Updated Presentation Title",
      "slides": [
        {
          "id": "slide-1",
          "title": "Updated Slide Title",
          "content": "Updated slide content",
          "type": "title"
        }
      ]
    }
    
    IMPORTANT: Respond with ONLY the JSON object, no explanations or additional text.`;

    const result = await model.generateContent([systemPrompt, editPrompt]);
    const response = await result.response;
    const text = response.text();
    
    console.log('AI Response for editSlides:', text);
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        
        // Clean up any markdown formatting in slide content
        if (parsed.slides) {
          parsed.slides.forEach((slide: any, index: number) => {
            console.log(`Slide ${index + 1}:`, slide.type, slide.title);
            if (slide.content) {
              // Remove markdown formatting like ***, **, *, etc.
              slide.content = slide.content
                .replace(/\*\*\*/g, '') // Remove ***
                .replace(/\*\*/g, '')   // Remove **
                .replace(/\*/g, '')     // Remove *
                .replace(/###/g, '')    // Remove ###
                .replace(/##/g, '')     // Remove ##
                .replace(/#/g, '')       // Remove #
                .replace(/```/g, '')    // Remove ```
                .replace(/`/g, '')      // Remove `
                .replace(/\[Image: /g, '') // Remove [Image: prefix
                .replace(/\]/g, '')     // Remove ] suffix
                .trim();
            }
          });
        }
        
        return parsed;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw JSON string:', jsonMatch[0]);
        throw new Error('Failed to parse AI response JSON');
      }
    } else {
      console.error('No JSON found in AI response:', text);
      throw new Error('No valid JSON response found from AI');
    }
  } catch (error) {
    console.error('Error editing slides:', error);
    throw new Error('Failed to edit slides. Please try again.');
  }
};

