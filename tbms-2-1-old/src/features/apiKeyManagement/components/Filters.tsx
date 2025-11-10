import { FiX, FiFilter } from "react-icons/fi";
import Button from "../../../components/ui/button";
import { ApiKeyFilter as ApiKeyFilterType } from "../types/apiKeyTypes";
import { useMediaQuery } from "react-responsive";
import { ApiKeyFilterNames, ApiKeyFilterOptions } from "../constants";

interface ApiKeyFilterProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ApiKeyFilterType;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onReset: () => void;
  onApply: () => void;
}

export const ApiKeyFilter = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  onApply,
}: ApiKeyFilterProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  if (!isOpen) return null;

  const FilterButtons = (
    <div className="p-5 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900">
      <div className="flex space-x-4">
        <Button
          onClick={onReset}
          className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-white py-3.5 rounded-xl transition-all active:scale-95"
        >
          Clear All
        </Button>
        <Button
          onClick={onApply}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );

  return (
    <>

      {isMobile ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl z-50 rounded-t-3xl flex flex-col max-h-[85vh] transform transition-transform duration-300 ease-out">
          {/* Mobile content */}
          <div className="flex justify-center pt-3">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </div>

          <div className="p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 dark:bg-gray-900 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FiFilter className="text-blue-500 w-5 h-5" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Filter API Keys
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1 -mr-1"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {ApiKeyFilterNames.map((filterName) => (
              <div key={filterName} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {filterName.replace('is', '').replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="relative">
                  <select
                    value={filters[filterName as keyof ApiKeyFilterType]}
                    name={filterName}
                    onChange={onFilterChange}
                    className="w-full p-3 pl-4 pr-10 text-sm border border-gray-300 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    {ApiKeyFilterOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    {/* <FiChevronDown className="h-5 w-5 text-gray-400" /> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {FilterButtons}
        </div>
      ) : (
        <div className="fixed top-14 right-0 h-[calc(99%-3rem)] w-96 bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out z-50 rounded-l-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col">
          {/* Desktop content */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FiFilter className="text-blue-500 w-6 h-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Advanced Filters
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1 -mr-1"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {ApiKeyFilterNames.map((filterName) => (
              <div key={filterName} className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {filterName.replace('is', '').replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="relative">
                  <select
                    value={filters[filterName as keyof ApiKeyFilterType]}
                    name={filterName}
                    onChange={onFilterChange}
                    className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition"
                  >
                    {ApiKeyFilterOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {FilterButtons}
        </div>
      )}
    </>
  );
};
