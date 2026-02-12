import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Plus, Library, User } from 'lucide-react'

interface BottomNavProps {
  onCreateClick: () => void
}

const BottomNav: React.FC<BottomNavProps> = ({ onCreateClick }) => {
  const location = useLocation()

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Explore', href: '/explore', icon: Search },
    { name: 'Library', href: '/library', icon: Library },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-2 pb-[env(safe-area-inset-bottom)] z-50">
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {navItems.slice(0, 2).map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center p-2 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          )
        })}

        {/* Create FAB */}
        <div className="flex flex-col items-center -mt-8">
          <button
            onClick={onCreateClick}
            className="h-14 w-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 border-4 border-white active:scale-95 transition-transform"
            aria-label="Create new set"
          >
            <Plus className="h-8 w-8" />
          </button>
          <span className="text-xs mt-1 font-medium text-gray-400">Create</span>
        </div>

        {navItems.slice(2).map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center p-2 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNav
