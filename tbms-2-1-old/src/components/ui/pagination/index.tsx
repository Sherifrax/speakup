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
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-4">
      {/* Showing X–Y of Z items */}
      {startItem !== undefined && endItem !== undefined && totalItems !== undefined && (
        <div className="text-sm text-gray-600 dark:text-gray-400 order-2 md:order-1">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{startItem}-{endItem}</span> of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 bg-gray-50/50 dark:bg-gray-800/30 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 order-1 md:order-2">
        {/* First page button - hidden on mobile */}
        {firstLastButtons && (
          <Button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`hidden sm:flex ${buttonClassName} ${currentPage === 1 ? disabledButtonClassName : activeButtonClassName}`}
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
        <div className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          <span className="font-bold text-blue-600 dark:text-blue-400">{currentPage}</span>
          <span className="mx-1.5 text-gray-400 dark:text-gray-600">/</span>
          <span className="text-gray-600 dark:text-gray-400">{totalPages}</span>
        </div>

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`${buttonClassName} ${currentPage === totalPages || totalPages === 0 ? disabledButtonClassName : activeButtonClassName}`}
          aria-label="Go to next page"
        >
          <FiChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page button - hidden on mobile */}
        {firstLastButtons && (
          <Button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`hidden sm:flex ${buttonClassName} ${currentPage === totalPages || totalPages === 0 ? disabledButtonClassName : activeButtonClassName}`}
            aria-label="Go to last page"
          >
            <FiChevronsRight className="h-4 w-4" />
          </Button>
        )}

        {/* Jump-to-page textbox - hidden on small screens, shown on md+ */}
        <div className="hidden md:flex items-center gap-1.5 ml-2 pl-2 border-l border-gray-300 dark:border-gray-700">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="#"
            className="w-14 px-2 py-1.5 text-sm text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            onClick={goToPage}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!inputValue || Number(inputValue) < 1 || Number(inputValue) > totalPages}
          >
            Go
          </Button>
        </div>
      </div>
    </div>
  );
};
