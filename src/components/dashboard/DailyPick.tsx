import React from 'react';
import { DailyPick as DailyPickType } from '../../types/study';
import { Sparkles, ArrowRight } from 'lucide-react';

interface DailyPickProps {
  pick: DailyPickType | null;
}

const DailyPick: React.FC<DailyPickProps> = ({ pick }) => {
  if (!pick) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-6 shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="h-5 w-5 text-yellow-300" />
          <span className="text-sm font-bold uppercase tracking-wider text-blue-100">Daily Pick</span>
        </div>
        
        <h3 className="text-xl font-bold mb-1">{pick.set.title}</h3>
        <p className="text-blue-100 text-sm mb-4 line-clamp-2">
          {pick.message}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
               {pick.set.subject}
             </span>
             <span className="flex items-center text-xs font-medium text-yellow-300">
               ★ {pick.set.average_rating.toFixed(1)}
             </span>
          </div>
          
          <button className="flex items-center space-x-1 text-sm font-bold bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors">
            <span>Study Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
    </div>
  );
};

export default DailyPick;
