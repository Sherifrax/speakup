import React from 'react';
import { FiEdit, FiCheck, FiX, FiTrash2, FiSend, FiList, FiClock } from 'react-icons/fi';
import type { SpeakUpItem } from '../../types/speakupTypes';

interface SpeakUpActionMenuProps {
  entry: SpeakUpItem;
  onEdit: (entry: SpeakUpItem) => void;
  onView: (entry: SpeakUpItem) => void;
  onDelete: (entry: SpeakUpItem) => void;
  onApprove: (entry: SpeakUpItem) => void;
  onReject: (entry: SpeakUpItem) => void;
  onCancel: (entry: SpeakUpItem) => void;
  onSubmit: (entry: SpeakUpItem) => void;
  onViewHistory: (entry: SpeakUpItem) => void;
  onClose?: () => void;
  isEndUser?: boolean;
}

export const SpeakUpActionMenu: React.FC<SpeakUpActionMenuProps> = ({
  entry,
  onEdit,
  onView,
  onDelete,
  onApprove,
  onReject,
  onCancel,
  onSubmit,
  onViewHistory,
  onClose,
  isEndUser = true,
}) => {
  // Helper function to determine if entry can be edited
  const canEdit = () => {
    // If API button properties are not working, show edit for most statuses
    if (entry.EditBtn === undefined || entry.EditBtn === null) {
      return entry.Status.toLowerCase() !== 'closed' && entry.Status.toLowerCase() !== 'cancelled';
    }
    return entry.EditBtn || 
           entry.Status.toLowerCase() === 'open' || 
           entry.Status.toLowerCase() === 'draft' ||
           entry.Status.toLowerCase() === 'pending';
  };
  
  // Helper function to determine if entry can be submitted
  const canSubmit = () => {
    // If API button properties are not working, show submit for most statuses
    if (entry.SubmitBtn === undefined || entry.SubmitBtn === null) {
      return entry.Status.toLowerCase() !== 'closed' && entry.Status.toLowerCase() !== 'cancelled';
    }
    return entry.SubmitBtn || 
           entry.Status.toLowerCase() === 'open' || 
           entry.Status.toLowerCase() === 'draft' ||
           entry.Status.toLowerCase() === 'pending';
  };
  
  // Helper function to determine if entry can be cancelled
  const canCancel = () => {
    // If API button properties are not working, show cancel for most statuses
    if (entry.CancelBtn === undefined || entry.CancelBtn === null) {
      return entry.Status.toLowerCase() !== 'closed' && entry.Status.toLowerCase() !== 'cancelled';
    }
    return entry.CancelBtn || 
           entry.Status.toLowerCase() === 'open' || 
           entry.Status.toLowerCase() === 'draft' ||
           entry.Status.toLowerCase() === 'pending';
  };
  
  const items = [
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
    // Show actions based on API permissions or fallback to status-based logic
    ...(canEdit() ? [{
      key: "edit",
      label: (
        <button
          onClick={() => {
            onEdit(entry);
            onClose?.();
          }}
          className="flex items-center px-4 py-3 text-sm text-yellow-700 dark:text-yellow-300 w-full text-left hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200 rounded-lg mx-2 hover:shadow-sm"
        >
          <FiEdit className="mr-3 text-yellow-500 w-4 h-4" /> Edit
        </button>
      ),
    }] : []),
    ...(canSubmit() ? [{
      key: "submit",
      label: (
        <button
          onClick={() => {
            onSubmit(entry);
            onClose?.();
          }}
          className="flex items-center px-4 py-3 text-sm text-purple-700 dark:text-purple-300 w-full text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 rounded-lg mx-2 hover:shadow-sm"
        >
          <FiSend className="mr-3 text-blue-500 w-4 h-4" /> Submit
        </button>
      ),
    }] : []),
    ...(canCancel() ? [{
      key: "cancel",
      label: (
        <button
          onClick={() => {
            onCancel(entry);
            onClose?.();
          }}
          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 rounded-lg mx-2 hover:shadow-sm"
        >
          <FiTrash2 className="mr-3 text-gray-500 w-4 h-4" /> Cancel
        </button>
      ),
    }] : []),
  ];

  // Add admin-only actions if not end user
  if (!isEndUser) {
    // Add approve option if available
    if (entry.Status.toLowerCase() === 'open' || entry.Status.toLowerCase() === 'under hr manager') {
      items.push({
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
      });
    }

    // Add reject option if available
    if (entry.Status.toLowerCase() !== 'closed' && entry.Status.toLowerCase() !== 'cancelled') {
      items.push({
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
      });
    }

    // Add delete option for certain statuses
    if (canEdit() || entry.Status.toLowerCase() === 'cancelled') {
      items.push({
        key: "delete",
        label: (
          <button
            onClick={() => {
              onDelete(entry);
              onClose?.();
            }}
            className="flex items-center px-4 py-3 text-sm text-red-700 dark:text-red-300 w-full text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 rounded-lg mx-2 hover:shadow-sm"
          >
            <FiTrash2 className="mr-3 text-red-500 w-4 h-4" /> Delete
          </button>
        ),
      });
    }
  }

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

