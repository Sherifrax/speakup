import React, { useState } from 'react';
import { FiPlus, FiMinus, FiMoreVertical, FiFileText, FiUser, FiTag, FiMessageSquare } from 'react-icons/fi';
import { Dropdown } from 'antd';
import { SpeakUpActionMenu } from './SpeakUpActionMenu';
import { MessageCell } from './MessageCell';
import type { SpeakUpEntry } from '../types/speakUpTypes';

interface SpeakUpMobileCardProps {
  entry: SpeakUpEntry;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (entry: SpeakUpEntry) => void;
  onView: (entry: SpeakUpEntry) => void;
  onDelete: (entry: SpeakUpEntry) => void;
  onApprove: (entry: SpeakUpEntry) => void;
  onReject: (entry: SpeakUpEntry) => void;
  onCancel: (entry: SpeakUpEntry) => void;
  onSubmit: (entry: SpeakUpEntry) => void;
  onViewHistory: (entry: SpeakUpEntry) => void;
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header - Status at top right, entry info below */}
      <div className="p-4">
        {/* Top row with status and expand/collapse button */}
        <div className="flex justify-between items-start mb-3">
          {/* Status badge - top right */}
          <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(entry.Status)}`}>
            {entry.Status}
          </span>
          
          {/* Expand/Collapse button - only this is clickable */}
          <button
            className={`p-2 rounded-full transition-colors ${
              isExpanded
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
            }`}
            onClick={onToggle}
          >
            {isExpanded ? <FiMinus className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
          </button>
        </div>

        {/* Entry number and basic info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <FiMessageSquare className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm break-words">
              {entry.SpeakUpType || 'N/A'}
            </h3>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <FiTag className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-gray-500 dark:text-gray-400">ID:</span>
              <span className="text-gray-900 dark:text-white font-medium truncate">{entry.ID}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiUser className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-gray-500 dark:text-gray-400">Anonymous:</span>
              <span className={`font-medium ${entry.IsAnonymous ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                {entry.IsAnonymous ? 'Yes' : 'No'}
              </span>
            </div>
            {entry.Attachment && (
              <div className="flex items-center space-x-2">
                <FiFileText className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-gray-500 dark:text-gray-400">Attachment:</span>
                <span className="text-blue-600 dark:text-blue-400 truncate">{entry.Attachment}</span>
              </div>
            )}
          </div>

          <div className="mt-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Message</div>
            <MessageCell 
              message={entry.Message} 
              maxLength={20}
              className="text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {/* Message Preview */}
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Full Message</div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
              <MessageCell 
                message={entry.Message} 
                maxLength={50}
                className="text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Entry ID</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                {entry.ID}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Type</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                {entry.SpeakUpType || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Anonymous</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                {entry.IsAnonymous ? 'Yes' : 'No'}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                {entry.Status}
              </div>
            </div>
          </div>

          {/* Approver Info */}
          {entry.Approver && (
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Approver</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                {entry.Approver}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2">
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
                className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <FiMoreVertical className="mr-2" />
                Actions
              </button>
            </Dropdown>
          </div>
        </div>
      )}
    </div>
  );
};
