import React from 'react';
import { Modal } from '../../../common/components/ui/modal';
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
      showCloseButton={false}
      className="w-full max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
    >
      <div className="p-0 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl md:rounded-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 text-white flex-shrink-0 pr-12 sm:pr-4 md:pr-6 lg:pr-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight leading-tight flex items-center flex-wrap gap-2">
              <FiMessageSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
              <span className="break-words">{title}</span>
            </h2>
            <p className="text-blue-100 mt-1 text-xs sm:text-sm md:text-base leading-relaxed">
              Full message content
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute right-2 sm:right-3 md:right-4 top-2 sm:top-3 md:top-4 text-blue-200 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-white/20 rounded-lg flex-shrink-0 z-10"
            aria-label="Close modal"
          >
            <FiX className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 min-h-0">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-200 dark:border-gray-700">
            <div className="bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-200 dark:border-gray-600">
              <p className="text-sm sm:text-base md:text-lg text-gray-900 dark:text-gray-200 leading-relaxed whitespace-pre-wrap break-words font-medium">
                {message || 'No message available'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-700 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white rounded-lg transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

