import React from "react";
import { SpeakUpItem } from "../types/speakupTypes";
import { DataTable } from "../../../features/common/components/tables/DataTable";
import { dataColumns } from "./dataColumns";
import { ActionType } from "../../../enum/actionType.enum";

interface SpeakUpTableProps {
  speakUpList: SpeakUpItem[];
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSort: (column: string, direction: "asc" | "desc") => void;
  sortColumn: string | null;
  sortDirection: "asc" | "desc" | null;
  loading?: boolean;
  actionHandlers: {
    onInfo?: (item: SpeakUpItem, actionBy: string) => void;
    onEdit?: (item: SpeakUpItem, actionBy: string) => void;
    onSubmit?: (item: SpeakUpItem, actionType: ActionType, actionBy: string) => void;
    onCancel?: (item: SpeakUpItem, actionType: ActionType, actionBy: string) => void;
  };
}

export const SpeakUpTable: React.FC<SpeakUpTableProps> = ({
  speakUpList,
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  onSort,
  sortColumn,
  sortDirection,
  loading = false,
  actionHandlers,
}) => {
  return (
    <DataTable<SpeakUpItem>
      columns={dataColumns(actionHandlers)}
      dataSource={speakUpList}
      totalItems={totalItems}
      pageSize={pageSize}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onSort={onSort}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      isLoading={loading}
    />
  );
};
