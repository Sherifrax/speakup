import { FiUser, FiUserCheck, FiBriefcase, FiEyeOff } from 'react-icons/fi';
import { SpeakUpItem } from "../types/speakupTypes";
import { useState, useEffect } from 'react';

interface ApprovalExpandedDetailsProps {
  entry: SpeakUpItem;
}

export const ApprovalExpandedDetails = ({ entry }: ApprovalExpandedDetailsProps) => {
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1920);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Tailwind breakpoints: xl = 1280px, 2xl = 1536px
  // Determine which fields should be shown in expanded row based on screen size
  // Employee Name, Designation, and Assigned Employee are hidden on < 2xl (1536px) screens in table
  // Show them in expanded row when they're hidden in the table
  const showEmployeeName = windowWidth < 1536; // < 2xl: Employee Name is hidden in table
  const showDesignation = windowWidth < 1536; // < 2xl: Designation is hidden in table
  const showAssignedEmployee = windowWidth < 1536; // < 2xl: Assigned Employee is hidden in table

  // Calculate total number of visible columns for colSpan based on actual table structure:
  // Screen < 2xl: Expand button, Employee Number, Type, Status, Actions = 5 columns
  // Screen >= 2xl: Expanded row doesn't render (all fields visible in table, no expand button)
  // Since expanded row only renders when windowWidth < 1536, colSpan is always 5
  const colSpan = 5; // Always 5 when expanded row is shown (Expand + Employee Number + Type + Status + Actions)

  const hasFieldsToShow = showEmployeeName || showDesignation || showAssignedEmployee;

  if (!hasFieldsToShow) return null;

  return (
    <tr className="bg-gray-50/60 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-600">
      <td colSpan={colSpan} className="px-3 sm:px-4 py-3">
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Employee Name (only when hidden in table: < 2xl screens) */}
            {showEmployeeName && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FiUser className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Employee Name
                  </div>
                </div>
                <div className="text-sm text-gray-900 dark:text-white whitespace-normal break-words">
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
                </div>
              </div>
            )}

            {/* Designation (only when hidden in table: < 2xl screens) */}
            {showDesignation && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FiBriefcase className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Designation
                  </div>
                </div>
                <div className="text-sm text-gray-900 dark:text-white whitespace-normal break-words">
                  {entry.IsAnonymous ? "—" : (entry.Designation || "—")}
                </div>
              </div>
            )}

            {/* Assigned Employee (only when hidden in table: < 2xl screens) */}
            {showAssignedEmployee && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FiUserCheck className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Assigned Employee
                  </div>
                </div>
                <div className="text-sm text-gray-900 dark:text-white whitespace-normal break-words">
                  {entry.AssignedEmp || "—"}
                </div>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

