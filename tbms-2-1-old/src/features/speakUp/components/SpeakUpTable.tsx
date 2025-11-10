import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiPlus, FiMinus, FiMoreVertical } from 'react-icons/fi';
import { Dropdown } from 'antd';
import { SpeakUpActionMenu } from './SpeakUpActionMenu';
import { SpeakUpMobileCard } from './SpeakUpMobileCard';
import { SpeakUpExpandedDetails } from './SpeakUpExpandedDetails';
import { MessageCell } from './MessageCell';
import { useExpandedRows } from '../hooks/useExpandedRows';
import type { SpeakUpEntry, SortDirection } from '../types/speakUpTypes';

interface SpeakUpTableProps {
  speakUpEntries: SpeakUpEntry[];
  sortColumn: string | null;
  sortDirection: SortDirection;
  onSort: (column: string) => void;
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

export const SpeakUpTable: React.FC<SpeakUpTableProps> = ({
  speakUpEntries,
  sortColumn,
  sortDirection,
  onSort,
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
  const { expandedRows, toggleRowExpansion } = useExpandedRows();
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

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

  const SortableHeader = ({ column, children, className = "", width = "" }: { column: string; children: React.ReactNode; className?: string; width?: string }) => (
    <th 
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className} ${width}`}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortColumn === column && (
          sortDirection === 'asc' ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />
        )}
      </div>
    </th>
  );

  if (!speakUpEntries.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No Speak Up entries found matching the criteria.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 p-3">
        {speakUpEntries.map((entry) => (
          <SpeakUpMobileCard
            key={entry.ID}
            entry={entry}
            isExpanded={expandedRows.has(entry.ID.toString())}
            onToggle={() => toggleRowExpansion(entry.ID.toString())}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            onApprove={onApprove}
            onReject={onReject}
            onCancel={onCancel}
            onSubmit={onSubmit}
            onViewHistory={onViewHistory}
            isEndUser={isEndUser}
          />
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="2xl:hidden px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" />
              <SortableHeader column="SpeakUpType">Type</SortableHeader>
              <SortableHeader column="Message">Message</SortableHeader>
              <SortableHeader column="Attachment" className="hidden 2xl:table-cell">Attachment</SortableHeader>
              <SortableHeader column="isanonymous">Anonymous</SortableHeader>
              <SortableHeader column="Status">Status</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {speakUpEntries.map((entry) => (
              <React.Fragment key={entry.ID}>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="2xl:hidden px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => toggleRowExpansion(entry.ID.toString())}
                      className={`ml-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        expandedRows.has(entry.ID.toString())
                          ? "border-red-500 text-red-500 dark:border-red-400 dark:text-red-400"
                          : "border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400"
                      } border`}
                    >
                      {expandedRows.has(entry.ID.toString()) ? (
                        <FiMinus className="h-3 w-3" />
                      ) : (
                        <FiPlus className="h-3 w-3" />
                      )}
                    </button>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{entry.SpeakUpType || 'N/A'}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <MessageCell 
                      message={entry.Message} 
                      maxLength={15}
                      className="max-w-xs"
                    />
                  </td>

                  <td className="hidden 2xl:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.Attachment ? (
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle attachment download
                        }}
                      >
                        {entry.Attachment}
                      </a>
                    ) : (
                      'No attachment'
                    )}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      entry.IsAnonymous 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {entry.IsAnonymous ? 'Yes' : 'No'}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-col max-w-xs">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.Status)} break-words`}>
                        {entry.Status}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right">
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
                          onClose={() => setOpenDropdownId(null)}
                          isEndUser={isEndUser}
                        />
                      } 
                      trigger={["click"]} 
                      placement="bottomRight"
                      open={openDropdownId === entry.ID}
                      onOpenChange={(open) => {
                        setOpenDropdownId(open ? entry.ID : null);
                      }}
                    >
                      <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <FiMoreVertical className="h-4 w-4" />
                      </button>
                    </Dropdown>
                  </td>
                </tr>

                {expandedRows.has(entry.ID.toString()) && (
                  <SpeakUpExpandedDetails entry={entry} />
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
