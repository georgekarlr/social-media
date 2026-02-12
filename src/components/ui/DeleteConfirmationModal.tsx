import React from 'react';
import Modal from './Modal';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center p-2">
        <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
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
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Permanently</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
