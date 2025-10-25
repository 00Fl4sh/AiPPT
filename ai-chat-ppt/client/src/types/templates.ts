export interface PresentationTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'academic' | 'creative' | 'minimal' | 'modern';
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  layout: {
    titleFont: string;
    contentFont: string;
    titleSize: number;
    contentSize: number;
    spacing: number;
  };
}

export const PRESENTATION_TEMPLATES: PresentationTemplate[] = [
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    description: 'Luxury business template with gold accents and premium typography',
    category: 'business',
    preview: '👑',
    colors: {
      primary: '#1a1a1a',
      secondary: '#d4af37',
      accent: '#f4d03f',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
      text: '#1a1a1a'
    },
    layout: {
      titleFont: 'Playfair Display, serif',
      contentFont: 'Inter, sans-serif',
      titleSize: 48,
      contentSize: 20,
      spacing: 32
    }
  },
  {
    id: 'tech-innovation',
    name: 'Tech Innovation',
    description: 'Cutting-edge template for technology and startup presentations',
    category: 'modern',
    preview: '🚀',
    colors: {
      primary: '#0f172a',
      secondary: '#3b82f6',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      text: '#f8fafc'
    },
    layout: {
      titleFont: 'Inter, sans-serif',
      contentFont: 'Inter, sans-serif',
      titleSize: 44,
      contentSize: 18,
      spacing: 28
    }
  },
  {
    id: 'medical-professional',
    name: 'Medical Professional',
    description: 'Clean medical template perfect for healthcare presentations',
    category: 'academic',
    preview: '🏥',
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#34d399',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
      text: '#064e3b'
    },
    layout: {
      titleFont: 'Inter, sans-serif',
      contentFont: 'Inter, sans-serif',
      titleSize: 42,
      contentSize: 19,
      spacing: 26
    }
  },
  {
    id: 'creative-agency',
    name: 'Creative Agency',
    description: 'Bold and vibrant template for creative agencies and artists',
    category: 'creative',
    preview: '🎨',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#c084fc',
      background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)',
      text: '#1f2937'
    },
    layout: {
      titleFont: 'Playfair Display, serif',
      contentFont: 'Inter, sans-serif',
      titleSize: 46,
      contentSize: 20,
      spacing: 30
    }
  },
  {
    id: 'finance-luxury',
    name: 'Finance Luxury',
    description: 'Sophisticated template for financial and investment presentations',
    category: 'business',
    preview: '💎',
    colors: {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#6b7280',
      background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
      text: '#111827'
    },
    layout: {
      titleFont: 'Inter, sans-serif',
      contentFont: 'Inter, sans-serif',
      titleSize: 40,
      contentSize: 18,
      spacing: 24
    }
  },
  {
    id: 'startup-energy',
    name: 'Startup Energy',
    description: 'Dynamic template with vibrant colors for startup pitches',
    category: 'modern',
    preview: '⚡',
    colors: {
      primary: '#ea580c',
      secondary: '#f97316',
      accent: '#fb923c',
      background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
      text: '#1f2937'
    },
    layout: {
      titleFont: 'Inter, sans-serif',
      contentFont: 'Inter, sans-serif',
      titleSize: 44,
      contentSize: 19,
      spacing: 28
    }
  },
  {
    id: 'academic-research',
    name: 'Academic Research',
    description: 'Professional template for academic and research presentations',
    category: 'academic',
    preview: '🔬',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
      text: '#1e3a8a'
    },
    layout: {
      titleFont: 'Inter, sans-serif',
      contentFont: 'Inter, sans-serif',
      titleSize: 38,
      contentSize: 17,
      spacing: 22
    }
  },
  {
    id: 'minimal-elegance',
    name: 'Minimal Elegance',
    description: 'Ultra-clean template with perfect typography and spacing',
    category: 'minimal',
    preview: '✨',
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#9ca3af',
      background: '#ffffff',
      text: '#111827'
    },
    layout: {
      titleFont: 'Inter, sans-serif',
      contentFont: 'Inter, sans-serif',
      titleSize: 36,
      contentSize: 16,
      spacing: 20
    }
  },
  {
    id: 'dark-premium',
    name: 'Dark Premium',
    description: 'Sophisticated dark theme with premium feel',
    category: 'modern',
    preview: '🌙',
    colors: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#334155',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      text: '#f8fafc'
    },
    layout: {
      titleFont: 'Playfair Display, serif',
      contentFont: 'Inter, sans-serif',
      titleSize: 42,
      contentSize: 18,
      spacing: 26
    }
  },
  {
    id: 'gradient-modern',
    name: 'Gradient Modern',
    description: 'Contemporary template with beautiful gradients',
    category: 'modern',
    preview: '🌈',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      text: '#ffffff'
    },
    layout: {
      titleFont: 'Inter, sans-serif',
      contentFont: 'Inter, sans-serif',
      titleSize: 46,
      contentSize: 20,
      spacing: 30
    }
  }
];
