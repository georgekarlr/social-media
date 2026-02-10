import React, { useEffect, useState } from 'react'
import CreatePost from '../components/feed/CreatePost'
import PostCard from '../components/feed/PostCard'
import { studyService } from '../services/studyService'
import { HomeDashboardResponse, FeedItem, RecommendedUser } from '../types/study'
import DailyPick from '../components/dashboard/DailyPick'
import ContinueStudying from '../components/dashboard/ContinueStudying'
import RecommendationCard from '../components/dashboard/RecommendationCard'
import UserStats from '../components/dashboard/UserStats'
import CreateSetModal from '../components/dashboard/CreateSetModal'
import { Loader2, Plus } from 'lucide-react'

const FeedPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<HomeDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const data = await studyService.getHomeDashboard()
        setDashboardData(data)
      } catch (err) {
        console.error('Failed to fetch dashboard:', err)
        setError('Failed to load your dashboard. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  console.log('FeedPage rendering')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-blue-600 font-bold hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto lg:mx-0 p-4">
      {/* Feed Tabs */}
      <div className="flex border-b border-gray-100 sticky top-0 lg:top-0 bg-white/80 backdrop-blur-md z-20 mb-6">
        <button className="flex-1 py-4 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors border-b-4 border-blue-600">
          For You
        </button>
        <button className="flex-1 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors border-b-4 border-transparent">
          Following
        </button>
      </div>

      {dashboardData?.user_stats && <UserStats stats={dashboardData.user_stats} />}

      {dashboardData?.daily_pick && <DailyPick pick={dashboardData.daily_pick} />}

      {/* Trigger for the new modal */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full mb-6 p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:bg-gray-50 transition-colors group"
      >
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
            <Plus className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-900">Create a new study set</p>
            <p className="text-xs text-gray-500">Add flashcards, quizzes, or notes</p>
          </div>
        </div>
        <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md shadow-blue-100">
          Quick Create
        </div>
      </button>

      <CreateSetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {dashboardData?.continue_studying && dashboardData.continue_studying.length > 0 && (
        <ContinueStudying items={dashboardData.continue_studying} />
      )}

      {/* Create Post Area */}
      <div className="mb-8">
        <CreatePost />
      </div>

      {/* Feed Content */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-gray-900 px-1">
          {dashboardData?.feed_type === 'following' ? 'Your Feed' : 'Recommended for You'}
        </h2>
        
        <div className="divide-y divide-gray-100">
          {dashboardData?.feed_content.map((item, index) => {
            if (item.type === 'feed') {
              const feedItem = item as FeedItem;
              // Map FeedItem to PostCard format
              const post = {
                id: feedItem.set_id,
                type: 'study_set',
                author: {
                  name: feedItem.creator.username || 'Anonymous',
                  username: feedItem.creator.username ? `@${feedItem.creator.username}` : '@anonymous',
                  avatar: feedItem.creator.avatar || (feedItem.creator.username ? feedItem.creator.username.substring(0, 2).toUpperCase() : '??')
                },
                content: `Created a new study set: ${feedItem.title}`,
                timestamp: 'Recent',
                likes: 0,
                comments: 0,
                shares: 0
              };
              return <PostCard key={`${feedItem.set_id}-${index}`} post={post} />;
            } else {
              return <RecommendationCard key={`${(item as RecommendedUser).user_id}-${index}`} user={item as RecommendedUser} />;
            }
          })}

          {dashboardData?.feed_content.length === 0 && (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl">
              <p>Nothing to show here yet. Start following people to see their activity!</p>
            </div>
          )}
        </div>
      </div>

      {/* Loading Footer */}
      <div className="p-8 text-center text-gray-500">
        <p className="text-sm">You've reached the end of your feed.</p>
        <button className="mt-4 text-blue-600 font-bold hover:underline">
          Back to top
        </button>
      </div>
    </div>
  )
}

export default FeedPage
