import React from 'react';
import { RecommendedUser } from '../../types/study';
import { UserPlus } from 'lucide-react';

interface RecommendationCardProps {
  user: RecommendedUser;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ user }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 mb-3">
      <div className="flex items-center space-x-3">
        {user.avatar ? (
          <img src={user.avatar} alt={user.username || 'User'} className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
            {(user.username || 'User').substring(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-bold text-gray-900">{user.username || 'Anonymous'}</p>
          <p className="text-xs text-gray-500">{user.xp.toLocaleString()} XP • Suggested for you</p>
        </div>
      </div>
      
      <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors flex items-center space-x-1">
        <UserPlus className="h-4 w-4" />
        <span>Follow</span>
      </button>
    </div>
  );
};

export default RecommendationCard;
