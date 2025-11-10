import { ApiKeyTable } from "./Table";
// import { ApiKeyTableMobile } from "./ApiKeyMobileTable";
import { ApiKey } from "../types/apiKeyTypes";
import { FiAlertCircle, FiLoader } from "react-icons/fi";
import { PaginationWrapper } from "../../../components/common/PaginationWrapper";
interface ApiKeyTableContainerProps {
  isMobile: boolean;
  apiKeys: ApiKey[];
  totalItems: number;
  itemsPerPage: number;
  isLoading?: boolean;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  onEdit: (apiKey: ApiKey) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  activeFilters?: Record<string, any>; // Optional filters summary, changed to any to avoid type error
}

export const ApiKeyTableWrapper = ({
  isMobile,
  apiKeys,
  totalItems,
  itemsPerPage,
  isLoading = false,
  sortColumn,
  sortDirection,
  onSort,
  onEdit,
  currentPage,
  totalPages,
  onPageChange,
  activeFilters,
}: ApiKeyTableContainerProps) => {
  return (
    <div className="space-y-4">
      {/* Filters summary (optional) */}
      {activeFilters && Object.keys(activeFilters).length > 0 && (
        <div className="flex flex-wrap gap-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm">
          <span className="font-semibold mr-2">Active filters:</span>
          {Object.entries(activeFilters).map(([key, value]) => (
            <span
              key={key}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full font-medium shadow"
              title={`${key}: ${value}`}
            >
              {key}: {value}
            </span>
          ))}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FiLoader className="animate-spin h-8 w-8 text-blue-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading API keys...</p>
        </div>
      ) : (
        <>
          {/* Empty state */}
          {apiKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <FiAlertCircle className="h-8 w-8 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No API keys found</p>
              {activeFilters && Object.keys(activeFilters).length > 0 && (
                <p className="text-sm mt-2">Try adjusting your filters</p>
              )}
            </div>
          ) : (
            <>
              <ApiKeyTable
                apiKeys={apiKeys}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                onEdit={onEdit}
              />
            </>
          )}
        </>
      )}

      {/* Pagination - Only show if there are items */}
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

