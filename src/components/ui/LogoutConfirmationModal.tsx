import React from 'react';
import Modal from './Modal';
import { LogOut, Loader2 } from 'lucide-react';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign Out">
      <div className="flex flex-col items-center text-center p-2">
        <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <LogOut className="h-8 w-8 text-red-600" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          You are about to sign out of your account. You will need to sign in again to access your data.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                <span>Signing out...</span>
              </>
            ) : (
              <span>Sign Out</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirmationModal;
