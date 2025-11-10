import { FiCheck, FiX } from "react-icons/fi";

interface StatusIndicatorProps {
    value: boolean;
}

export const StatusIndicator = ({ value }: StatusIndicatorProps) => (
    <div className={"px-3 py-2 rounded-lg text-sm " +
        (value ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
              : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300')}>
        <div className="flex items-center">
            {value ? <FiCheck className="mr-2" /> : <FiX className="mr-2" />}
            <span>{value ? 'Enabled' : 'Disabled'}</span>
        </div>
    </div>
);
