import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiPlus, FiMinus, FiMoreVertical, FiAlertTriangle, FiHelpCircle, FiFileText, FiStar, FiMessageSquare, FiTag, FiUserCheck, FiDownload } from 'react-icons/fi';
import { BsLightbulb } from 'react-icons/bs';
import { Dropdown } from 'antd';
import { SpeakUpActionMenu } from './SpeakUpActionMenu';
import { SpeakUpMobileCard } from './SpeakUpMobileCard';
import { SpeakUpEntryExpandedDetails } from './SpeakUpEntryExpandedDetails';
import { MessageCell } from './MessageCell';
import { useExpandedRows } from '../../hooks/shared/useExpandedRows';
import { useDownloadAttachmentMutation } from '../../../../services/Common/downloadAttachment';
import type { SpeakUpItem } from '../../types/speakupTypes';

interface SpeakUpTableProps {
  speakUpList: SpeakUpItem[];
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSort: (column: string, direction: "asc" | "desc") => void;
  sortColumn: string | null;
  sortDirection: "asc" | "desc" | null;
  loading?: boolean;
  actionHandlers: {
    onInfo?: (item: SpeakUpItem, actionBy: string) => void;
    onEdit?: (item: SpeakUpItem, actionBy: string) => void;
    onSubmit?: (item: SpeakUpItem) => void;
    onCancel?: (item: SpeakUpItem) => void;
    onView?: (item: SpeakUpItem) => void;
    onDelete?: (item: SpeakUpItem) => void;
    onApprove?: (item: SpeakUpItem) => void;
    onReject?: (item: SpeakUpItem) => void;
    onViewHistory?: (item: SpeakUpItem) => void;
  };
  isEndUser?: boolean;
}

