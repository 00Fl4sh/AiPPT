import React from 'react';
import { ChatHistory } from '../types';
import { Clock, Trash2, MessageSquare } from 'lucide-react';

interface ChatHistoryProps {
  history: ChatHistory[];
  onLoadChat: (chat: ChatHistory) => void;
  onDeleteChat: (chatId: string) => void;
}

const ChatHistoryComponent: React.FC<ChatHistoryProps> = ({ 
  history, 
  onLoadChat, 
  onDeleteChat 
}) => {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (history.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No chat history yet</p>
        <p className="text-sm">Start a conversation to see your history here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((chat) => (
        <div
          key={chat.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onLoadChat(chat)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 truncate">
                {chat.presentation?.title || 'Chat Conversation'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''}
                {chat.presentation && ` • ${chat.presentation.slides.length} slides`}
              </p>
              
              {/* Show preview of chat messages */}
              <div className="mt-2 space-y-1">
                {chat.messages.slice(0, 2).map((message, index) => (
                  <div key={message.id} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                    <span className="font-medium text-gray-700">
                      {message.role === 'user' ? 'You' : 'AI'}:
                    </span>
                    <span className="ml-1">
                      {message.content.length > 50 
                        ? message.content.substring(0, 50) + '...' 
                        : message.content}
                    </span>
                  </div>
                ))}
                {chat.messages.length > 2 && (
                  <div className="text-xs text-gray-400 italic">
                    +{chat.messages.length - 2} more messages...
                  </div>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-400 mt-2">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(chat.createdAt)}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistoryComponent;

