import React from 'react';
import { Modal } from '../../../features/common/components/ui/modal';
import { FiFileText, FiUser, FiTag, FiDownload, FiMessageSquare, FiX } from 'react-icons/fi';
import { BsLightbulb } from 'react-icons/bs';
import { FiAlertTriangle, FiHelpCircle, FiStar } from 'react-icons/fi';
import { MessageCell } from './MessageCell';
import type { SpeakUpItem } from '../types/speakupTypes';
import { useDownloadAttachmentQuery } from '../../../services/Speakup/downloadAttachment';

interface ViewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: SpeakUpItem | null;
}

export const ViewMessageModal: React.FC<ViewMessageModalProps> = ({
  isOpen,
  onClose,
  entry,
}) => {
  
  const { data: attachmentBlob, isLoading: isDownloadingAttachment } = useDownloadAttachmentQuery(
    { fileName: entry?.Attachment || "" },
    { skip: !entry?.Attachment || !isOpen }
  );

  if (!entry) return null;

  const getTypeIcon = (type: string) => {
    if (!type) return FiTag;
    const typeLower = type.toLowerCase();
    
    if (typeLower.includes('suggestion') || typeLower.includes('suggest')) {
      return BsLightbulb;
    } else if (typeLower.includes('complaint') || typeLower.includes('issue')) {
      return FiAlertTriangle;
    } else if (typeLower.includes('question') || typeLower.includes('query')) {
      return FiHelpCircle;
    } else if (typeLower.includes('feedback')) {
      return FiStar;
    } else if (typeLower.includes('report') || typeLower.includes('document')) {
      return FiFileText;
    } else {
      return FiMessageSquare;
    }
  };

  const getTypeIconColor = (type: string) => {
    if (!type) return 'text-gray-500';
    const typeLower = type.toLowerCase();
    
    if (typeLower.includes('suggestion') || typeLower.includes('suggest')) {
      return 'text-yellow-500';
    } else if (typeLower.includes('complaint') || typeLower.includes('issue')) {
      return 'text-red-500';
    } else if (typeLower.includes('question') || typeLower.includes('query')) {
      return 'text-blue-500';
    } else if (typeLower.includes('feedback')) {
      return 'text-purple-500';
    } else if (typeLower.includes('report') || typeLower.includes('document')) {
      return 'text-green-500';
    } else {
      return 'text-blue-500';
    }
  };

  const handleDownloadAttachment = () => {
    if (entry.Attachment && attachmentBlob) {
      // Create a download link for the attachment
      const url = window.URL.createObjectURL(attachmentBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = entry.Attachment;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl md:max-w-5xl lg:max-w-6xl rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl mx-4"
    >
      <div className="p-0 bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 md:px-6 lg:px-8 py-4 md:py-6 text-white flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight">
                View Message
              </h2>
              <p className="text-blue-100 mt-1 text-sm md:text-base">
                Detailed information about this Speak Up entry
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="bg-blue-400/20 px-3 py-2 rounded-full">
                  <span className="text-sm font-medium">ID: {entry.ID}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FiX className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="space-y-4 md:space-y-6">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                  {React.createElement(getTypeIcon(entry.SpeakUpType), {
                    className: `w-4 h-4 md:w-5 md:h-5 ${getTypeIconColor(entry.SpeakUpType)}`
                  })}
                  <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Entry Type
                  </h3>
                </div>
                <p className="text-gray-900 dark:text-white font-medium text-sm md:text-base lg:text-lg break-words">
                  {entry.SpeakUpType || 'N/A'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                  <FiUser className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                  <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Anonymous
                  </h3>
                </div>
                <p className="text-gray-900 dark:text-white font-medium text-sm md:text-base lg:text-lg">
                  {entry.IsAnonymous ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            {/* Message Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-3 md:px-4 lg:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiMessageSquare className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-500" />
                  Message
                </h3>
              </div>
              <div className="p-3 md:p-4 lg:p-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-600">
                  <MessageCell 
                    message={entry.Message} 
                    maxLength={100}
                    className="text-sm md:text-base font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Attachment Section */}
            {entry.Attachment && (
              <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-3 md:px-4 lg:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiDownload className="w-4 h-4 md:w-5 md:h-5 mr-2 text-purple-500" />
                    Attachment
                  </h3>
                </div>
                <div className="p-3 md:p-4 lg:p-6">
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-3">
                      <FiDownload className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.Attachment}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Click to download
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDownloadAttachment}
                      disabled={isDownloadingAttachment || !attachmentBlob}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiDownload className="h-4 w-4" />
                      {isDownloadingAttachment ? "Downloading..." : "Download"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!entry.Attachment && (
              <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-3 md:px-4 lg:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiDownload className="w-4 h-4 md:w-5 md:h-5 mr-2 text-purple-500" />
                    Attachment
                  </h3>
                </div>
                <div className="p-3 md:p-4 lg:p-6">
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No attachment available
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-4 md:px-6 lg:px-8 py-4 border-t border-gray-200 dark:border-gray-600 flex-shrink-0">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white rounded-lg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

