import { useState } from "react";

export const useExpandedRows = () => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRowExpansion = (clientName: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            newSet.has(clientName) ? newSet.delete(clientName) : newSet.add(clientName);
            return newSet;
        });
    };

    return { expandedRows, toggleRowExpansion };
};

