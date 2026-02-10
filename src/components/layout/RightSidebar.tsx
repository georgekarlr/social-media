import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, MoreHorizontal, Trophy, Star, Search, Loader2 } from 'lucide-react'
import { studyService } from '../../services/studyService'
import { StudySet } from '../../types/study'

const RightSidebar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<StudySet[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 2) {
        setIsSearching(true)
        try {
          const results = await studyService.searchStudySets(searchTerm)
          setSearchResults(results)
        } catch (err) {
          console.error('Search failed:', err)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const topDecks = [
    { name: 'Organic Chemistry II', category: 'Science', views: '2.5K' },
    { name: 'World History: 1945-Present', category: 'History', views: '1.8K' },
    { name: 'React Advanced Patterns', category: 'Programming', views: '1.2K' },
    { name: 'Macroeconomics 101', category: 'Economics', views: '950' },
  ]

  const leaderboard = [
    { name: 'John Doe', xp: '12,450', rank: 1, avatar: 'JD' },
    { name: 'Jane Smith', xp: '10,200', rank: 2, avatar: 'JS' },
    { name: 'Alice Johnson', xp: '9,800', rank: 3, avatar: 'AJ' },
  ]

  return (
    <div className="hidden xl:block w-80 p-4 space-y-6">
      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search study sets..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-100 border-none rounded-full py-3 pl-12 pr-10 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />
        )}

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
            <div className="p-2 space-y-1">
              {searchResults.map((result) => (
                <div key={result.id} className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group">
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 truncate">{result.title}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                    {result.average_rating.toFixed(1)} rating
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trending Section */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center text-gray-900">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Top Study Decks
          </h2>
        </div>
        <div className="space-y-4">
          {topDecks.map((deck) => (
            <div key={deck.name} className="group cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500">{deck.category}</p>
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{deck.name}</p>
                  <p className="text-xs text-gray-500">{deck.views} learners</p>
                </div>
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 text-blue-600 text-sm font-semibold hover:text-blue-700">
          Show more
        </button>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <h2 className="text-xl font-bold flex items-center mb-4 text-gray-900">
          <Trophy className="h-5 w-5 mr-2 text-blue-600" />
          Weekly Leaderboard
        </h2>
        <div className="space-y-4">
          {leaderboard.map((user) => (
            <div key={user.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                    {user.avatar}
                  </div>
                  <div className={`absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm
                    ${user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                    {user.rank}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{user.name}</p>
                  <p className="text-xs text-gray-500 leading-tight">{user.xp} XP</p>
                </div>
              </div>
              <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                Lv. {Math.floor(parseInt(user.xp.replace(',', '')) / 1000)}
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 text-blue-600 text-sm font-semibold hover:text-blue-700">
          Full Leaderboard
        </button>
      </div>

      {/* Footer Links */}
      <div className="px-4 text-xs text-gray-500 space-x-3">
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Cookie Policy</a>
        <p className="mt-2">© 2026 Ceintelly, Inc.</p>
      </div>
    </div>
  )
}

export default RightSidebar
