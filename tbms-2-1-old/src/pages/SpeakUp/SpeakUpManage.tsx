import { useEffect, useState } from "react";
import ComponentCard from "../../features/common/components/page/ComponentCard"
import PageMeta from "../../features/common/components/page/PageMeta";
import { useSpeakUp } from "../../features/speakup/hooks/useSpeakUp";
import { useSpeakUpFilters } from "../../features/speakup/hooks/useSpeakUpFilters";
import { SpeakUpFilter } from "../../features/speakup/components/dataFilters";
import { SpeakUpFormModal } from "../../features/speakup/components/formModal";
import { Toolbar } from "../../features/speakup/components/toolBar";
import { SpeakUpTable } from "../../features/speakup/components/dataTable";
import {
  SpeakUpItem,
  SpeakUpSaveParams,
} from "../../features/speakup/types/speakupTypes";
import { useSearch } from "../../features/common/hooks/useSearch";
import { useSort } from "../../features/common/hooks/useSort";
import { useGetSpeakupByIdMutation } from "../../services/Speakup/GetById";
import { ActionType } from "../../enum/actionType.enum";
import { ActionModal } from "../../features/speakup/components/actionModal";

export const SpeakUpManagePage = () => {
  const {
    isFormOpen,
    setIsFormOpen,
    isFilterOpen,
    setIsFilterOpen,
    formData,
    setFormData,
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    speakUpList,
    saveStatus,
    handleSave,
    resetForm,
    fetchSpeakUps,
    errors,
    loading,
  } = useSpeakUp();

  const {
    searchQuery,
    handleSearchChange: originalHandleSearchChange,
    resetSearch,
  } = useSearch();
  const { sortColumn, sortDirection, handleSort } = useSort();

  // 🔹 Use filters hook with dropdown & encryption data
  const {
    filters,
    handleFilterChange: originalHandleFilterChange,
    resetFilters: originalResetFilters,
    options,
    isLoading: filterLoading,
  } = useSpeakUpFilters();

  // 🔹 Extract dropdowns & encryption key
  const typeOptions = options?.typeOptions || [];

  // 🔹 Mutation for GetById API
  const [getSpeakupById, { isLoading: getLoading }] =
    useGetSpeakupByIdMutation();

  // ✅ Fetch list when filters/search/pagination/sort changes
  useEffect(() => {
    const searchParams = {
      TypeID: filters.TypeID !== -1 ? Number(filters.TypeID) : 0,
      StatusID: filters.StatusID !== -1 ? Number(filters.StatusID) : 0,
      IsAnonymous: filters.IsAnonymous ? 1 : 0,
      CommonSearchString: searchQuery,
      compID: filters.compID ?? 0,
    };

    const pagination = {
      page: currentPage,
      size: pageSize,
      sortBy: sortColumn || "ID",
      sortOrder: sortDirection,
    };

    fetchSpeakUps(searchParams, pagination);
  }, [searchQuery, filters, currentPage, pageSize, sortColumn, sortDirection]);

  // ✅ Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    originalHandleSearchChange(e);
    setCurrentPage(1);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    originalHandleFilterChange(e);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    originalResetFilters();
    resetSearch();
    setCurrentPage(1);
  };

  const handleSpeakUpGetActions = async (
    record: SpeakUpItem,
    actionBy: string
  ) => {
    try {
      const body = { encryptedData: record.ID.toString() };
      const response = await getSpeakupById(body).unwrap();

      const updatedFormData: SpeakUpSaveParams = {
        ID: response.Id,
        IsAnonymous: response.IsAnonymous ? 1 : 0,
        Attachment: response.Attachment || "",
        compID: 0,
        TypeID: Number(response.SpeakUpTypeID) || 0,
        Message: response.Message || "",
        encryptedData: record.encryptedData,
        actionBy, // ✅ dynamic string value ("btnEdit", "btnInfo", etc.)
      };

      setFormData(updatedFormData);
      setIsFormOpen(true);
    } catch (error) {
      console.error(`Error fetching SpeakUp by ID for ${actionBy}:`, error);
    }
  };

  const [selectedRecord, setSelectedRecord] = useState<SpeakUpItem | null>(
    null
  );
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionType>(ActionType.Submit);
  const [actionBy, setActionBy] = useState<string>("");

  const openActionModal = (
    record: SpeakUpItem,
    actionType: ActionType,
    actionByStr: string
  ) => {
    setSelectedRecord(record); // store the current record
    setCurrentAction(actionType); // store the action type
    setActionBy(actionByStr); // store actionBy string
    setIsActionModalOpen(true); // open modal
  };

  const handlePrint = (record: SpeakUpItem) => {
    console.log("Print SpeakUp Record:", record);
  };

  return (
    <>
      <PageMeta title="SpeakUp Management" description="" />
      <ComponentCard
        title="SpeakUp Management"
        className="shadow-xl rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm"
      >
        <div className="space-y-6 relative p-6">
          {/* Toolbar */}
          <Toolbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
            onAddClick={() => {
              resetForm("btnAdd");
              setIsFormOpen(true);
            }}
          />

          {/* Table */}
          <SpeakUpTable
            speakUpList={speakUpList}
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
              onSubmit: openActionModal,
              onCancel: handlePrint,
            }}
          />
        </div>
      </ComponentCard>

      {/* Filter Modal */}
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
      />

      {/* Form Modal */}
      <SpeakUpFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          resetForm();
        }}
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSave}
        saveStatus={saveStatus}
        errors={errors}
        typeOptions={typeOptions}
        encryptedData={formData.encryptedData}
      />

      {/* Action Modal */}
      <ActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        actionType={currentAction}
        encryptedData={selectedRecord?.encryptedData || ""}
        approvalActionID={0}
        assignedEmp={selectedRecord?.AssignedEmp || ""}
        actionBy={actionBy}
      />
    </>
  );
};

export default SpeakUpManagePage;
