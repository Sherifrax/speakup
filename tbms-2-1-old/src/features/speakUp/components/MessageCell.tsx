import React, { useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import { MessagePreviewModal } from './MessagePreviewModal';

interface MessageCellProps {
  message: string;
  maxLength?: number;
  className?: string;
}

export const MessageCell: React.FC<MessageCellProps> = ({
  message,
  maxLength = 15,
  className = ""
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle empty or null messages
  if (!message || message.trim() === '') {
    return <span className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>No message</span>;
  }

  const shouldTruncate = message.length > maxLength;
  const displayText = shouldTruncate ? message.substring(0, maxLength) + '...' : message;

  const handleClick = () => {
    if (shouldTruncate) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div 
        className={`text-sm text-gray-900 dark:text-white ${className} ${
          shouldTruncate 
            ? 'cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors' 
            : ''
        }`}
        onClick={handleClick}
        title={shouldTruncate ? 'Click to view full message' : ''}
      >
        <div className="flex items-center gap-2">
          {shouldTruncate && (
            <FiMessageSquare className="w-3 h-3 text-blue-500 flex-shrink-0" />
          )}
          <span className={shouldTruncate ? 'max-w-xs truncate' : 'break-words'}>
            {displayText}
          </span>
        </div>
      </div>

      <MessagePreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={message}
        title="Speak Up Message"
      />
    </>
  );
};