export const SpeakUpTable: React.FC<SpeakUpTableProps> = ({
  speakUpList,
  onSort,
  sortColumn,
  sortDirection,
  loading = false,
  actionHandlers,
  isEndUser = true,
}) => {
  const [downloadAttachment, { isLoading: isDownloadingAttachment }] = useDownloadAttachmentMutation();

  const handleDownloadAttachment = async (fileName: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!fileName) return;
    
    try {
      const blob = await downloadAttachment({ fileName }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading attachment:", error);
      alert("Failed to download attachment. Please try again.");
    }
  };
  const { expandedRows, toggleRowExpansion } = useExpandedRows();
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1920);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine if expand button should be shown
  // Anonymous is hidden on < lg (1024px), Attachment is hidden on < 2xl (1536px)
  // Show expand button when there are fields to expand (i.e., when windowWidth < 2xl)
  const showExpandButton = windowWidth < 1536; // < 2xl: Attachment is always hidden, Anonymous is hidden on < lg

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

  const SortableHeader = ({ column, children, className = "", width = "", style }: { column: string; children: React.ReactNode; className?: string; width?: string; style?: React.CSSProperties }) => {
    const isSorted = sortColumn === column;
    return (
      <th 
        className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group ${className} ${width}`}
        onClick={() => onSort(column, isSorted && sortDirection === 'asc' ? 'desc' : 'asc')}
        style={style}
      >
        <div className="flex items-center gap-1.5">
          {children}
          <span className="inline-flex flex-col leading-none ml-0.5">
            <FiChevronUp
              className={`h-3.5 w-3.5 transition-colors ${
                isSorted
                  ? sortDirection === 'asc'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-300 dark:text-gray-500'
                  : 'text-gray-300 group-hover:text-gray-400'
              }`}
            />
            <FiChevronDown
              className={`h-3.5 w-3.5 -mt-1 transition-colors ${
                isSorted
                  ? sortDirection === 'desc'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-300 dark:text-gray-500'
                  : 'text-gray-300 group-hover:text-gray-400'
              }`}
            />
          </span>
        </div>
      </th>
    );
  };

  const handleEdit = (entry: SpeakUpItem) => {
    actionHandlers.onEdit && actionHandlers.onEdit(entry, "btnEdit");
  };

  const handleView = (entry: SpeakUpItem) => {
    actionHandlers.onView && actionHandlers.onView(entry);
  };

  const handleDelete = (entry: SpeakUpItem) => {
    actionHandlers.onDelete && actionHandlers.onDelete(entry);
  };

  const handleApprove = (entry: SpeakUpItem) => {
    actionHandlers.onApprove && actionHandlers.onApprove(entry);
  };

  const handleReject = (entry: SpeakUpItem) => {
    actionHandlers.onReject && actionHandlers.onReject(entry);
  };

  const handleCancel = (entry: SpeakUpItem) => {
    actionHandlers.onCancel && actionHandlers.onCancel(entry);
  };

  const handleSubmit = (entry: SpeakUpItem) => {
    actionHandlers.onSubmit && actionHandlers.onSubmit(entry);
  };

  const handleViewHistory = (entry: SpeakUpItem) => {
    actionHandlers.onViewHistory && actionHandlers.onViewHistory(entry);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Speak Up entries...</p>
        </div>
      </div>
    );
  }

  if (!speakUpList.length) {
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
      <div className="md:hidden space-y-3 p-3 sm:p-4">
        {speakUpList.map((entry) => (
          <SpeakUpMobileCard
            key={entry.ID}
            entry={entry}
            isExpanded={expandedRows.has(entry.ID.toString())}
            onToggle={() => toggleRowExpansion(entry.ID.toString())}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            onViewHistory={handleViewHistory}
            isEndUser={isEndUser}
          />
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {showExpandButton && (
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" style={{ width: '48px' }} />
              )}
              <SortableHeader column="SpeakUpType" style={{ width: '140px' }}>Type</SortableHeader>
              <SortableHeader column="Message">Message</SortableHeader>
              <SortableHeader column="isanonymous" className="hidden lg:table-cell" style={{ width: '110px' }}>Anonymous</SortableHeader>
              <SortableHeader column="Status" style={{ width: '140px' }}>Status</SortableHeader>
              <SortableHeader column="Attachment" className="hidden 2xl:table-cell" style={{ width: '120px' }}>Attachment</SortableHeader>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" style={{ width: '80px' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {speakUpList.map((entry) => (
              <React.Fragment key={entry.ID}>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {showExpandButton && (
                    <td className="px-4 py-3 whitespace-nowrap">
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
                  )}

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {React.createElement(getTypeIcon(entry.SpeakUpType), {
                        className: `w-4 h-4 mr-2 ${getTypeIconColor(entry.SpeakUpType)}`
                      })}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{entry.SpeakUpType || 'N/A'}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-normal break-words max-w-[560px]">
                    <MessageCell
                      message={entry.Message}
                      maxLength={110}
                      className="whitespace-normal break-words"
                    />
                  </td>

                  <td className="hidden lg:table-cell px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      entry.IsAnonymous 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {entry.IsAnonymous ? 'Yes' : 'No'}
                    </span>
                  </td>

                  <td className="px-4 py-2.5">
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap w-fit ${getStatusColor(entry.Status)}`}>
                        {entry.Status}
                      </span>
                      {entry.Approver && (
                        <div 
                          className="inline-flex items-center gap-1 px-1 py-0.5 cursor-default"
                          title={`Approver: ${entry.Approver}`}
                        >
                          <FiUserCheck className="w-2.5 h-2.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                          <span className="text-[10px] font-medium text-blue-600/90 dark:text-blue-400/80 truncate max-w-[115px] sm:max-w-[140px] md:max-w-[165px]" style={{ lineHeight: '1.2' }}>
                            {entry.Approver}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="hidden 2xl:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.Attachment ? (
                      <button
                        onClick={(e) => handleDownloadAttachment(entry.Attachment, e)}
                        disabled={isDownloadingAttachment}
                        className="text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        title={entry.Attachment}
                      >
                        <FiDownload className="w-3 h-3" />
                        {isDownloadingAttachment ? "Downloading..." : "Download"}
                      </button>
                    ) : (
                      <span className="text-gray-400">No Attachment</span>
                    )}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right">
                    <Dropdown 
                      overlay={
                        <SpeakUpActionMenu 
                          entry={entry} 
                          onEdit={handleEdit} 
                          onView={handleView} 
                          onDelete={handleDelete} 
                          onApprove={handleApprove} 
                          onReject={handleReject} 
                          onCancel={handleCancel}
                          onSubmit={handleSubmit}
                          onViewHistory={handleViewHistory}
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
                  <SpeakUpEntryExpandedDetails entry={entry} />
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
