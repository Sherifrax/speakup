import React from "react";
import { FiArrowUp, FiArrowDown, FiMoreVertical, FiPlus, FiMinus, FiCopy } from "react-icons/fi";
import { Dropdown } from "antd";
import { ApiKey, SortDirection } from "../types/apiKeyTypes";
import { useExpandedRows } from "../hooks/useExpandedRows";
import { StatusIndicator } from "../../../components/common/StatusIndicator";
import { CheckCell } from "../../../components/common/CheckCell";
import { TableHeader } from "../../../components/common/TableHeader";
import { HiddenTableHeader } from "../../../components/common/HiddenTableHeader";
import { ApiKeyActionMenu } from "./ActionsMenu";
import { ApiKeyMobileCard } from "./MobileCard";
import { ApiKeyExpandedDetails } from "./ExpandedDetails";

interface ApiKeyTableProps {
    apiKeys: ApiKey[];
    sortColumn: string | null;
    sortDirection: SortDirection;
    onSort: (column: string) => void;
    onEdit: (apiKey: ApiKey) => void;
}

export const ApiKeyTable: React.FC<ApiKeyTableProps> = ({
    apiKeys,
    sortColumn,
    sortDirection,
    onSort,
    onEdit,
}) => {
    const { expandedRows, toggleRowExpansion } = useExpandedRows();

    if (!apiKeys.length) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No API keys found matching the criteria.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Mobile Cards */}
            <div className="md:hidden space-y-3 p-3">
                {apiKeys.map((key) => (
                    <ApiKeyMobileCard
                        key={key.apiKey || key.clientName}
                        apiKey={key}
                        isExpanded={expandedRows.has(key.clientName)}
                        onToggle={() => toggleRowExpansion(key.clientName)}
                        onEdit={onEdit}
                    />
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="2xl:hidden px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" />
                            <TableHeader
                                column="clientName"
                                label="Client"
                                onSort={onSort}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                            />
                            <HiddenTableHeader
                                column="apiKey"
                                label="API Key"
                                onSort={onSort}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                            />
                            <TableHeader
                                column="isActive"
                                label="Status"
                                onSort={onSort}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                            />
                            <HiddenTableHeader
                                column="isIpCheck"
                                label="IP Check"
                                onSort={onSort}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                            />
                            <HiddenTableHeader
                                column="isCountryCheck"
                                label="Country"
                                onSort={onSort}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                            />
                            <HiddenTableHeader
                                column="isRegionCheck"
                                label="Region"
                                onSort={onSort}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                            />
                            <th
                                scope="col"
                                className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {apiKeys.map((key) => (
                            <React.Fragment key={key.apiKey || key.clientName}>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="2xl:hidden px-4 py-3 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleRowExpansion(key.clientName)}
                                            className={`ml-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${expandedRows.has(key.clientName)
                                                    ? "border-red-500 text-red-500 dark:border-red-400 dark:text-red-400"
                                                    : "border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400"
                                                } border`}
                                        >
                                            {expandedRows.has(key.clientName) ? (
                                                <FiMinus className="h-3 w-3" />
                                            ) : (
                                                <FiPlus className="h-3 w-3" />
                                            )}
                                        </button>
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {key.clientName}
                                        </div>
                                    </td>

                                    <td className="hidden 2xl:table-cell px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white truncate max-w-[1000px] xl:max-w-[180px] 2xl:max-w-none">
                                            {key.apiKey || "N/A"}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${key.isActive
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                }`}
                                        >
                                            {key.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="hidden 2xl:table-cell px-4 py-3 whitespace-nowrap">
                                        <CheckCell value={key.isIpCheck} />
                                    </td>

                                    <td className="hidden 2xl:table-cell px-4 py-3 whitespace-nowrap">
                                        <CheckCell value={key.isCountryCheck} />
                                    </td>

                                    <td className="hidden 2xl:table-cell px-4 py-3 whitespace-nowrap">
                                        <CheckCell value={key.isRegionCheck} />
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                        <Dropdown
                                            overlay={<ApiKeyActionMenu apiKey={key} onEdit={onEdit} />}
                                            trigger={["click"]}
                                            placement="bottomRight"
                                        >
                                            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                                <FiMoreVertical className="h-4 w-4" />
                                            </button>
                                        </Dropdown>
                                    </td>
                                </tr>

                                {expandedRows.has(key.clientName) && <ApiKeyExpandedDetails apiKey={key} />}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

