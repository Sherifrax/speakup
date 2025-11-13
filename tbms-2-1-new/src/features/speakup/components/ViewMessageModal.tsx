import React from 'react';
import { Modal } from '../../../features/common/components/ui/modal';
import { FiFileText, FiUser, FiTag, FiDownload, FiMessageSquare, FiX } from 'react-icons/fi';
import { BsLightbulb } from 'react-icons/bs';
import { FiAlertTriangle, FiHelpCircle, FiStar } from 'react-icons/fi';
import type { SpeakUpItem } from '../types/speakupTypes';
import { useDownloadAttachmentMutation } from '../../../services/Speakup/downloadAttachment';

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
  
  const [downloadAttachment, { isLoading: isDownloadingAttachment }] = useDownloadAttachmentMutation();

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

  const handleDownloadAttachment = async () => {
    if (!entry.Attachment) return;
    
    try {
      const blob = await downloadAttachment({ fileName: entry.Attachment }).unwrap();
      // Create a download link for the attachment
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = entry.Attachment;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading attachment:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to download attachment. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="w-full max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
    >
      <div className="p-0 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl md:rounded-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 md:px-8 py-4 sm:py-5 text-white flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-2.5 bg-white/20 rounded-lg">
                <FiMessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight leading-tight">
                View Message
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <FiX className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 min-h-0">
          <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  {React.createElement(getTypeIcon(entry.SpeakUpType), {
                    className: `w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${getTypeIconColor(entry.SpeakUpType)}`
                  })}
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Entry Type
                  </h3>
                </div>
                <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base md:text-lg break-words leading-relaxed">
                  {entry.SpeakUpType || 'N/A'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Anonymous
                  </h3>
                </div>
                <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base md:text-lg break-words leading-relaxed">
                  {entry.IsAnonymous ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            {/* Message Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiMessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500 flex-shrink-0" />
                  Message
                </h3>
              </div>
              <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm sm:text-base md:text-lg font-medium leading-relaxed whitespace-pre-wrap break-words text-gray-900 dark:text-white">
                    {entry.Message || 'No message available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Attachment Section */}
            {entry.Attachment && (
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-4 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiDownload className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-500 flex-shrink-0" />
                    Attachment
                  </h3>
                </div>
                <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <FiDownload className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white break-words leading-relaxed">
                          {entry.Attachment}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Click to download
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDownloadAttachment}
                      disabled={isDownloadingAttachment}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium flex-shrink-0 w-full sm:w-auto"
                    >
                      <FiDownload className="h-4 w-4" />
                      <span>{isDownloadingAttachment ? "Downloading..." : "Download"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!entry.Attachment && (
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-4 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiDownload className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-500 flex-shrink-0" />
                    Attachment
                  </h3>
                </div>
                <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                  <div className="text-center py-4 sm:py-6 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    No attachment available
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-600 flex-shrink-0">
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

