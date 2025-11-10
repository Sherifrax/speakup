import { FiEdit } from "react-icons/fi";
import { Menu } from "antd";
import { ApiKey } from "../types/apiKeyTypes";
import { ApiKeyMenuItems } from "../constants";

interface ApiKeyActionsMenuProps {
    apiKey: ApiKey;
    onEdit: (apiKey: ApiKey) => void;
}

export const ApiKeyActionMenu = ({ apiKey, onEdit }: ApiKeyActionsMenuProps) => {
    const menu = (
        <Menu
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg"
            items={ApiKeyMenuItems.map(item => ({
                key: item.key,
                label: (
                    <button
                        onClick={() => {
                            if (item.key === "edit") onEdit(apiKey);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <FiEdit className="mr-2 text-blue-500" />
                        {item.label}
                    </button>
                ),
            }))}
        />
    );

    return menu;
};

