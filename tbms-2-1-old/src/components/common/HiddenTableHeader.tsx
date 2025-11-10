import React from "react";

interface HiddenTableHeaderProps {
    column: string;
    label: string;
    onSort: (column: string) => void;
    sortColumn: string | null;
    sortDirection: "asc" | "desc";
    breakpoint?: string;
}

export const HiddenTableHeader: React.FC<HiddenTableHeaderProps> = ({
    column,
    label,
    onSort,
    sortColumn,
    sortDirection,
    breakpoint = "2xl",
}) => {
    const getSortIcon = () => {
        if (sortColumn === column) {
            return sortDirection === "asc" ? <span>▲</span> : <span>▼</span>;
        }
        return null;
    };

    return (
        <th
            scope="col"
            className={`hidden ${breakpoint}:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}
            onClick={() => onSort(column)}
        >
            <div className="flex items-center justify-between">
                <span>{label}</span>
                {getSortIcon()}
            </div>
        </th>
    );
};

