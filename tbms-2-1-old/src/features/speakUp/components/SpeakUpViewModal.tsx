import React from 'react';
import { Modal } from '../../../components/ui/modal';
import { FiFileText, FiUser, FiTag, FiDownload, FiEdit, FiCheck, FiX, FiMessageSquare, FiClock } from 'react-icons/fi';
import { MessageCell } from './MessageCell';
import type { SpeakUpEntry, SpeakUpHistoryEntry } from '../types/speakUpTypes';
import { useGetSpeakUpHistoryQuery } from '../../../services/SpeakUp/getHistory';
import { useDownloadAttachmentQuery } from '../../../services/SpeakUp/downloadAttachment';

interface SpeakUpViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: SpeakUpEntry | null;
}

export const SpeakUpViewModal: React.FC<SpeakUpViewModalProps> = ({
  isOpen,
  onClose,
  entry,
}) => {
  
  const { data: historyData, isLoading: isLoadingHistory } = useGetSpeakUpHistoryQuery(
    { payload: entry?.encryptedData || "" },
    { skip: !entry?.encryptedData }
  );

  const { data: attachmentBlob, isLoading: isDownloadingAttachment } = useDownloadAttachmentQuery(
    { fileName: entry?.Attachment || "" },
    { skip: !entry?.Attachment }
  );

  if (!entry) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'closed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'under hr manager':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'assigned to employee':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <FiFileText className="w-4 h-4 text-blue-500" />;
      case 'closed':
        return <FiCheck className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <FiX className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <FiX className="w-4 h-4 text-orange-500" />;
      case 'under hr manager':
        return <FiUser className="w-4 h-4 text-yellow-500" />;
      case 'assigned to employee':
        return <FiUser className="w-4 h-4 text-purple-500" />;
      default:
        return <FiFileText className="w-4 h-4 text-gray-500" />;
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
                Speak Up Entry Details
              </h2>
              <p className="text-blue-100 mt-1 text-sm md:text-base">
                Detailed information about this Speak Up entry
              </p>
            </div>
            <div className="flex-shrink-0 mr-12 sm:mr-16">
              <div className="bg-blue-400/20 px-3 py-2 rounded-full">
                <span className="text-sm font-medium">ID: {entry.ID}</span>
              </div>
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
                  <FiMessageSquare className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
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
                  <FiTag className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                  <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Entry ID
                  </h3>
                </div>
                <p className="text-gray-900 dark:text-white font-medium text-sm md:text-base lg:text-lg break-words">
                  {entry.ID}
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

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                  <FiUser className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                  <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Approver
                  </h3>
                </div>
                <p className="text-gray-900 dark:text-white font-medium text-sm md:text-base lg:text-lg">
                  {entry.Approver || 'N/A'}
                </p>
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-3 md:px-4 lg:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  {getStatusIcon(entry.Status)}
                  <span className="ml-2">Status Information</span>
                </h3>
              </div>
              <div className="p-3 md:p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Current Status</div>
                    <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(entry.Status)}`}>
                      {entry.Status}
                    </span>
                  </div>
                  {entry.Approver && (
                    <div>
                      <div className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Approver</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        {entry.Approver}
                      </div>
                    </div>
                  )}
                </div>
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

            {/* Action Buttons Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-3 md:px-4 lg:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiEdit className="w-4 h-4 md:w-5 md:h-5 mr-2 text-indigo-500" />
                  Available Actions
                </h3>
              </div>
              <div className="p-3 md:p-4 lg:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {entry.EditBtn && (
                    <div className="flex items-center space-x-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <FiEdit className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-yellow-700 dark:text-yellow-300">Edit</span>
                    </div>
                  )}
                  {entry.SubmitBtn && (
                    <div className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <FiCheck className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-700 dark:text-green-300">Submit</span>
                    </div>
                  )}
                  {entry.CancelBtn && (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <FiX className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Cancel</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* History Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-3 md:px-4 lg:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiClock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-cyan-500" />
                  Entry History
                </h3>
              </div>
              <div className="p-3 md:p-4 lg:p-6">
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading history...</span>
                  </div>
                ) : historyData?.data && historyData.data.length > 0 ? (
                  <div className="space-y-4">
                    {historyData.data.map((historyItem: SpeakUpHistoryEntry, index: number) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {historyItem.Action}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {historyItem["Action On"]}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <FiUser className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {historyItem["Action By"]}
                              </span>
                            </div>
                            {historyItem.Comment && (
                              <div className="mt-2 p-2 bg-white dark:bg-gray-600 rounded text-sm text-gray-700 dark:text-gray-300">
                                {historyItem.Comment}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiClock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No history available for this entry
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
