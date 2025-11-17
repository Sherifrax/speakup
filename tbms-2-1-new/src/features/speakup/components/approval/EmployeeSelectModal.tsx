import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../../common/components/ui/modal";
import { FiSearch, FiUser, FiX } from "react-icons/fi";
import { useSearchEmployeesMutation, EmployeeDto } from "../../../../services/Common/employeeSearch";
import { NoDataState } from "../../../common/components/states/NoDataState";

interface EmployeeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (employee: EmployeeDto) => void;
}

export const EmployeeSelectModal = ({ isOpen, onClose, onApply }: EmployeeSelectModalProps) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<EmployeeDto | null>(null);
  const [searchEmployees, { data, isLoading }] = useSearchEmployeesMutation();

  const results = useMemo(() => data?.data ?? [], [data]);

  useEffect(() => {
    setSelected(null);
    setQuery("");
  }, [isOpen]);

  useEffect(() => {
    let t: number | undefined;
    if (isOpen && query.trim().length >= 1) {
      t = window.setTimeout(() => {
        searchEmployees({ params: { commonSearchString: query.trim() } });
      }, 250);
    }
    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [isOpen, query, searchEmployees]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} className="max-w-lg rounded-2xl shadow-2xl">
      <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Employee</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        {/* Search */}
        <div className="px-5 py-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by employee name or ID"
              className="w-full pl-10 pr-3 py-2.5 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        {/* List */}
        <div className="px-1 pb-2 max-h-72 overflow-auto">
          {isLoading ? (
            <div className="px-5 py-8 text-sm text-gray-500 dark:text-gray-400">Searching…</div>
          ) : results.length === 0 && query.trim().length > 0 ? (
            <NoDataState
              description="Can't find any employees matching your request."
              className="py-8"
            />
          ) : (
            results.map((emp) => {
              const active = selected?.empNumber === emp.empNumber;
              return (
                <button
                  key={emp.empNumber}
                  onClick={() => setSelected(emp)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50/60 dark:hover:bg-gray-800 ${
                    active ? "bg-blue-50 dark:bg-gray-800" : ""
                  }`}
                >
                  <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30">
                    <FiUser className="text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {emp.empName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {emp.empNumber} • {emp.designation}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selected}
            onClick={() => {
              if (selected) onApply(selected);
            }}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
          >
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
};


