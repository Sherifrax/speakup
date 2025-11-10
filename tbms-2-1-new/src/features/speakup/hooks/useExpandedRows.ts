import { useState } from "react";

export const useExpandedRows = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const collapseAllRows = () => {
    setExpandedRows(new Set());
  };

  const expandAllRows = (rowIds: string[]) => {
    setExpandedRows(new Set(rowIds));
  };

  return {
    expandedRows,
    toggleRowExpansion,
    collapseAllRows,
    expandAllRows,
  };
};

