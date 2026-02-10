import React from 'react'
import { Flame, Trophy, Calendar, Clock, Bell, BookOpen } from 'lucide-react'
import { UserStats as UserStatsType } from '../../types/study'

interface UserStatsProps {
  stats: UserStatsType | null
}

const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {/* Streak */}
      <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center space-x-3">
        <div className="bg-orange-500 p-2 rounded-xl">
          <Flame className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Streak</p>
          <p className="text-xl font-black text-orange-900">{stats.streak} Days</p>
        </div>
      </div>

      {/* Level/XP */}
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-xl">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Level {stats.level}</p>
          <p className="text-xl font-black text-blue-900">{stats.total_xp.toLocaleString()} XP</p>
        </div>
      </div>

      {/* Cards Due */}
      <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex items-center space-x-3">
        <div className="bg-purple-600 p-2 rounded-xl">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Due Today</p>
          <p className="text-xl font-black text-purple-900">{stats.cards_due} Cards</p>
        </div>
      </div>

      {/* Minutes Studied */}
      <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center space-x-3">
        <div className="bg-green-600 p-2 rounded-xl">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Studied</p>
          <p className="text-xl font-black text-green-900">{stats.minutes_today} Min</p>
        </div>
      </div>

      {/* Pending Invites */}
      <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center space-x-3 relative">
        <div className="bg-red-500 p-2 rounded-xl">
          <Bell className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Invites</p>
          <p className="text-xl font-black text-red-900">{stats.pending_invites}</p>
        </div>
        {stats.pending_invites > 0 && (
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </div>

      {/* Quick Action / Progress */}
      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition-colors">
        <div className="bg-gray-900 p-2 rounded-xl">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Library</p>
          <p className="text-sm font-bold text-gray-900 leading-tight">Review All</p>
        </div>
      </div>
    </div>
  )
}

export default UserStats
