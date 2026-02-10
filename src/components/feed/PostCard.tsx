import React from 'react'
import { MessageSquare, Heart, Share2, MoreHorizontal, Brain, CheckSquare, FileText, Bookmark } from 'lucide-react'

interface PostCardProps {
  post: {
    id: string
    type?: 'flashcard' | 'quiz' | 'note'
    author: {
      name: string
      username: string
      avatar: string
    }
    content: string
    timestamp: string
    likes: number
    comments: number
    shares: number
    image?: string
    metadata?: any
  }
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const renderContent = () => {
    switch (post.type) {
      case 'flashcard':
        return (
          <div className="mt-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 text-center shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-4">{post.content}</p>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4 transition-colors">
              Flip to see back
            </button>
          </div>
        )
      case 'quiz':
        return (
          <div className="mt-3 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center space-x-2 mb-4 text-orange-600">
              <CheckSquare className="h-5 w-5" />
              <span className="text-sm font-bold">Quick Quiz</span>
            </div>
            <p className="text-[15px] font-bold text-gray-900 mb-4">{post.content}</p>
            <div className="space-y-2">
              {['A', 'B', 'C', 'D'].map((opt) => (
                <button key={opt} className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium text-gray-700">
                  <span className="font-bold mr-2 text-blue-600">{opt}.</span>
                  Option placeholder text
                </button>
              ))}
            </div>
          </div>
        )
      case 'note':
      default:
        return (
          <>
            <div className="mt-1 text-gray-900 text-[15px] leading-normal whitespace-pre-wrap">
              {post.content}
            </div>
            {post.image && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-gray-100">
                <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
              </div>
            )}
          </>
        )
    }
  }

  return (
    <div className="bg-white border-b border-gray-100 p-4 hover:bg-gray-50/50 transition-colors cursor-pointer">
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {post.author.avatar}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 min-w-0">
              <span className="font-bold text-gray-900 truncate hover:underline">{post.author.name}</span>
              <span className="text-gray-500 text-sm truncate">{post.author.username}</span>
              <span className="text-gray-400 text-sm">·</span>
              <span className="text-gray-500 text-sm truncate">{post.timestamp}</span>
            </div>
            <button className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-blue-50 transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          {renderContent()}

          {/* Interactions */}
          <div className="mt-4 flex items-center justify-between max-w-md text-gray-500">
            <button className="flex items-center space-x-2 group transition-colors hover:text-blue-500">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <MessageSquare className="h-5 w-5" />
              </div>
              <span className="text-sm">{post.comments}</span>
            </button>
            <button className="flex items-center space-x-2 group transition-colors hover:text-green-500">
              <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <Share2 className="h-5 w-5" />
              </div>
              <span className="text-sm">{post.shares}</span>
            </button>
            <button className="flex items-center space-x-2 group transition-colors hover:text-red-500">
              <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                <Heart className="h-5 w-5" />
              </div>
              <span className="text-sm">{post.likes}</span>
            </button>
            <button className="flex items-center space-x-2 group transition-colors hover:text-blue-500">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <Bookmark className="h-5 w-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
