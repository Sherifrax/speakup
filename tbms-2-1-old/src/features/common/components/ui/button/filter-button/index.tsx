import { ReactNode } from "react";

interface FilterButtonProps {
  onClick: () => void;
  className?: string;
  iconClassName?: string;
  ariaLabel?: string;
  icon?: ReactNode;
}

export const FilterButton = ({
  onClick,
  className = "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors",
  iconClassName = "w-5 h-5 text-gray-700 dark:text-white",
  ariaLabel = "Open filters",
  icon = (
    <svg
    className="w-5 h-5 text-gray-700 dark:text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
  )
}: FilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
    >
      <span className={iconClassName}>
        {icon}
      </span>
    </button>
  );
};
