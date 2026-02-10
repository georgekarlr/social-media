import React, { useState } from 'react'
import { 
  Image, 
  List, 
  FileText, 
  Brain, 
  Plus,
  Type,
  CheckSquare
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const CreatePost: React.FC = () => {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [activeTab, setActiveTab] = useState<'note' | 'flashcard' | 'quiz'>('note')

  return (
    <div className="bg-white border-b border-gray-100 p-4">
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
            {user?.email?.[0].toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {/* Content Type Tabs */}
          <div className="flex space-x-1 mb-3 bg-gray-50 p-1 rounded-lg w-fit">
            <button 
              onClick={() => setActiveTab('note')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-bold transition-all
                ${activeTab === 'note' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Note</span>
            </button>
            <button 
              onClick={() => setActiveTab('flashcard')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-bold transition-all
                ${activeTab === 'flashcard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Brain className="h-3.5 w-3.5" />
              <span>Flashcard</span>
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-bold transition-all
                ${activeTab === 'quiz' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span>Quiz</span>
            </button>
          </div>

          <textarea
            placeholder={
              activeTab === 'note' ? "Share a study note or cheat sheet (Markdown supported)..." :
              activeTab === 'flashcard' ? "Enter the front and back of your flashcard..." :
              "Create a multiple choice question..."
            }
            className="w-full border-none focus:ring-0 text-lg placeholder-gray-400 resize-none py-1 bg-transparent"
            rows={activeTab === 'note' ? 3 : 2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
            <div className="flex items-center space-x-1">
              <button className="p-2 rounded-full text-blue-500 hover:bg-blue-50 transition-colors" title="Add Image">
                <Image className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full text-blue-500 hover:bg-blue-50 transition-colors" title="Add Tag">
                <Plus className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full text-blue-500 hover:bg-blue-50 transition-colors" title="Text Style">
                <Type className="h-5 w-5" />
              </button>
            </div>
            <button 
              disabled={!content.trim()}
              className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-100"
            >
              Post {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
