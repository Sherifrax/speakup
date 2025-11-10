import { useEffect } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { useApiKey } from "../../features/apiKeyManagement/hooks/useApiKey";
import { useApiKeyFilters } from "../../features/apiKeyManagement/hooks/useApiKeyFilters";
import { ApiKeyFilter } from "../../features/apiKeyManagement/components/Filters";
import { ApiKeyFormModal } from "../../features/apiKeyManagement/components/FormModal";
import { Toolbar } from "../../features/apiKeyManagement/components/Toolbar";
import { ApiKeyTableWrapper } from "../../features/apiKeyManagement/components/TableWrapper";
import { ApiKey } from "../../features/apiKeyManagement/types/apiKeyTypes";
import { useSearch } from "../../hooks/useSearch";
import { useSort } from "../../hooks/useSort";
import { useMediaQuery } from "react-responsive";

export const ApiKeyManagementPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
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
    apiKeys,
    saveStatus,
    handleSave,
    resetForm,
    fetchApiKeys,
    errors,
    loading,
  } = useApiKey();

  const { searchQuery, handleSearchChange: originalHandleSearchChange, resetSearch } = useSearch();
  const { filters, handleFilterChange: originalHandleFilterChange, resetFilters: originalResetFilters } = useApiKeyFilters();
  const { sortColumn, sortDirection, handleSort } = useSort();

  useEffect(() => {
    fetchApiKeys(
      {
        clientName: searchQuery,
        isActive: filters.isActive !== "" ? Number(filters.isActive) : -1,
        isIpCheck: filters.isIpCheck !== "" ? Number(filters.isIpCheck) : -1,
        isCountryCheck: filters.isCountryCheck !== "" ? Number(filters.isCountryCheck) : -1,
        isRegionCheck: filters.isRegionCheck !== "" ? Number(filters.isRegionCheck) : -1,
      },
      {
        page: currentPage,
        size: pageSize,
        sortBy: sortColumn || "clientName",
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

  const handleEdit = (apiKey: ApiKey) => {
    setFormData(apiKey);
    setIsFormOpen(true);
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <>
      <PageMeta title="API Key Management" description="" />
      <ComponentCard
        title="API Key Management"
        className="shadow-xl rounded-3xl border border-gray-200 dark:border-gray-700"
      >
        <div className="space-y-6 relative p-6">
          <Toolbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
            onAddClick={() => setIsFormOpen(true)}
          />

          <ApiKeyFilter
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

          <ApiKeyTableWrapper
            isMobile={isMobile}
            apiKeys={apiKeys}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEdit={handleEdit}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalRecords}
            itemsPerPage={pageSize}
            isLoading={loading}
          />
        </div>
      </ComponentCard>

      <ApiKeyFormModal
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
      />
    </>
  );
};

export default ApiKeyManagementPage;
