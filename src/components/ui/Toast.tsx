import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { ActionStatus } from '../../types/common';

interface ToastProps {
  id: string;
  status: ActionStatus;
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ id, status, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (status !== 'loading') {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, status, duration, onClose]);

  const statusStyles = {
    success: 'bg-white border-green-100 text-green-700 shadow-green-100/50',
    error: 'bg-white border-red-100 text-red-700 shadow-red-100/50',
    loading: 'bg-white border-blue-100 text-blue-700 shadow-blue-100/50',
    idle: 'bg-white border-gray-100 text-gray-700 shadow-gray-100/50',
  };

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    loading: Loader2,
    idle: () => null,
  }[status];

  return (
    <div className={`
      flex items-center p-4 min-w-[300px] max-w-md rounded-2xl border shadow-xl 
      animate-in slide-in-from-right-full duration-300 
      ${statusStyles[status]}
    `}>
      <div className="flex-shrink-0">
        <Icon className={`h-6 w-6 ${status === 'loading' ? 'animate-spin text-blue-500' : ''}`} />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-bold text-gray-900">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-4 flex-shrink-0 p-1 hover:bg-gray-50 rounded-full transition-colors text-gray-400"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
