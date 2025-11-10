import { ApiKey } from "../types/apiKeyTypes";
import { ApiKeyStatusChecks } from "../constants";

interface ApiKeyExpandedDetailsProps {
    apiKey: ApiKey;
}

export const ApiKeyExpandedDetails = ({ apiKey }: ApiKeyExpandedDetailsProps) => {
    return (
        <tr className="2xl:hidden bg-gray-50 dark:bg-gray-700">
            <td colSpan={8} className="px-4 py-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="font-medium text-gray-500 dark:text-gray-400">API Key</div>
                        <div className="mt-1 text-gray-900 dark:text-white truncate">{apiKey.apiKey || "N/A"}</div>
                    </div>
                    {ApiKeyStatusChecks.map(({ label, key }) => (
                        <div key={label}>
                            <div className="font-medium text-gray-500 dark:text-gray-400">{label}</div>
                            <div className="mt-1">
                                {apiKey[key as keyof ApiKey] ? (
                                    <span className="text-green-600 dark:text-green-400">Enabled</span>
                                ) : (
                                    <span className="text-red-600 dark:text-red-400">Disabled</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </td>
        </tr>
    );
};

