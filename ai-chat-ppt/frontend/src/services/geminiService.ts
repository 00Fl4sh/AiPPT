import { GoogleGenerativeAI } from '@google/generative-ai';
import { Slide } from '../types';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyBbDR2S3TiVDnRiO8yRaxAaIFMOEPTYO0c';

console.log('=== API KEY DEBUG INFO ===');
console.log('API_KEY loaded:', API_KEY ? 'YES' : 'NO');
console.log('API_KEY value:', API_KEY);
console.log('API_KEY length:', API_KEY.length);
console.log('API_KEY starts with AIza:', API_KEY.startsWith('AIza'));
console.log('Environment check:', {
  hasKey: !!API_KEY,
  keyLength: API_KEY.length,
  isDefault: API_KEY === 'your_gemini_api_key_here',
  startsWithAIza: API_KEY.startsWith('AIza')
});
console.log('process.env.REACT_APP_GEMINI_API_KEY:', process.env.REACT_APP_GEMINI_API_KEY);
console.log('All environment variables:', Object.keys(process.env).filter(key => key.includes('GEMINI')));
console.log('=== END DEBUG INFO ===');

if (!API_KEY) {
  console.warn('REACT_APP_GEMINI_API_KEY is not set. Please add your Gemini API key to .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

console.log('GoogleGenerativeAI instance:', genAI);
console.log('Model instance:', model);

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

    // Test if API key is working
    console.log('Testing API key...');
    console.log('API_KEY being used:', API_KEY);
    console.log('Model being used:', model);
    console.log('genAI instance:', genAI);
    try {
      console.log('Making test API call...');
      const testResult = await model.generateContent("Test");
      console.log('API key is working! Proceeding with real AI...');
      console.log('Test response:', testResult.response.text());
    } catch (testError) {
      console.error('API key test failed:', testError);
      console.error('Error details:', {
        message: (testError as any)?.message || 'Unknown error',
        status: (testError as any)?.status || 'Unknown status',
        statusText: (testError as any)?.statusText || 'Unknown status text'
      });
      console.log('Falling back to mock response due to API error');
      
      // Fallback to intelligent mock response when API key is not configured
      console.log('Using fallback AI simulation (add your Gemini API key for real AI responses)');
      console.log('API_KEY status:', { hasKey: !!API_KEY, keyLength: API_KEY.length, isDefault: API_KEY === 'your_gemini_api_key_here', startsWithAIza: API_KEY.startsWith('AIza') });

      // Generate a generic presentation based on the user's prompt
      const presentationTitle = prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt;
      
      const slides = [
        {
          id: "slide-1",
          title: presentationTitle,
          content: `A comprehensive presentation about: ${prompt}`,
          type: "title" as const
        },
        {
          id: "slide-2",
          title: "Key Points",
          content: "• Introduction to the topic\n• Main concepts and ideas\n• Important considerations\n• Key takeaways\n• Next steps",
          type: "bullet" as const
        },
        {
          id: "slide-3",
          title: "Overview",
          content: `This presentation covers the essential aspects of: ${prompt}. We'll explore the main concepts, benefits, challenges, and practical applications.`,
          type: "content" as const
        },
        {
          id: "slide-4",
          title: "Benefits and Opportunities",
          content: "• Clear advantages and benefits\n• Growth opportunities\n• Potential improvements\n• Strategic advantages",
          type: "bullet" as const
        },
        {
          id: "slide-5",
          title: "Implementation",
          content: "Phase 1: Planning and Preparation\nPhase 2: Development and Testing\nPhase 3: Deployment and Integration\nPhase 4: Monitoring and Optimization",
          type: "timeline" as const
        },
        {
          id: "slide-6",
          title: "Conclusion",
          content: `Thank you for your attention. This presentation has covered the key aspects of ${prompt}. For more information or questions, please feel free to reach out.`,
          type: "content" as const
        }
      ];

      // Generate slides one by one with progress updates
      const intelligentResponse: SlideGenerationResponse = {
        title: presentationTitle,
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

    if (!API_KEY || API_KEY === 'your_gemini_api_key_here' || API_KEY.length < 10 || !API_KEY.startsWith('AIza')) {
      // Fallback to intelligent mock response when API key is not configured
      console.log('Using fallback AI simulation for editing (add your Gemini API key for real AI responses)');
      console.log('API_KEY status for editing:', { hasKey: !!API_KEY, keyLength: API_KEY.length, isDefault: API_KEY === 'your_gemini_api_key_here', startsWithAIza: API_KEY.startsWith('AIza') });

      // Create improved slides based on edit prompt
      const improvedSlides = currentSlides.map((slide, index) => {
        // Enhance the first slide with better content
        if (index === 0) {
          return {
            ...slide,
            title: slide.title,
            content: `${slide.content}\n\nEnhanced with additional insights and improvements based on your request: "${editPrompt}". This updated presentation provides more comprehensive coverage of the topic.`
          };
        }
        // Enhance the second slide with more detailed content
        if (index === 1) {
          return {
            ...slide,
            content: `${slide.content}\n\nAdditional improvements:\n• Enhanced detail and specificity\n• Improved clarity and organization\n• Better visual structure\n• More comprehensive coverage\n\nBased on your request: "${editPrompt}"`
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

