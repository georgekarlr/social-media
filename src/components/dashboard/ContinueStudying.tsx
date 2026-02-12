import React from 'react';
import { ContinueStudyingItem } from '../../types/study';
import { Play, Clock } from 'lucide-react';

interface ContinueStudyingProps {
  items: ContinueStudyingItem[];
  onPlay?: (setId: string) => void;
  onSeeAll?: () => void;
}

const ContinueStudying: React.FC<ContinueStudyingProps> = ({ items, onPlay, onSeeAll }) => {
  if (items.length === 0) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Continue Studying</h2>
        <button onClick={onSeeAll} className="text-sm font-semibold text-blue-600 hover:text-blue-700">See all</button>
      </div>
      
      <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onPlay?.(item.id)}
            className="flex-shrink-0 w-56 sm:w-64 bg-white border border-gray-100 rounded-xl p-3 sm:p-4 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-50 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                {item.emoji || '📚'}
              </div>
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Play className="h-3 w-3 sm:h-4 sm:w-4 fill-current ml-0.5" />
              </div>
            </div>
            
            <h4 className="text-base font-bold text-gray-900 mb-1 truncate">{item.title}</h4>
            <p className="text-sm text-gray-500 mb-3">{item.subject}</p>
            
            <div className="flex items-center text-xs text-gray-400 font-medium">
              <Clock className="h-3 w-3 mr-1" />
              <span className="truncate">
                {formatDate(item.last_active)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueStudying;
