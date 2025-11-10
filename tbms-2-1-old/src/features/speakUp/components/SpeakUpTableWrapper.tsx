import React from 'react';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';
import { PaginationWrapper } from '../../../components/common/PaginationWrapper';
import { SpeakUpTable } from './SpeakUpTable';
import type { SpeakUpEntry } from '../types/speakUpTypes';

interface SpeakUpTableWrapperProps {
  isMobile: boolean;
  speakUpEntries: SpeakUpEntry[];
  totalItems: number;
  itemsPerPage: number;
  isLoading?: boolean;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  onEdit: (entry: SpeakUpEntry) => void;
  onView: (entry: SpeakUpEntry) => void;
  onDelete: (entry: SpeakUpEntry) => void;
  onApprove: (entry: SpeakUpEntry) => void;
  onReject: (entry: SpeakUpEntry) => void;
  onCancel: (entry: SpeakUpEntry) => void;
  onSubmit: (entry: SpeakUpEntry) => void;
  onViewHistory: (entry: SpeakUpEntry) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  activeFilters?: Record<string, any>;
  isEndUser?: boolean;
}

export const SpeakUpTableWrapper: React.FC<SpeakUpTableWrapperProps> = ({
  speakUpEntries,
  totalItems,
  itemsPerPage,
  isLoading = false,
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
  currentPage,
  totalPages,
  onPageChange,
  activeFilters,
  isEndUser = true,
}) => {
  return (
    <div className="space-y-4">
      {activeFilters && Object.keys(activeFilters).length > 0 && (
        <div className="flex flex-wrap gap-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm">
          <span className="font-semibold mr-2">Active filters:</span>
          {Object.entries(activeFilters).map(([key, value]) => {
            // Skip IsAnonymous filter if it's not set to '1' (checked) or is empty
            if (key === 'IsAnonymous' && (value !== '1' || !value)) {
              return null;
            }
            
            // Transform key names to be more user-friendly
            const displayKey = key === 'StatusID' ? 'Status' : 
                              key === 'TypeID' ? 'Type' : 
                              key === 'IsAnonymous' ? 'Anonymous' : 
                              key.charAt(0).toUpperCase() + key.slice(1);
            
            // Transform values to be more user-friendly
            let displayValue = value;
            if (key === 'IsAnonymous') {
              displayValue = 'Anonymous Only';
            }
            
            return (
              <span
                key={key}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full font-medium shadow"
                title={`${displayKey}: ${displayValue}`}
              >
                {displayKey}: {displayValue}
              </span>
            );
          })}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FiLoader className="animate-spin h-8 w-8 text-blue-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading Speak Up entries...</p>
        </div>
      ) : (
        <>
          {speakUpEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <FiAlertCircle className="h-8 w-8 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No Speak Up entries found</p>
              {activeFilters && Object.keys(activeFilters).length > 0 && (
                <p className="text-sm mt-2">Try adjusting your filters</p>
              )}
            </div>
          ) : (
            <div className="overflow-hidden">
              <SpeakUpTable
                speakUpEntries={speakUpEntries}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
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
            </div>
          )}
        </>
      )}

      {totalItems > 0 && (
        <PaginationWrapper
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
