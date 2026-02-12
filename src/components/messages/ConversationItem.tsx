import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Conversation } from '../../types/message';
import { Circle } from 'lucide-react';

interface ConversationItemProps {
  conversation: Conversation;
  onClick: () => void;
  isActive: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, onClick, isActive }) => {
  const { other_user, last_message, unread_count, updated_at } = conversation;

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-4 cursor-pointer transition-colors border-b border-gray-100 last:border-0 hover:bg-gray-50 ${
        isActive ? 'bg-blue-50/50' : ''
      }`}
    >
      <div className="relative flex-shrink-0">
        {other_user.avatar_url ? (
          <img
            src={other_user.avatar_url}
            alt={other_user.username}
            className="h-12 w-12 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
            {other_user.username[0].toUpperCase()}
          </div>
        )}
        {other_user.is_online && (
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`text-sm font-bold truncate ${unread_count > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
            {other_user.username}
          </h3>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
            {formatDistanceToNow(new Date(updated_at), { addSuffix: false })}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <p className={`text-sm truncate mr-2 ${unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            {last_message ? (
              <>
                {last_message.is_mine ? 'You: ' : ''}
                {last_message.content}
              </>
            ) : (
              'No messages yet'
            )}
          </p>
          {unread_count > 0 && (
            <div className="flex-shrink-0 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {unread_count}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
