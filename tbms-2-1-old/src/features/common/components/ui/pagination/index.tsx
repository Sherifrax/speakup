import React, { useState } from "react";
import Button from "../button";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  firstLastButtons?: boolean;
  buttonClassName?: string;
  activeButtonClassName?: string;
  disabledButtonClassName?: string;
  textClassName?: string;
  startItem?: number;
  endItem?: number;
  totalItems?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  firstLastButtons = true,
  buttonClassName = "p-2 rounded-lg transition-all duration-200 flex items-center justify-center",
  activeButtonClassName = "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-blue-900 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm [&>svg]:text-blue-900 dark:[&>svg]:text-blue-400",
  disabledButtonClassName = "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-transparent cursor-not-allowed",
  textClassName = "text-gray-700 dark:text-gray-300 text-sm font-medium",
  startItem,
  endItem,
  totalItems,
}: PaginationProps) => {
  const [inputValue, setInputValue] = useState("");

  // Go to page from textbox
  const goToPage = () => {
    const pageNum = Number(inputValue);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setInputValue(""); // clear input
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      goToPage();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Showing X–Y of Z items */}
      {startItem !== undefined && endItem !== undefined && totalItems !== undefined && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Showing <span className="font-medium text-gray-800 dark:text-gray-200">{startItem}-{endItem}</span> of{' '}
          <span className="font-medium text-gray-800 dark:text-gray-200">{totalItems}</span> items
        </div>
      )}

      <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900/50 p-1 rounded-xl border border-gray-200 dark:border-gray-800 flex-wrap">
        {firstLastButtons && (
          <Button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`${buttonClassName} ${currentPage === 1 ? disabledButtonClassName : activeButtonClassName}`}
            aria-label="Go to first page"
          >
            <FiChevronsLeft className="h-4 w-4" />
          </Button>
        )}

        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${buttonClassName} ${currentPage === 1 ? disabledButtonClassName : activeButtonClassName}`}
          aria-label="Go to previous page"
        >
          <FiChevronLeft className="h-4 w-4" />
        </Button>

        {/* Current page info */}
        <div className={`px-3 py-1 ${textClassName} mx-1`}>
          <span className="font-semibold text-blue-600 dark:text-blue-400">{currentPage}</span>
          <span className="mx-1">of</span>
          <span>{totalPages}</span>
        </div>

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`${buttonClassName} ${currentPage === totalPages || totalPages === 0 ? disabledButtonClassName : activeButtonClassName}`}
          aria-label="Go to next page"
        >
          <FiChevronRight className="h-4 w-4" />
        </Button>

        {firstLastButtons && (
          <Button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`${buttonClassName} ${currentPage === totalPages || totalPages === 0 ? disabledButtonClassName : activeButtonClassName}`}
            aria-label="Go to last page"
          >
            <FiChevronsRight className="h-4 w-4" />
          </Button>
        )}

        {/* Jump-to-page textbox */}
        <div className="flex items-center gap-1 ml-2">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Page #"
            className="w-20 px-2 py-1 border rounded text-sm"
          />
          <Button
            onClick={goToPage}
            className="px-3 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Go
          </Button>
        </div>
      </div>
    </div>
  );
};
