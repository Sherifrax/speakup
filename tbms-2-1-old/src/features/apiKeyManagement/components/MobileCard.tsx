import { FiMinus, FiPlus, FiCopy, FiMoreVertical } from "react-icons/fi";
import { Dropdown } from "antd";
import { ApiKey } from "../types/apiKeyTypes";
import { StatusIndicator } from "../../../components/common/StatusIndicator";
import { ApiKeyActionMenu } from "./ActionsMenu";

interface ApiKeyMobileCardProps {
    apiKey: ApiKey;
    isExpanded: boolean;
    onToggle: () => void;
    onEdit: (apiKey: ApiKey) => void;
}

export const ApiKeyMobileCard = ({ apiKey, isExpanded, onToggle, onEdit }: ApiKeyMobileCardProps) => {
    const statusClass = apiKey.isActive
        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 flex justify-between items-center cursor-pointer" onClick={onToggle}>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white break-words max-w-[80px]">
                            {apiKey.clientName}
                        </h3>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}>
                            {apiKey.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
                <button
                    className={`ml-2 p-1.5 rounded-full ${isExpanded
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                        }`}
                >
                    {isExpanded ? <FiMinus className="h-3 w-3" /> : <FiPlus className="h-3 w-3" />}
                </button>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                    <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">API Key</div>
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <code className="text-sm break-all dark:text-white">{apiKey.apiKey || "N/A"}</code>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(apiKey.apiKey || "");
                                }}
                                className="ml-2 p-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                <FiCopy className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Active Check", key: "isActive" },
                            { label: "IP Check", key: "isIpCheck" },
                            { label: "Country Check", key: "isCountryCheck" },
                            { label: "Region Check", key: "isRegionCheck" },
                        ].map(({ label, key }) => (
                            <div key={label}>
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</div>
                                <StatusIndicator value={apiKey[key as keyof ApiKey] as boolean} />
                            </div>
                        ))}

                        <div className="col-span-2 pt-1">
                            <Dropdown
                                overlay={<ApiKeyActionMenu apiKey={apiKey} onEdit={onEdit} />}
                                trigger={["click"]}
                                placement="bottomRight"
                            >
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    <FiMoreVertical className="mr-2" />
                                    Actions
                                </button>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

