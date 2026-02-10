import React, { useState } from 'react'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'
import { Menu } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  console.log('Layout rendering')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen border-r border-gray-100">
          {/* Mobile Top Bar (Header replacement for mobile menu trigger) */}
          <div className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center px-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 ml-2">
              Ceintelly
            </h2>
          </div>
          
          {/* Page content */}
          <main className="flex-1 relative focus:outline-none">
            {children}
          </main>
        </div>

        {/* Right Sidebar - Desktop Only */}
        <RightSidebar />
      </div>
    </div>
  )
}

export default Layout