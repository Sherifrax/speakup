import React from 'react';
import { Modal } from '../../../features/common/components/ui/modal';
import { FiMessageSquare, FiX } from 'react-icons/fi';

interface MessagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

export const MessagePreviewModal: React.FC<MessagePreviewModalProps> = ({
  isOpen,
  onClose,
  message,
  title = "Message Preview"
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl md:max-w-3xl lg:max-w-4xl rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl mx-4"
    >
      <div className="p-0 bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 md:px-6 lg:px-8 py-4 md:py-6 text-white flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight flex items-center">
                <FiMessageSquare className="w-5 h-5 md:w-6 md:h-6 mr-3" />
                {title}
              </h2>
              <p className="text-blue-100 mt-1 text-sm md:text-base">
                Full message content
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-blue-200 hover:text-white transition-colors p-1 -mr-1"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-700">
            <div className="bg-white dark:bg-gray-700 rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-600">
              <div className="prose prose-sm md:prose-base max-w-none">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

