import React from 'react'

interface PlaceholderPageProps {
  title: string
  description: string
  icon: React.ComponentType<any>
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description, 
  icon: Icon 
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Page Header */}
      <div className="px-1">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600">{description}</p>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white border border-gray-100 rounded-2xl sm:shadow-sm">
        <div className="px-4 py-12 sm:px-12 text-center">
          <div className="mx-auto h-20 w-20 sm:h-24 sm:w-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {title} Coming Soon
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            This section is currently under development. Check back soon for new features and functionality.
          </p>
          <div className="mt-8">
            <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
              Get Notified
            </button>
          </div>
        </div>
      </div>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6">
            <div className="h-4 bg-gray-100 rounded-lg mb-3 animate-pulse w-1/3"></div>
            <div className="h-3 bg-gray-50 rounded-lg mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-50 rounded-lg w-3/4 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlaceholderPage