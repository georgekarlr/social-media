import React from 'react';
import { ChatMessage } from '../../types/message';
import { formatDistanceToNow } from 'date-fns';
import { BookOpen } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div className={`flex flex-col mb-4 ${message.is_mine ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
          message.is_mine
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        
        {message.shared_set && (
          <div className={`mt-2 p-3 rounded-xl border flex items-center space-x-3 ${
            message.is_mine ? 'bg-blue-700/50 border-blue-500' : 'bg-gray-50 border-gray-100'
          }`}>
            <div className={`p-2 rounded-lg ${message.is_mine ? 'bg-blue-500' : 'bg-blue-100'}`}>
              <BookOpen className={`h-4 w-4 ${message.is_mine ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold truncate ${message.is_mine ? 'text-white' : 'text-gray-900'}`}>
                {message.shared_set.title}
              </p>
              <p className={`text-[10px] ${message.is_mine ? 'text-blue-100' : 'text-gray-500'}`}>
                {message.shared_set.cards_count} cards
              </p>
            </div>
          </div>
        )}
      </div>
      <span className="text-[10px] text-gray-400 mt-1 px-1">
        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
      </span>
    </div>
  );
};

export default MessageBubble;
