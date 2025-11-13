import { useEffect, useState } from "react";
import ComponentCard from "../../features/common/components/page/ComponentCard";
import PageMeta from "../../features/common/components/page/PageMeta";
import { useSpeakUp } from "../../features/speakup/hooks/useSpeakUp";
import { useSpeakUpFilters } from "../../features/speakup/hooks/useSpeakUpFilters";
import { SpeakUpFilter } from "../../features/speakup/components/dataFilters";
import { SpeakUpFormModal } from "../../features/speakup/components/formModal";
import { HistoryModal } from "../../features/speakup/components/HistoryModal";
import { Toolbar } from "../../features/speakup/components/toolBar";
import { SpeakUpTable } from "../../features/speakup/components/dataTable";
import { SpeakUpEntry as SpeakUpEntryType } from "../../features/speakup/types/speakupTypes";
import { useSearch } from "../../features/common/hooks/useSearch";
import { useSort } from "../../features/common/hooks/useSort";
import { ActionType } from "../../enum/actionType.enum";
import { ActionModal } from "../../features/speakup/components/actionModal";
import { PaginationWrapper } from "../../features/common/components/tables/PaginationWrapper";

export const SpeakUpManagePage = () => {
  const {
    isFormOpen,
    setIsFormOpen,
    isFilterOpen,
    setIsFilterOpen,
    isViewOpen,
    selectedEntry,
    formData,
    setFormData,
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    speakUpEntries,
    loading,
    saveStatus,
    handleSave,
    handleSubmit,
    resetForm,
    fetchSpeakUpEntries,
    handleEdit,
    handleView,
    closeViewModal,
    errors,
    filtersData,
    isLoadingFilters,
    isLoadingEntry,
    editingEntryId,
  } = useSpeakUp();

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

  // Action handlers for table
  const handleSpeakUpGetActions = async (
    record: SpeakUpEntryType,
    actionBy: string
  ) => {
    if (actionBy === "btnEdit") {
      handleEdit(record);
    } else if (actionBy === "btnInfo") {
      handleView(record);
    }
  };

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyEntry, setHistoryEntry] = useState<SpeakUpEntryType | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<SpeakUpEntryType | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionType>(ActionType.Submit);

  const openActionModal = (
    record: SpeakUpEntryType,
    actionType: ActionType,
  ) => {
    setSelectedRecord(record);
    setCurrentAction(actionType);
    setIsActionModalOpen(true);
  };

  const handleDelete = (entry: SpeakUpEntryType) => {
    if (window.confirm(`Are you sure you want to delete SpeakUp entry #${entry.ID}?`)) {
      // Handle delete action - you may need to implement a delete API endpoint
      console.log("Delete entry:", entry);
      // For now, we can use Cancel action as delete
      handleSubmit(entry, "Cancel", "Deleted by user", "");
    }
  };

  const handleApprove = (entry: SpeakUpEntryType) => {
    openActionModal(entry, ActionType.Approve);
  };

  const handleReject = (entry: SpeakUpEntryType) => {
    openActionModal(entry, ActionType.Reject);
  };

  const handleCancel = (entry: SpeakUpEntryType) => {
    openActionModal(entry, ActionType.Cancel);
  };

  const handleSubmitEntry = (entry: SpeakUpEntryType) => {
    openActionModal(entry, ActionType.Submit);
  };

  const handleViewHistory = (entry: SpeakUpEntryType) => {
    setHistoryEntry(entry);
    setIsHistoryOpen(true);
  };

  const closeHistoryModal = () => {
    setIsHistoryOpen(false);
    setHistoryEntry(null);
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <>
      <PageMeta title="Speak Up" description="Speak Up Entry" />
      
      {/* Page Title Section */}
      <div className="mb-6 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="block text-[32px] font-extrabold leading-[39px] text-[rgb(0,5,54)] font-montserrat mb-0">
              Speak Up
            </h1>
          </div>
        </div>
      </div>
      
      <ComponentCard title="Track Speak Up entries and submissions"                 className="shadow-xl rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/10 dark:bg-gray-900/10">
        <div className="space-y-6 relative p-6">
          {/* Toolbar */}
          <Toolbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
            onAddClick={() => setIsFormOpen(true)}
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
          <SpeakUpTable
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
              onEdit: handleSpeakUpGetActions,
              onInfo: handleSpeakUpGetActions,
              onSubmit: handleSubmitEntry,
              onCancel: handleCancel,
              onView: handleView,
              onDelete: handleDelete,
              onApprove: handleApprove,
              onReject: handleReject,
              onViewHistory: handleViewHistory,
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

      <SpeakUpFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          resetForm();
        }}
        formData={formData}
        onFormChange={(data) => {
          setFormData(data);
        }}
        onSave={handleSave}
        saveStatus={saveStatus}
        errors={errors}
        typeOptions={typeOptions}
        isLoadingTypes={isLoadingFilters}
        isLoadingEntry={isLoadingEntry}
        editingEntryId={editingEntryId}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={closeHistoryModal}
        entry={historyEntry}
      />

      {/* Action Modal */}
      <ActionModal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setSelectedRecord(null);
        }}
        actionType={currentAction}
        encryptedData={selectedRecord?.encryptedData || ""}
        assignedEmp={selectedRecord?.AssignedEmp || ""}
        onSuccess={() => {
          fetchSpeakUpEntries(); // Refresh the list after successful action
        }}
      />
    </>
  );
};

export default SpeakUpManagePage;
