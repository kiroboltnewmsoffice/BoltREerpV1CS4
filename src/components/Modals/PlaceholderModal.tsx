import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface PlaceholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
}

const PlaceholderModal: React.FC<PlaceholderModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  description = "This feature is currently under development. The modal will be available in a future update." 
}) => {
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Feature Coming Soon</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderModal;
