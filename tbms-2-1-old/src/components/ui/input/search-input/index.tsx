import { FiSearch } from "react-icons/fi";
import { ReactNode } from "react";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  icon = <FiSearch className="w-5 h-5" />,
  containerClassName = "",
  inputClassName = ""
}: SearchInputProps) => {
  return (
    <div className="relative w-full">
      <div className={`flex rounded-full shadow-md transition-shadow w-full bg-gray-100 dark:bg-gray-800 ${containerClassName}`}>
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          {icon}
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full py-4 pl-12 pr-4 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white text-sm max-[400px]:text-xs ${inputClassName}`}
        />
      </div>
    </div>
  );
};