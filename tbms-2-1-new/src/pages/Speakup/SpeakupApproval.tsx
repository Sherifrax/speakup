import { useEffect, useState } from "react";
import ComponentCard from "../../features/common/components/page/ComponentCard";
import PageMeta from "../../features/common/components/page/PageMeta";
import { useSpeakUpApproval } from "../../features/speakup/hooks/approval/useSpeakUpApproval";
import { useSpeakUpFilters } from "../../features/speakup/hooks/shared/useSpeakUpFilters";
import { SpeakUpFilter } from "../../features/speakup/components/shared/dataFilters";
import { ViewMessageModal } from "../../features/speakup/components/approval/ViewMessageModal";
import { HistoryModal } from "../../features/speakup/components/shared/HistoryModal";
import { Toolbar } from "../../features/speakup/components/shared/toolBar";
import { ApprovalTable } from "../../features/speakup/components/approval/ApprovalTable";
import { SpeakUpEntry as SpeakUpEntryType } from "../../features/speakup/types/speakupTypes";
import { useSearch } from "../../features/common/hooks/useSearch";
import { useSort } from "../../features/common/hooks/useSort";
import { ActionType } from "../../enum/actionType.enum";
import { ApprovalActionModal } from "../../features/speakup/components/approval/ApprovalActionModal";
import { UpdateHistoryModal } from "../../features/speakup/components/approval/UpdateHistoryModal";
import { PaginationWrapper } from "../../features/common/components/tables/PaginationWrapper";

export const SpeakUpApprovalPage = () => {
  const {
    isFilterOpen,
    setIsFilterOpen,
    isViewOpen,
    selectedEntry,
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    speakUpEntries,
    loading,
    fetchSpeakUpEntries,
    handleView,
    closeViewModal,
    filtersData,
    isLoadingFilters,
  } = useSpeakUpApproval();

  const { searchQuery, handleSearchChange: originalHandleSearchChange, resetSearch } = useSearch();
  const { filters, handleFilterChange: originalHandleFilterChange, resetFilters: originalResetFilters } = useSpeakUpFilters();
  const { sortColumn, sortDirection, handleSort } = useSort();

  useEffect(() => {
    fetchSpeakUpEntries(
      {
        IsAnonymous: filters.IsAnonymous && filters.IsAnonymous !== 0 ? filters.IsAnonymous : 0,
        CompId: 1,
        StatusID: filters.StatusID,
        TypeID: filters.TypeID,
        CommonSearchString: searchQuery,
      },
      {
        page: currentPage,
        size: pageSize,
        ...(sortColumn && {
          sortBy: sortColumn,
          sortOrder: sortDirection,
        }),
      }
    );
  }, [searchQuery, filters, currentPage, pageSize, sortColumn, sortDirection]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    originalHandleSearchChange(e);
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    originalHandleFilterChange(e);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    originalResetFilters();
    resetSearch();
    setCurrentPage(1);
  };

  // Convert filtersData to KeyValuePair format for components
  const typeOptions = filtersData?.speakUpType?.map(item => ({
    key: String(item.key),
    value: item.value,
  })) || [];

  const statusOptions = filtersData?.speakUpStatus?.map(item => ({
    key: String(item.key),
    value: item.value,
  })) || [];

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyEntry, setHistoryEntry] = useState<SpeakUpEntryType | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<SpeakUpEntryType | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionType>(ActionType.Approve);
  const [isUpdateHistoryOpen, setIsUpdateHistoryOpen] = useState(false);

  const openActionModal = (
    record: SpeakUpEntryType,
    actionType: ActionType,
  ) => {
    setSelectedRecord(record);
    setCurrentAction(actionType);
    setIsActionModalOpen(true);
  };

  const handleApprove = (entry: SpeakUpEntryType) => {
    openActionModal(entry, ActionType.Approve);
  };

  const handleReject = (entry: SpeakUpEntryType) => {
    openActionModal(entry, ActionType.Reject);
  };

  const handleAssign = (entry: SpeakUpEntryType) => {
    openActionModal(entry, ActionType.Assign);
  };

  const handleCloseEntry = (entry: SpeakUpEntryType) => {
    openActionModal(entry, ActionType.Close);
  };

  const handleViewHistory = (entry: SpeakUpEntryType) => {
    setHistoryEntry(entry);
    setIsHistoryOpen(true);
  };

  const handleUpdateHistory = (entry: SpeakUpEntryType) => {
    setHistoryEntry(entry);
    setIsUpdateHistoryOpen(true);
  };

  const closeHistoryModal = () => {
    setIsHistoryOpen(false);
    setHistoryEntry(null);
  };

  const handleActionSuccess = () => {
    fetchSpeakUpEntries(
      {
        IsAnonymous: filters.IsAnonymous && filters.IsAnonymous !== 0 ? filters.IsAnonymous : 0,
        CompId: 1,
        StatusID: filters.StatusID,
        TypeID: filters.TypeID,
        CommonSearchString: searchQuery,
      },
      {
        page: currentPage,
        size: pageSize,
        ...(sortColumn && {
          sortBy: sortColumn,
          sortOrder: sortDirection,
        }),
      }
    );
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

    return (
    <>
      <PageMeta title="Speak Up Approval" description="Speak Up Approval" />
      
      {/* Page Title Section */}
      <div className="mb-6 pt-6">
        <div className="flex items-center justify-between">
        <div>
            <h1 className="block text-[32px] font-extrabold leading-[39px] text-[rgb(0,5,54)] font-montserrat mb-0">
              Speak Up (Approvals)
            </h1>
          </div>
        </div>
      </div>
      
      <ComponentCard title="Approve or reject Speak Up entries assigned to you"   className="shadow-xl rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/10 dark:bg-gray-900/10"
      >
        <div className="space-y-6 relative p-6">
          {/* Toolbar */}
          <Toolbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
            onAddClick={() => {}} // No add button for approval page
            showAddButton={false}
          />

          {/* Filters */}
          <SpeakUpFilter
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            onApply={() => {
              setIsFilterOpen(false);
              setCurrentPage(1);
            }}
            speakUpStatuses={statusOptions}
            speakUpTypes={typeOptions}
            isLoading={isLoadingFilters}
          />

          {/* Table */}
          <ApprovalTable
            speakUpList={speakUpEntries}
            totalItems={totalRecords}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            loading={loading}
            actionHandlers={{
              onViewMessage: handleView,
              onApprove: handleApprove,
              onReject: handleReject,
              onViewHistory: handleViewHistory,
              onAssign: handleAssign,
              onUpdateHistory: handleUpdateHistory,
              onCloseEntry: handleCloseEntry,
            }}
          />

          {/* Pagination */}
          {totalRecords > 0 && (
            <PaginationWrapper
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalRecords}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </ComponentCard>

      {/* View Message Modal */}
      <ViewMessageModal
        isOpen={isViewOpen}
        onClose={closeViewModal}
        entry={selectedEntry}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={closeHistoryModal}
        entry={historyEntry}
      />

      {/* Update History Modal */}
      <UpdateHistoryModal
        isOpen={isUpdateHistoryOpen}
        onClose={() => setIsUpdateHistoryOpen(false)}
        encryptedData={historyEntry?.encryptedData || ""}
        onSuccess={handleActionSuccess}
      />

      {/* Action Modal */}
      <ApprovalActionModal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setSelectedRecord(null);
        }}
        actionType={currentAction}
        encryptedData={selectedRecord?.encryptedData || ""}
        assignedEmp={selectedRecord?.AssignedEmp || ""}
        onSuccess={handleActionSuccess}
      />
    </>
  );
};

export default SpeakUpApprovalPage;
