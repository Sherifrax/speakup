import React, { useState, useEffect } from "react";
import { FiLoader, FiAlertCircle, FiPlus, FiMinus } from "react-icons/fi";
import { PaginationWrapper } from "./PaginationWrapper";

export interface ColumnType<T> {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
  alwaysVisible?: boolean;
  priority?: number;
}

interface DataTableProps<T> {
  columns: ColumnType<T>[];
  dataSource: T[];
  totalItems?: number;
  pageSize?: number;
  currentPage?: number;
  hidePagination?: boolean;
  isLoading?: boolean;
  rowKey?: (item: T, index: number) => string | number;
  emptyText?: string;
  onPageChange?: (page: number) => void;
  onSort?: (column: string, direction: "asc" | "desc") => void;
  sortColumn?: string | null;
  sortDirection?: "asc" | "desc" | null;
}

// 🔹 Decide visible columns based on screen width
const getVisibleColumns = <T,>(cols: ColumnType<T>[], width: number) => {
  const sorted = [...cols].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  let visibleCount: number;
  if (width >= 1600) visibleCount = sorted.length;
  else if (width >= 1200) visibleCount = Math.min(sorted.length, 6);
  else if (width >= 992) visibleCount = Math.min(sorted.length, 4);
  else if (width >= 768) visibleCount = Math.min(sorted.length, 3);
  else if (width >= 480) visibleCount = Math.min(sorted.length, 2);
  else visibleCount = 1;
  return {
    visible: sorted.slice(0, visibleCount),
    hidden: sorted.slice(visibleCount),
  };
};

export function DataTable<T>({
  columns,
  dataSource,
  totalItems = 0,
  pageSize = 10,
  currentPage = 1,
  hidePagination = false,
  isLoading = false,
  onPageChange,
  rowKey,
  emptyText = "No data available",
  onSort,
  sortColumn,
  sortDirection,
}: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<ColumnType<T>[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<ColumnType<T>[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const toggleRow = (rowIndex: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) newSet.delete(rowIndex);
      else newSet.add(rowIndex);
      return newSet;
    });
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const autoCols = columns.map((col, i) => ({
      ...col,
      priority: col.priority ?? i + 1,
    }));
    const { visible, hidden } = getVisibleColumns(autoCols, windowWidth);
    setVisibleColumns(visible);
    setHiddenColumns(hidden);
  }, [windowWidth, columns]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <FiLoader className="animate-spin h-6 w-6 text-blue-500 mb-3" />
        <p className="text-gray-600 dark:text-gray-400 text-sm">Loading data...</p>
      </div>
    );
  }

  if (!dataSource || dataSource.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <FiAlertCircle className="h-6 w-6 text-gray-400 mb-3" />
        <p className="text-gray-600 dark:text-gray-400 text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="h-9"> {/* reduced height */}
              <th className="w-8"></th>
              {visibleColumns.map((col) => {
                const isSorted = sortColumn === col.key;
                return (
                  <th
                    key={col.key}
                    className={`px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider 
                      ${col.className || ""} ${col.sortable ? "cursor-pointer select-none" : ""}`}
                    onClick={() => {
                      if (col.sortable && onSort) {
                        const newDirection =
                          isSorted && sortDirection === "asc" ? "desc" : "asc";
                        onSort(col.key as string, newDirection);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      {col.title}
                      {col.sortable && isSorted && (
                        <span className="ml-1">{sortDirection === "asc" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {dataSource.map((item, index) => {
              const isExpanded = expandedRows.has(index);
              return (
                <React.Fragment key={rowKey ? rowKey(item, index) : index}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-2 py-1">
                      {hiddenColumns.length > 0 && (
                        <button
                          onClick={() => toggleRow(index)}
                          className="p-1 rounded border border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {isExpanded ? <FiMinus size={10} /> : <FiPlus size={10} />}
                        </button>
                      )}
                    </td>

                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        className="px-2 py-1 text-sm text-gray-900 dark:text-white"
                      >
                        {col.render ? col.render(item) : (item as any)[col.key]}
                      </td>
                    ))}
                  </tr>

                  {isExpanded && hiddenColumns.length > 0 && (
                    <tr className="bg-gray-50 dark:bg-gray-900">
                      <td colSpan={visibleColumns.length + 1} className="px-3 py-2">
                        <div className="space-y-1">
                          {hiddenColumns.map((col) => (
                            <div
                              key={col.key}
                              className="flex justify-between text-xs text-gray-700 dark:text-gray-300"
                            >
                              <span className="font-medium">{col.title}</span>
                              <span>
                                {col.render
                                  ? col.render(item)
                                  : (item as any)[col.key]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination is now handled outside the table component */}
    </div>
  );
}
