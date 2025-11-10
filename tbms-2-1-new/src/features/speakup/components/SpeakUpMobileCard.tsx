import React, { useState } from 'react';
import { FiPlus, FiMinus, FiMoreVertical, FiFileText, FiUser, FiMessageSquare, FiZap, FiAlertCircle, FiHelpCircle, FiStar, FiPaperclip, FiUserCheck, FiTag } from 'react-icons/fi';
import { Dropdown } from 'antd';
import { SpeakUpActionMenu } from './SpeakUpActionMenu';
import { MessageCell } from './MessageCell';
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
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'closed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'under hr manager':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'assigned to employee':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        // Check for awaiting approval statuses
        if (statusLower.includes('awaiting') && (statusLower.includes('approval') || statusLower.includes('es') || statusLower.includes('payroll'))) {
          return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        }
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    if (!type) return FiTag;
    const typeLower = type.toLowerCase();
    
    if (typeLower.includes('suggestion') || typeLower.includes('suggest')) {
      return FiZap;
    } else if (typeLower.includes('complaint') || typeLower.includes('issue')) {
      return FiAlertCircle;
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

  const getTypeIconBgColor = (type: string) => {
    if (!type) return 'bg-gray-100 dark:bg-gray-700/30';
    const typeLower = type.toLowerCase();
    
    if (typeLower.includes('suggestion') || typeLower.includes('suggest')) {
      return 'bg-yellow-100 dark:bg-yellow-900/20';
    } else if (typeLower.includes('complaint') || typeLower.includes('issue')) {
      return 'bg-red-100 dark:bg-red-900/20';
    } else if (typeLower.includes('question') || typeLower.includes('query')) {
      return 'bg-blue-100 dark:bg-blue-900/20';
    } else if (typeLower.includes('feedback')) {
      return 'bg-purple-100 dark:bg-purple-900/20';
    } else if (typeLower.includes('report') || typeLower.includes('document')) {
      return 'bg-green-100 dark:bg-green-900/20';
    } else {
      return 'bg-blue-100 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 ease-out">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/0 dark:to-blue-950/0 group-hover:to-blue-50/30 dark:group-hover:to-blue-950/20 pointer-events-none transition-all duration-300" />
      
      {/* Main Card Content */}
      <div className="relative p-4">
        {/* Header Row: Type and Expand Button */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${getTypeIconBgColor(entry.SpeakUpType)}`}>
              {React.createElement(getTypeIcon(entry.SpeakUpType), {
                className: `w-4 h-4 flex-shrink-0 ${getTypeIconColor(entry.SpeakUpType)}`
              })}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate leading-tight">
              {entry.SpeakUpType || 'N/A'}
            </h3>
          </div>
          
          <button
            className={`relative p-2 rounded-xl border-2 transition-all duration-300 flex-shrink-0 active:scale-95 ${
              isExpanded
                ? "border-red-400 text-red-600 dark:border-red-500 dark:text-red-400 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20 shadow-sm shadow-red-200/50 dark:shadow-red-900/20"
                : "border-blue-400 text-blue-600 dark:border-blue-500 dark:text-blue-400 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 hover:shadow-sm hover:shadow-blue-200/50 dark:hover:shadow-blue-900/20"
            }`}
            onClick={onToggle}
            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
          >
            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              {isExpanded ? <FiMinus className="h-3.5 w-3.5" /> : <FiPlus className="h-3.5 w-3.5" />}
            </div>
          </button>
        </div>

        {/* Message - Always visible */}
        <div className="mb-3.5 px-0.5">
          <div className="relative">
            <MessageCell 
              message={entry.Message} 
              maxLength={25}
              className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
            />
          </div>
        </div>

        {/* Status and Approver Row */}
        <div className="flex flex-col gap-2">
          <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full w-fit shadow-sm ${getStatusColor(entry.Status)}`}>
            {entry.Status}
          </span>
          {entry.Approver && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 dark:from-blue-900/25 dark:to-indigo-900/20 border border-blue-200/60 dark:border-blue-800/50 rounded-lg w-fit shadow-sm hover:shadow hover:from-blue-100/90 hover:to-indigo-100/70 dark:hover:from-blue-900/35 dark:hover:to-indigo-900/25 transition-all duration-200 group/approver">
              <div className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-100/80 dark:bg-blue-800/40 group-hover/approver:bg-blue-200/90 dark:group-hover/approver:bg-blue-700/60 transition-colors">
                <FiUserCheck className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              </div>
              <span className="text-[10px] font-medium text-blue-700 dark:text-blue-300 truncate max-w-[140px] leading-tight" title={entry.Approver}>
                {entry.Approver}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content - Only show hidden columns (Anonymous, Attachment) */}
      {isExpanded && (
        <div className="relative overflow-hidden border-t border-gray-200/80 dark:border-gray-700/80 bg-gradient-to-b from-gray-50/80 via-gray-50/60 to-white dark:from-gray-700/40 dark:via-gray-700/30 dark:to-gray-800 transition-all duration-300 ease-out">
          <div className="p-4 space-y-3.5">
            {/* Anonymous */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200/60 dark:border-gray-700/60 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:border-gray-300/60 dark:hover:border-gray-600/60 transition-all duration-200 shadow-sm hover:shadow">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700/60 dark:to-gray-800/40 shadow-sm">
                <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-300 flex-shrink-0" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Anonymous
                </div>
                <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${
                  entry.IsAnonymous 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {entry.IsAnonymous ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {/* Attachment */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200/60 dark:border-gray-700/60 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:border-gray-300/60 dark:hover:border-gray-600/60 transition-all duration-200 shadow-sm hover:shadow">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 shadow-sm">
                <FiPaperclip className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Attachment
                </div>
                <div className="min-w-0">
                  {entry.Attachment ? (
                    <a
                      href={entry.Attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50/80 dark:from-blue-900/25 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100/90 dark:hover:from-blue-900/35 dark:hover:to-indigo-900/25 rounded-lg border border-blue-200/60 dark:border-blue-800/60 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      title={entry.Attachment}
                    >
                      <FiFileText className="w-4 h-4" />
                      <span>View Attachment</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 text-xs text-gray-400 dark:text-gray-500 italic bg-gray-50/80 dark:bg-gray-700/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                      No Attachment
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
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
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  <FiMoreVertical className="w-4 h-4" />
                  <span>View Actions</span>
                </button>
              </Dropdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

