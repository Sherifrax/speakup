import React, { useState } from 'react';
import { FiPlus, FiMinus, FiMoreVertical, FiFileText, FiUser, FiMessageSquare, FiAlertTriangle, FiHelpCircle, FiStar, FiPaperclip, FiUserCheck, FiTag, FiChevronDown, FiDownload } from 'react-icons/fi';
import { BsLightbulb } from 'react-icons/bs';
import { Dropdown } from 'antd';
import { SpeakUpActionMenu } from './SpeakUpActionMenu';
import { MessageCell } from './MessageCell';
import { MessagePreviewModal } from './MessagePreviewModal';
import { useDownloadAttachmentMutation } from '../../../services/Speakup/downloadAttachment';
import type { SpeakUpItem } from '../types/speakupTypes';

interface SpeakUpMobileCardProps {
  entry: SpeakUpItem;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (entry: SpeakUpItem) => void;
  onView: (entry: SpeakUpItem) => void;
  onDelete: (entry: SpeakUpItem) => void;
  onApprove: (entry: SpeakUpItem) => void;
  onReject: (entry: SpeakUpItem) => void;
  onCancel: (entry: SpeakUpItem) => void;
  onSubmit: (entry: SpeakUpItem) => void;
  onViewHistory: (entry: SpeakUpItem) => void;
  isEndUser?: boolean;
}

