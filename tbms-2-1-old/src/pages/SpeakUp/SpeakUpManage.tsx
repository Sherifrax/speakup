import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { useSpeakUp } from "../../features/speakUp/hooks/useSpeakUp";
import { useSpeakUpFilters } from "../../features/speakUp/hooks/useSpeakUpFilters";
import { SpeakUpFilter } from "../../features/speakUp/components/SpeakUpFilters";
import { SpeakUpFormModal } from "../../features/speakUp/components/SpeakUpFormModal";
import { SpeakUpViewModal } from "../../features/speakUp/components/SpeakUpViewModal";
import { HistoryModal } from "../../features/speakUp/components/HistoryModal";
import { Toolbar } from "../../features/speakUp/components/SpeakUpToolbar";
import { SpeakUpTableWrapper } from "../../features/speakUp/components/SpeakUpTableWrapper";
import { SpeakUpEntry as SpeakUpEntryType } from "../../features/speakUp/types/speakUpTypes";
import { useSearch } from "../../hooks/useSearch";
import { useSort } from "../../hooks/useSort";
import { useMediaQuery } from "react-responsive";

export const SpeakUpManage: React.FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyEntry, setHistoryEntry] = useState<SpeakUpEntryType | null>(null);
  
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
        IsAnonymous: filters.IsAnonymous && filters.IsAnonymous !== "" ? parseInt(filters.IsAnonymous, 10) : 0,
        CompId: 1,
        StatusID: filters.StatusID,
        TypeID: filters.TypeID,
        CommonSearchString: searchQuery,
      },
      {
        page: currentPage,
        size: pageSize,
        sortBy: sortColumn || "id",
        sortOrder: sortDirection,
      }
    );
  }, [searchQuery, filters, currentPage, pageSize, sortColumn, sortDirection]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    originalHandleSearchChange(e);
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    originalHandleFilterChange(e);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    originalResetFilters();
    resetSearch();
    setCurrentPage(1);
  };

  // handleView is now provided by the useSpeakUp hook

  const handleDelete = (entry: SpeakUpEntryType) => {
    // Handle delete action
    console.log("Delete entry:", entry);
  };

  const handleApprove = (entry: SpeakUpEntryType) => {
    handleSubmit(entry, "Approve");
  };

  const handleReject = (entry: SpeakUpEntryType) => {
    handleSubmit(entry, "Reject");
  };

  const handleCancel = (entry: SpeakUpEntryType) => {
    handleSubmit(entry, "Cancel");
  };

  const handleSubmitEntry = (entry: SpeakUpEntryType) => {
    handleSubmit(entry, "Submit");
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
      <div className="mb-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Speak Up Entry
            </h1>
          </div>
        </div>
      </div>
      
      <ComponentCard title="Track Speak Up entries and submissions" className="shadow-xl rounded-3xl border border-gray-200 dark:border-gray-700">
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
            speakUpStatuses={filtersData?.speakUpStatus || []}
            speakUpTypes={filtersData?.speakUpType || []}
            isLoading={isLoadingFilters}
          />

          {/* Table */}
          <SpeakUpTableWrapper
            isMobile={isMobile}
            speakUpEntries={speakUpEntries}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
            onCancel={handleCancel}
            onSubmit={handleSubmitEntry}
            onViewHistory={handleViewHistory}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalRecords}
            itemsPerPage={pageSize}
            isLoading={false}
            isEndUser={true}
          />
        </div>
      </ComponentCard>

      <SpeakUpFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          resetForm();
        }}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSave}
        saveStatus={saveStatus}
        errors={errors}
        speakUpTypes={filtersData?.speakUpType || []}
        isLoadingTypes={isLoadingFilters}
        isLoadingEntry={isLoadingEntry}
        editingEntryId={editingEntryId}
      />

      <SpeakUpViewModal
        isOpen={isViewOpen}
        onClose={closeViewModal}
        entry={selectedEntry}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={closeHistoryModal}
        entry={historyEntry}
      />
    </>
  );
};


