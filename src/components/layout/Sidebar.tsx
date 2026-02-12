import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Library, 
  Search, 
  Bell, 
  Trophy, 
  User, 
  Settings,
  LogOut,
  Plus,
  X
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import CreateSetModal from '../dashboard/CreateSetModal'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

type NavItem = {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavItem[] = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Explore', href: '/explore', icon: Search },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
  }


  return (
    <>
      {/* Backdrop - shown on all screen sizes when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:shadow-none lg:border-r lg:border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header - Mobile only close button */}
          <div className="flex items-center justify-between h-16 px-6 lg:hidden border-b border-gray-100">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Ceintelly</h1>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Logo - Desktop */}
          <div className="hidden lg:flex items-center h-16 px-6">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Ceintelly</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`
                    h-6 w-6 mr-4 flex-shrink-0
                    ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Profile Summary (Bottom) */}
          <div className="p-4 border-t border-gray-100">
             <button 
               onClick={() => setIsCreateModalOpen(true)}
               className="w-full mb-4 py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center space-x-2 active:scale-[0.98]"
             >
               <Plus className="h-5 w-5" />
               <span>Create New Set</span>
             </button>
             
             <div className="flex items-center justify-between px-2">
               <div className="flex items-center space-x-3 overflow-hidden">
                 <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                   {user?.email?.[0].toUpperCase()}
                 </div>
                 <div className="flex flex-col min-w-0">
                   <span className="text-sm font-bold text-gray-900 truncate">
                     {user?.email?.split('@')[0]}
                   </span>
                   <span className="text-xs text-gray-500 truncate">
                     {user?.email}
                   </span>
                 </div>
               </div>
               <button
                 onClick={handleLogout}
                 className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                 title="Sign out"
               >
                 <LogOut className="h-5 w-5" />
               </button>
             </div>
          </div>
        </div>
      </div>

      <CreateSetModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </>
  )
}

export default Sidebar