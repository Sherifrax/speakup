import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiPlus, FiMinus, FiMoreVertical, FiAlertTriangle, FiHelpCircle, FiFileText, FiMessageSquare, FiTag, FiStar, FiUserCheck, FiEyeOff } from 'react-icons/fi';
import { BsLightbulb } from 'react-icons/bs';
import { Dropdown } from 'antd';
import { ApprovalActionMenu } from './ApprovalActionMenu';
import { ApprovalMobileCard } from './ApprovalMobileCard';
import { ApprovalExpandedDetails } from './ApprovalExpandedDetails';
import { useExpandedRows } from '../hooks/useExpandedRows';
import type { SpeakUpItem } from '../types/speakupTypes';

interface ApprovalTableProps {
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
    onViewMessage?: (item: SpeakUpItem) => void;
    onApprove?: (item: SpeakUpItem) => void;
    onReject?: (item: SpeakUpItem) => void;
    onViewHistory?: (item: SpeakUpItem) => void;
    onAssign?: (item: SpeakUpItem) => void;
    onUpdateHistory?: (item: SpeakUpItem) => void;
    onCloseEntry?: (item: SpeakUpItem) => void;
  };
}

export const ApprovalTable: React.FC<ApprovalTableProps> = ({
  speakUpList,
  onSort,
  sortColumn,
  sortDirection,
  loading = false,
  actionHandlers,
}) => {
  const { expandedRows, toggleRowExpansion } = useExpandedRows();
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1920);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine if expand button should be shown
  // Employee Name, Designation, and Assigned Employee are hidden on < 2xl (1536px)
  // Show expand button when there are fields to expand (i.e., when windowWidth < 2xl)
  const showExpandButton = windowWidth < 1536; // < 2xl: Employee Name, Designation, and Assigned Employee are hidden

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

  const handleViewMessage = (entry: SpeakUpItem) => {
    actionHandlers.onViewMessage && actionHandlers.onViewMessage(entry);
  };

  const handleApprove = (entry: SpeakUpItem) => {
    actionHandlers.onApprove && actionHandlers.onApprove(entry);
  };

  const handleReject = (entry: SpeakUpItem) => {
    actionHandlers.onReject && actionHandlers.onReject(entry);
  };

  const handleAssign = (entry: SpeakUpItem) => {
    actionHandlers.onAssign && actionHandlers.onAssign(entry);
  };

  const handleUpdateHistory = (entry: SpeakUpItem) => {
    actionHandlers.onUpdateHistory && actionHandlers.onUpdateHistory(entry);
  };

  const handleCloseEntry = (entry: SpeakUpItem) => {
    actionHandlers.onCloseEntry && actionHandlers.onCloseEntry(entry);
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
          <ApprovalMobileCard
            key={entry.ID}
            entry={entry}
            isExpanded={expandedRows.has(entry.ID.toString())}
            onToggle={() => toggleRowExpansion(entry.ID.toString())}
            onViewMessage={handleViewMessage}
            onApprove={handleApprove}
            onReject={handleReject}
            onViewHistory={handleViewHistory}
            onAssign={handleAssign}
            onUpdateHistory={handleUpdateHistory}
            onCloseEntry={handleCloseEntry}
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
              <SortableHeader column="EMPNUMBER" style={{ width: '140px' }}>Employee Number</SortableHeader>
              <SortableHeader column="EMPNAME" className="hidden 2xl:table-cell" style={{ width: '220px' }}>Employee Name</SortableHeader>
              <SortableHeader column="Designation" className="hidden 2xl:table-cell" style={{ width: '220px' }}>Designation</SortableHeader>
              <SortableHeader column="SpeakUpType" style={{ width: '140px' }}>Type</SortableHeader>
              <SortableHeader column="AssignedEmp" className="hidden 2xl:table-cell" style={{ width: '220px' }}>Assigned Employee</SortableHeader>
              <SortableHeader column="Status" style={{ width: '180px' }}>Status</SortableHeader>
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

                  {/* Employee Number */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.IsAnonymous ? (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                          <FiEyeOff className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 italic">Anonymous</span>
                      </div>
                    ) : (
                      entry.EMPNUMBER || "—"
                    )}
                  </td>
                  {/* Employee Name */}
                  {/* Employee Name (hidden < 2xl, shown in expanded row) */}
                  <td className="hidden 2xl:table-cell px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-normal break-words max-w-[260px]">
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
                  </td>
                  {/* Designation */}
                  {/* Designation (hidden < 2xl, shown in expanded row) */}
                  <td className="hidden 2xl:table-cell px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-normal break-words max-w-[260px]">
                    {entry.IsAnonymous ? "—" : (entry.Designation || "—")}
                  </td>
                  {/* Type */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {React.createElement(getTypeIcon(entry.SpeakUpType), { className: `w-4 h-4 mr-2 ${getTypeIconColor(entry.SpeakUpType)}` })}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{entry.SpeakUpType || 'N/A'}</span>
                    </div>
                  </td>
                  {/* Assigned Employee */}
                  {/* Assigned Employee (hidden < 2xl, shown in expanded row) */}
                  <td className="hidden 2xl:table-cell px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-normal break-words max-w-[260px]">
                    {entry.AssignedEmp || "—"}
                  </td>
                  {/* Status */}
                  <td className="px-4 py-2.5">
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap w-fit ${getStatusColor(entry.Status)}`}>
                        {entry.Status}
                      </span>
                      {entry.Approver && (
                        <div 
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/30 dark:border-blue-800/30 rounded hover:bg-blue-50/70 dark:hover:bg-blue-900/20 transition-colors cursor-default"
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

                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right">
                    <Dropdown 
                      overlay={
                        <ApprovalActionMenu 
                          entry={entry} 
                          onViewMessage={handleViewMessage} 
                          onApprove={handleApprove} 
                          onReject={handleReject}
                          onViewHistory={handleViewHistory}
                          onAssign={handleAssign} 
                          onUpdateHistory={handleUpdateHistory}
                          onCloseEntry={handleCloseEntry}
                          onClose={() => setOpenDropdownId(null)}
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
                  <ApprovalExpandedDetails entry={entry} />
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

