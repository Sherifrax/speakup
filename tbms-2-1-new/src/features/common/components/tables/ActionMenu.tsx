import React, { useState, useRef, useEffect } from "react";
import ActionConfig from "./ActionConfig ";

type ActionMenuProps = {
  rowId: string | number;
  actions: ActionConfig[];
  visible?: boolean;
};

export const ActionMenu: React.FC<ActionMenuProps> = ({
  rowId,
  actions,
  visible = true,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!visible) return null; // hide whole column if not needed

  return (
    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium relative">
      <div ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="ant-dropdown-trigger text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {/* Kebab Icon */}
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50">
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-300">
              {actions
                .filter((a) => a.visible) // show only allowed actions
                .map((action) => (
                  <li key={action.key}>
                    <button
                      className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        action.onClick(rowId);
                        setOpen(false);
                      }}
                    >
                      {action.icon && (
                        <span className="mr-2 text-blue-500">{action.icon}</span>
                      )}
                      {action.label}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </td>
  );
};
