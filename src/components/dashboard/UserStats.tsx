import React from 'react'
import { Link } from 'react-router-dom'
import { Flame, Trophy, Clock, BookOpen } from 'lucide-react'
import { UserStats as UserStatsType } from '../../types/study'

interface UserStatsProps {
  stats: UserStatsType | null
}

const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {/* Streak */}
      <div className="bg-orange-50 p-3 sm:p-4 rounded-2xl border border-orange-100 flex items-center space-x-3">
        <div className="bg-orange-500 p-1.5 sm:p-2 rounded-xl flex-shrink-0">
          <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider truncate">Streak</p>
          <p className="text-lg sm:text-xl font-black text-orange-900 truncate">{stats.streak} Days</p>
        </div>
      </div>

      {/* Level/XP */}
      <div className="bg-blue-50 p-3 sm:p-4 rounded-2xl border border-blue-100 flex items-center space-x-3">
        <div className="bg-blue-600 p-1.5 sm:p-2 rounded-xl flex-shrink-0">
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider truncate">Level {stats.level}</p>
          <p className="text-lg sm:text-xl font-black text-blue-900 truncate">{stats.total_xp.toLocaleString()} XP</p>
        </div>
      </div>

      {/* Minutes Studied */}
      <div className="bg-green-50 p-3 sm:p-4 rounded-2xl border border-green-100 flex items-center space-x-3">
        <div className="bg-green-600 p-1.5 sm:p-2 rounded-xl flex-shrink-0">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wider truncate">Studied</p>
          <p className="text-lg sm:text-xl font-black text-green-900 truncate">{stats.minutes_today} Min</p>
        </div>
      </div>

      {/* Quick Action / Progress */}
      <Link 
        to="/library"
        className="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-100 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <div className="bg-gray-900 p-1.5 sm:p-2 rounded-xl flex-shrink-0">
          <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider truncate">Library</p>
          <p className="text-sm font-bold text-gray-900 leading-tight truncate">Review All</p>
        </div>
      </Link>
    </div>
  )
}

export default UserStats
