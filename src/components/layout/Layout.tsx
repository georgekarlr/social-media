import React, { useState } from 'react'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'
import BottomNav from './BottomNav'
import CreateSetModal from '../dashboard/CreateSetModal'
import { Bell, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  console.log('Layout rendering')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar */}
        <Sidebar isOpen={false} onClose={() => {}} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen border-r border-gray-100 pb-28 lg:pb-0 min-w-0">
          {/* Mobile Top Bar */}
          <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-4">
            <h2 className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Ceintelly
            </h2>
            <div className="flex items-center space-x-2">
              <Link
                to="/leaderboard"
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Leaderboard"
              >
                <Trophy className="h-6 w-6" />
              </Link>
              <Link
                to="/notifications"
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-6 w-6" />
              </Link>
            </div>
          </div>
          
          {/* Page content */}
          <main className="flex-1 relative focus:outline-none">
            {children}
          </main>
        </div>

        {/* Right Sidebar - Desktop Only */}
        <RightSidebar />
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onCreateClick={() => setIsCreateModalOpen(true)} />

      {/* Create Set Modal */}
      <CreateSetModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  )
}

export default Layout