import React, { useState } from 'react';
import { FiPlus, FiMinus, FiMoreVertical, FiFileText, FiUser, FiMessageSquare, FiAlertTriangle, FiHelpCircle, FiStar, FiTag, FiBriefcase, FiUserCheck, FiChevronDown, FiHash, FiEyeOff } from 'react-icons/fi';
import { BsLightbulb } from 'react-icons/bs';
import { Dropdown } from 'antd';
import { ApprovalActionMenu } from './ApprovalActionMenu';
import { MessagePreviewModal } from '../shared/MessagePreviewModal';
import type { SpeakUpItem } from '../../types/speakupTypes';

interface ApprovalMobileCardProps {
  entry: SpeakUpItem;
  isExpanded: boolean;
  onToggle: () => void;
  onViewMessage: (entry: SpeakUpItem) => void;
  onApprove: (entry: SpeakUpItem) => void;
  onReject: (entry: SpeakUpItem) => void;
  onViewHistory: (entry: SpeakUpItem) => void;
  onAssign?: (entry: SpeakUpItem) => void;
  onUpdateHistory?: (entry: SpeakUpItem) => void;
  onCloseEntry?: (entry: SpeakUpItem) => void;
}

export const ApprovalMobileCard: React.FC<ApprovalMobileCardProps> = ({
  entry,
  isExpanded,
  onToggle,
  onViewMessage,
  onApprove,
  onReject,
  onViewHistory,
  onAssign,
  onUpdateHistory,
  onCloseEntry,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
                {/* Employee Number badge */}
                {!entry.IsAnonymous && entry.EMPNUMBER && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200/60 dark:border-gray-700/60 rounded-md flex-shrink-0">
                    <FiHash className="w-2.5 h-2.5 text-gray-500 dark:text-gray-400" />
                    <span className="text-[9px] sm:text-[10px] font-medium text-gray-600 dark:text-gray-400">
                      {entry.EMPNUMBER}
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

        {/* Quick Info Row */}
        {!isExpanded && (
          <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400">
            {entry.IsAnonymous ? (
              <span className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                  <FiEyeOff className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
                </span>
                <span className="text-gray-600 dark:text-gray-400 italic">Anonymous</span>
              </span>
            ) : (
              <>
                {entry.EMPNAME && (
                  <span className="truncate flex-1 min-w-0 text-xs">
                    {entry.EMPNAME}
                  </span>
                )}
                {entry.Designation && (
                  <span className="truncate flex-1 min-w-0 text-xs text-gray-400 dark:text-gray-500">
                    {entry.Designation}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="relative overflow-hidden border-t border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-b from-gray-50/50 via-white to-white dark:from-gray-800/50 dark:via-gray-800 dark:to-gray-800 transition-all duration-300 ease-out">
          <div className="p-3.5 sm:p-4 space-y-3 sm:space-y-4">
            {/* Employee Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {/* Employee Number */}
              <div className="p-3 sm:p-4 rounded-lg bg-white/80 dark:bg-gray-700/30 border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-700/40 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                    <FiHash className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Employee Number
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                  {entry.IsAnonymous ? (
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 flex-shrink-0">
                        <FiEyeOff className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 italic">Anonymous</span>
                    </div>
                  ) : (
                    entry.EMPNUMBER || "—"
                  )}
                </div>
              </div>

              {/* Employee Name */}
              <div className="p-3 sm:p-4 rounded-lg bg-white/80 dark:bg-gray-700/30 border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-700/40 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                    <FiUser className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Employee Name
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white break-words">
                  {entry.IsAnonymous ? (
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 flex-shrink-0">
                        <FiEyeOff className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 italic">Anonymous</span>
                    </div>
                  ) : (
                    entry.EMPNAME || "—"
                  )}
                </div>
              </div>

              {/* Designation */}
              <div className="p-3 sm:p-4 rounded-lg bg-white/80 dark:bg-gray-700/30 border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-700/40 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40">
                    <FiBriefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Designation
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white break-words">
                  {entry.IsAnonymous ? "—" : (entry.Designation || "—")}
                </div>
              </div>

              {/* Type */}
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

            {/* Assigned Employee - Full Width */}
            {entry.AssignedEmp && (
              <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-indigo-50/80 to-purple-50/60 dark:from-indigo-900/20 dark:to-purple-900/10 border border-indigo-200/60 dark:border-indigo-800/40 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                    <FiUserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Assigned Employee
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white break-words">
                  {entry.AssignedEmp}
                </div>
              </div>
            )}

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

            {/* Actions Button */}
            <div className="pt-2.5 sm:pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
              <Dropdown
                overlay={
                  <ApprovalActionMenu 
                    entry={entry} 
                    onViewMessage={onViewMessage} 
                    onApprove={onApprove} 
                    onReject={onReject}
                    onViewHistory={onViewHistory}
                    onAssign={onAssign}
                    onUpdateHistory={onUpdateHistory}
                    onCloseEntry={onCloseEntry}
                    onClose={() => setIsDropdownOpen(false)}
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
