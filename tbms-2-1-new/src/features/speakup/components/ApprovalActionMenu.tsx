import React from 'react';
import { FiEye, FiCheck, FiX, FiClock, FiList, FiUserPlus, FiEdit2, FiSlash } from 'react-icons/fi';
import type { SpeakUpItem } from '../types/speakupTypes';

interface ApprovalActionMenuProps {
  entry: SpeakUpItem;
  onViewMessage: (entry: SpeakUpItem) => void;
  onApprove: (entry: SpeakUpItem) => void;
  onReject: (entry: SpeakUpItem) => void;
  onViewHistory: (entry: SpeakUpItem) => void;
  onAssign?: (entry: SpeakUpItem) => void;
  onUpdateHistory?: (entry: SpeakUpItem) => void;
  onCloseEntry?: (entry: SpeakUpItem) => void;
  onClose?: () => void;
}

export const ApprovalActionMenu: React.FC<ApprovalActionMenuProps> = ({
  entry,
  onViewMessage,
  onApprove,
  onReject,
  onViewHistory,
  onAssign,
  onUpdateHistory,
  onCloseEntry,
  onClose,
}) => {
  // Check if approve/reject buttons are available from API
  const canApprove = entry.ApproveBtn !== false;
  const canReject = entry.RejectBtn !== false;
  const canAssign = entry.AssignBtn === true;
  const canUpdate = entry.UpdateBtn === true;
  const canClose = entry.CloseBtn === true;

  const items = [
    {
      key: "view",
      label: (
        <button
          onClick={() => {
            onViewMessage(entry);
            onClose?.();
          }}
          className="flex items-center px-4 py-3 text-sm text-blue-700 dark:text-blue-300 w-full text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 rounded-lg mx-2 hover:shadow-sm"
        >
          <FiEye className="mr-3 text-blue-500 w-4 h-4" /> View Message
        </button>
      ),
    },
    {
      key: "history",
      label: (
        <button
          onClick={() => {
            onViewHistory(entry);
            onClose?.();
          }}
          className="flex items-center px-4 py-3 text-sm text-indigo-700 dark:text-indigo-300 w-full text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 rounded-lg mx-2 hover:shadow-sm"
        >
          <FiClock className="mr-3 text-indigo-500 w-4 h-4" /> View History
        </button>
      ),
    },
    ...(canAssign ? [{
      key: "assign",
      label: (
        <button
          onClick={() => {
            onAssign?.(entry);
            onClose?.();
          }}
          className="flex items-center px-4 py-3 text-sm text-blue-700 dark:text-blue-300 w-full text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg mx-2"
        >
          <FiUserPlus className="mr-3 text-blue-500 w-4 h-4" /> Assign
        </button>
      ),
    }] : []),
    ...(canApprove ? [{
      key: "approve",
      label: (
        <button
          onClick={() => {
            onApprove(entry);
            onClose?.();
          }}
          className="flex items-center px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300 w-full text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 rounded-lg mx-2 hover:shadow-sm"
        >
          <FiCheck className="mr-3 text-emerald-500 w-4 h-4" /> Approve
        </button>
      ),
    }] : []),
    ...(canReject ? [{
      key: "reject",
      label: (
        <button
          onClick={() => {
            onReject(entry);
            onClose?.();
          }}
          className="flex items-center px-4 py-3 text-sm text-red-700 dark:text-red-300 w-full text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 rounded-lg mx-2 hover:shadow-sm"
        >
          <FiX className="mr-3 text-red-500 w-4 h-4" /> Reject
        </button>
      ),
    }] : []),
    ...(canUpdate ? [{
      key: "update",
      label: (
        <button
          onClick={() => {
            onUpdateHistory?.(entry);
            onClose?.();
          }}
          className="flex items-center px-4 py-3 text-sm text-indigo-700 dark:text-indigo-300 w-full text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg mx-2"
        >
          <FiEdit2 className="mr-3 text-indigo-500 w-4 h-4" /> Update History
        </button>
      ),
    }] : []),
    ...(canClose ? [{
      key: "close",
      label: (
        <button
          onClick={() => {
            onCloseEntry?.(entry);
            onClose?.();
          }}
          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg mx-2"
        >
          <FiSlash className="mr-3 text-gray-500 w-4 h-4" /> Close
        </button>
      ),
    }] : []),
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[220px] animate-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 border-b border-blue-400 dark:border-blue-500">
        <h3 className="text-sm font-semibold text-white flex items-center">
          <FiList className="w-4 h-4 mr-2" />
          Actions
        </h3>
      </div>
      
      {/* Menu Items */}
      <div className="py-2">
        {items.map((item, index) => (
          <div key={item.key} className="animate-in fade-in duration-200" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="px-2">
              {item.label}
            </div>
            {/* Add subtle divider between items (except last) */}
            {index < items.length - 1 && (
              <div className="mx-3 my-1 border-t border-gray-100 dark:border-gray-700"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

