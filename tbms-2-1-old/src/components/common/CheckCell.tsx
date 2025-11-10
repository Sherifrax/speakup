import { FiCheck, FiX } from "react-icons/fi";

interface CheckCellProps {
    value: boolean;
}

export const CheckCell = ({ value }: CheckCellProps) => (
    <div className="flex items-center">
        {value ? (
            <>
                <FiCheck className="mr-1 text-green-500" />
                <span className="text-green-600 dark:text-green-400">Yes</span>
            </>
        ) : (
            <>
                <FiX className="mr-1 text-red-500" />
                <span className="text-red-600 dark:text-red-400">No</span>
            </>
        )}
    </div>
);
