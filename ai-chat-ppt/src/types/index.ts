export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isEditResult?: boolean;
  editedSlide?: any;
  originalSlide?: any;
}

export interface Slide {
  id: string;
  title: string;
  content: string;
  type: 'title' | 'content' | 'bullet' | 'image' | 'swot' | 'timeline' | 'metrics' | 'pros-cons' | 'three-column';
}

export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  createdAt: Date;
}

export interface ChatHistory {
  id: string;
  messages: Message[];
  presentation?: Presentation;
  createdAt: Date;
}