export const SpeakUpMobileCard: React.FC<SpeakUpMobileCardProps> = ({
  entry,
  isExpanded,
  onToggle,
  onEdit,
  onView,
  onDelete,
  onApprove,
  onReject,
  onCancel,
  onSubmit,
  onViewHistory,
  isEndUser = true,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [downloadAttachment, { isLoading: isDownloadingAttachment }] = useDownloadAttachmentMutation();

  const handleDownloadAttachment = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!entry.Attachment) return;
    
    try {
      const blob = await downloadAttachment({ fileName: entry.Attachment }).unwrap();
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
      alert("Failed to download attachment. Please try again.");
    }
  };
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200 dark:border-blue-800';
      case 'closed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200 dark:border-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-200 dark:border-red-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-200 dark:border-red-800';
      case 'under hr manager':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
      case 'assigned to employee':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 border-purple-200 dark:border-purple-800';
      default:
        if (statusLower.includes('awaiting') && (statusLower.includes('approval') || statusLower.includes('es') || statusLower.includes('payroll'))) {
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200 dark:border-green-800';
        }
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200 border-gray-200 dark:border-gray-800';
    }
  };

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
      return 'text-yellow-600 dark:text-yellow-400';
    } else if (typeLower.includes('complaint') || typeLower.includes('issue')) {
      return 'text-red-600 dark:text-red-400';
    } else if (typeLower.includes('question') || typeLower.includes('query')) {
      return 'text-blue-600 dark:text-blue-400';
    } else if (typeLower.includes('feedback')) {
      return 'text-purple-600 dark:text-purple-400';
    } else if (typeLower.includes('report') || typeLower.includes('document')) {
      return 'text-green-600 dark:text-green-400';
    } else {
      return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getTypeIconBgColor = (type: string) => {
    if (!type) return 'bg-gray-100 dark:bg-gray-700/50';
    const typeLower = type.toLowerCase();
    
    if (typeLower.includes('suggestion') || typeLower.includes('suggest')) {
      return 'bg-yellow-100 dark:bg-yellow-900/30';
    } else if (typeLower.includes('complaint') || typeLower.includes('issue')) {
      return 'bg-red-100 dark:bg-red-900/30';
    } else if (typeLower.includes('question') || typeLower.includes('query')) {
      return 'bg-blue-100 dark:bg-blue-900/30';
    } else if (typeLower.includes('feedback')) {
      return 'bg-purple-100 dark:bg-purple-900/30';
    } else if (typeLower.includes('report') || typeLower.includes('document')) {
      return 'bg-green-100 dark:bg-green-900/30';
    } else {
      return 'bg-blue-100 dark:bg-blue-900/30';
    }
  };

  const TypeIcon = getTypeIcon(entry.SpeakUpType);

  return (
    <div className="group relative bg-white dark:bg-gray-800/95 rounded-xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600/80 transition-all duration-300 ease-out backdrop-blur-sm max-w-full">
      {/* Accent bar based on type */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${getTypeIconBgColor(entry.SpeakUpType).replace('bg-', 'bg-gradient-to-r from-').replace('dark:bg-', 'via-')} opacity-60`} />
      
      {/* Main Card Content */}
      <div className="relative p-3.5 sm:p-4">
        {/* Header Row: Type Icon, Title, and Expand Button */}
        <div className="flex items-start justify-between mb-3 gap-2.5">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${getTypeIconBgColor(entry.SpeakUpType)} shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50 flex-shrink-0`}>
              <TypeIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${getTypeIconColor(entry.SpeakUpType)}`} />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-1.5 truncate leading-tight">
                {entry.SpeakUpType || 'N/A'}
              </h3>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span 
                  className={`inline-flex items-center px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-md border ${getStatusColor(entry.Status)} shadow-sm max-w-[180px] sm:max-w-[220px] md:max-w-[260px] overflow-hidden`}
                  title={entry.Status}
                >
                  <span className="truncate">
                    {entry.Status}
                  </span>
                </span>
                {entry.Approver && (
                  <div className="inline-flex items-center gap-0.5 px-0.5 py-0 flex-shrink-0">
                    <FiUserCheck className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-[9px] sm:text-[10px] font-medium text-blue-700 dark:text-blue-300 truncate max-w-[100px] sm:max-w-[120px]" title={entry.Approver}>
                      {entry.Approver}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <button
            className={`relative flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 transition-all duration-300 flex items-center justify-center active:scale-95 ml-2 ${
              isExpanded
                ? "border-red-400 text-red-600 dark:border-red-400 dark:text-red-400 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20 shadow-md shadow-red-200/50 dark:shadow-red-900/30"
                : "border-blue-400 text-blue-600 dark:border-blue-400 dark:text-blue-400 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 hover:shadow-md hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30"
            }`}
            onClick={onToggle}
            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
          >
            {isExpanded ? (
              <FiMinus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <FiPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </button>
        </div>

        {/* Quick Preview - Message snippet */}
        {!isExpanded && entry.Message && (
          <div className="mt-2.5 p-2.5 sm:p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/30 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-start gap-2">
              <FiMessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug">
                {entry.Message.length > 100 ? `${entry.Message.substring(0, 100)}...` : entry.Message}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="relative overflow-hidden border-t border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-b from-gray-50/50 via-white to-white dark:from-gray-800/50 dark:via-gray-800 dark:to-gray-800 transition-all duration-300 ease-out">
          <div className="p-3.5 sm:p-4 space-y-3 sm:space-y-4">
            {/* Type - Grid Item */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div className="p-3 sm:p-4 rounded-lg bg-white/80 dark:bg-gray-700/30 border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-700/40 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${getTypeIconBgColor(entry.SpeakUpType)}`}>
                    <TypeIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${getTypeIconColor(entry.SpeakUpType)}`} />
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Type
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                  {entry.SpeakUpType || "—"}
                </div>
              </div>
            </div>

            {/* Message - Full Width */}
            <div className="relative p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-50/80 to-indigo-50/60 dark:from-blue-900/20 dark:to-indigo-900/10 border border-blue-200/60 dark:border-blue-800/40 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                  <FiMessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Message
                </h4>
              </div>
              <div className="space-y-2.5">
                <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <MessageCell 
                    message={entry.Message} 
                    maxLength={200}
                    className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                  />
                </div>
                {entry.Message && entry.Message.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsMessageModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-white dark:bg-gray-800/60 rounded-lg border border-blue-200/60 dark:border-blue-800/60 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all duration-200"
                  >
                    <FiMessageSquare className="w-3 h-3" />
                    View Full Message
                  </button>
                )}
              </div>
            </div>

            {/* Anonymous - Grid Item */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div className="p-3 sm:p-4 rounded-lg bg-white/80 dark:bg-gray-700/30 border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-700/40 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                    <FiUser className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Anonymous
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md border ${
                    entry.IsAnonymous 
                      ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800' 
                      : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-200 dark:border-gray-800'
                  }`}>
                    {entry.IsAnonymous ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status - Full Width */}
            <div className="p-3 sm:p-4 rounded-lg bg-white/80 dark:bg-gray-700/30 border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-700/40 hover:shadow-sm transition-all duration-200 overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex-shrink-0">
                  Status
                </div>
              </div>
              <div className="mb-2 min-w-0">
                <div 
                  className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-md border ${getStatusColor(entry.Status)} shadow-sm max-w-full min-w-0`}
                  title={entry.Status}
                >
                  <span className="truncate min-w-0">
                    {entry.Status}
                  </span>
                </div>
              </div>
              {entry.Approver && (
                <div className="flex items-center gap-0.5 px-0.5 py-0.5">
                  <FiUserCheck className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-[9px] sm:text-[10px] font-medium text-blue-700 dark:text-blue-300 truncate" title={entry.Approver}>
                    {entry.Approver}
                  </span>
                </div>
              )}
            </div>

            {/* Attachment - Grid Item */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div className="p-3 sm:p-4 rounded-lg bg-white/80 dark:bg-gray-700/30 border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-700/40 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                    <FiPaperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Attachment
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                  {entry.Attachment ? (
                    <button
                      onClick={handleDownloadAttachment}
                      disabled={isDownloadingAttachment}
                      className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg border border-blue-200/60 dark:border-blue-800/60 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all duration-200 truncate max-w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      title={entry.Attachment}
                    >
                      {isDownloadingAttachment ? (
                        <>
                          <FiDownload className="w-3 h-3 flex-shrink-0 animate-spin" />
                          <span className="truncate">Downloading...</span>
                        </>
                      ) : (
                        <>
                          <FiDownload className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">Download</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 italic">No Attachment</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Button */}
            <div className="pt-2.5 sm:pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
              <Dropdown
                overlay={
                  <SpeakUpActionMenu 
                    entry={entry} 
                    onEdit={onEdit} 
                    onView={onView} 
                    onDelete={onDelete} 
                    onApprove={onApprove} 
                    onReject={onReject} 
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                    onViewHistory={onViewHistory}
                    onClose={() => setIsDropdownOpen(false)}
                    isEndUser={isEndUser}
                  />
                } 
                trigger={["click"]} 
                placement="bottomRight"
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <button
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/80 dark:from-gray-700/50 dark:to-gray-700/30 border-2 border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500 hover:from-gray-100 hover:to-gray-200/80 dark:hover:from-gray-700/70 dark:hover:to-gray-700/50 rounded-lg transition-all duration-200 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  <FiMoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>View Actions</span>
                  <FiChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </Dropdown>
            </div>
          </div>
        </div>
      )}

      <MessagePreviewModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        message={entry.Message}
        title="Speak Up Message"
      />
    </div>
  );
};
