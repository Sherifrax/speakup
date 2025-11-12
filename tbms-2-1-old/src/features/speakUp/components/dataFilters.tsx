import { FiX, FiFilter } from "react-icons/fi";
import Button from "../../../features/common/components/ui/button";
import { useMediaQuery } from "react-responsive";
import { useSpeakUpFilters } from "../hooks/useSpeakUpFilters"; 
import { SpeakUpSearchParams } from "../types/speakupTypes";

interface SpeakUpFilterProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SpeakUpSearchParams;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  onReset: () => void;
  onApply: () => void;
}

export const SpeakUpFilter = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  onApply,
}: SpeakUpFilterProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const { options, isLoading } = useSpeakUpFilters();

  if (!isOpen) return null;

  const FilterButtons = (
    <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky bottom-0">
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

  const renderDropdown = (label: string, name: string, items?: { key: string; value: string }[]) => (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        {label}
      </label>
      <select
        name={name}
        value={filters[name as keyof SpeakUpSearchParams] ?? ""}
        onChange={onFilterChange}
        className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      >
        {items?.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.value}
          </option>
        ))}
      </select>
    </div>
  );

  const renderCheckbox = (label: string, name: string, checked: boolean) => (
    <div className="flex items-center space-x-2 mt-4">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={(e) =>
          onFilterChange({
            ...e,
            target: { ...e.target, name, value: e.target.checked ? "1" : "0" },
          } as React.ChangeEvent<HTMLInputElement>)
        }
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
    </div>
  );

  const filterContent = (
    <>
      {isLoading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading filters...</p>
      ) : (
        <div className="space-y-6">
          {renderDropdown("Status", "StatusID", options.statusOptions)}
          {renderDropdown("Type", "TypeID", options.typeOptions)}
          {renderCheckbox("Is Anonymous", "IsAnonymous", filters.IsAnonymous === 1)}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* ✅ Mobile View */}
      {isMobile ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl z-50 rounded-t-3xl flex flex-col h-[90vh] transition-transform duration-300 ease-out">
          {/* Drag bar */}
          <div className="flex justify-center pt-3">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </div>

          {/* Header */}
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FiFilter className="text-blue-500 w-5 h-5" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">SpeakUp Filters</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">{filterContent}</div>
          {FilterButtons}
        </div>
      ) : (
        /* ✅ Desktop */
        <div
          className={`fixed top-0 bottom-0 right-0 w-96 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 rounded-l-2xl
          flex flex-col transform transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FiFilter className="text-blue-500 w-6 h-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Filters</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">{filterContent}</div>
          {FilterButtons}
        </div>
      )}
    </>
  );
};
