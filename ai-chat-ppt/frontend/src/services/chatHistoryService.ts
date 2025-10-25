import { ChatHistory, Message, Presentation } from '../types';

const CHAT_HISTORY_KEY = 'ai-chat-ppt-history';

export const saveChatHistory = (messages: Message[], presentation?: Presentation): void => {
  const existingHistory = getChatHistory();

  // Check if this is a duplicate chat (same presentation title and similar message count)
  const isDuplicate = existingHistory.some(chat => {
    if (!presentation || !chat.presentation) return false;

    // Check if presentation titles match
    const sameTitle = chat.presentation.title === presentation.title;

    // Check if message count is similar (within 2 messages)
    const similarMessageCount = Math.abs(chat.messages.length - messages.length) <= 2;

    // Check if the first user message is the same (to catch same prompts)
    const firstUserMessage = messages.find(m => m.role === 'user');
    const existingFirstUserMessage = chat.messages.find(m => m.role === 'user');
    const sameFirstMessage = firstUserMessage && existingFirstUserMessage &&
      firstUserMessage.content === existingFirstUserMessage.content;

    return sameTitle && (similarMessageCount || sameFirstMessage);
  });

  if (isDuplicate) {
    console.log('Duplicate chat detected, not saving to history');
    return;
  }

  const chatHistory: ChatHistory = {
    id: Date.now().toString(),
    messages,
    presentation,
    createdAt: new Date()
  };

  console.log('Existing history:', existingHistory.length, 'chats');
  console.log('New chat:', chatHistory.id, 'with', messages.length, 'messages');

  const updatedHistory = [chatHistory, ...existingHistory].slice(0, 10); // Keep only last 10 chats

  console.log('Updated history:', updatedHistory.length, 'chats');
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const getChatHistory = (): ChatHistory[] => {
  try {
    const history = localStorage.getItem(CHAT_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

export const clearChatHistory = (): void => {
  localStorage.removeItem(CHAT_HISTORY_KEY);
};

export const deleteChatHistory = (chatId: string): void => {
  const history = getChatHistory();
  const updatedHistory = history.filter(chat => chat.id !== chatId);
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedHistory));
};

