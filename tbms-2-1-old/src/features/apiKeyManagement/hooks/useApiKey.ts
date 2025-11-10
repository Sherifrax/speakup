import { useState, useEffect } from "react";
import { useSaveApiKeyMutation } from "../../../services/ApiKey/save";
import { ApiKeyFormData } from "../types/apiKeyTypes";
import { useSearchApiKeysMutation } from "../../../services/ApiKey/searchNew";
import { ApiKeySearchParams } from "../types/apiKeyTypes";
import { PaginationParams } from "../../../types/pagination";
import { PaginationDefaults } from "../../../enum/Pagination.enum";
import { SaveStatus } from "../../../types/common";

export const useApiKey = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [formData, setFormData] = useState<ApiKeyFormData>({
    apiKey: null,
    clientName: "",
    isActive: false,
    isIpCheck: false,
    isCountryCheck: false,
    isRegionCheck: false,
  });

  const [currentPage, setCurrentPage] = useState(PaginationDefaults.Page);
  const [pageSize] = useState(PaginationDefaults.PageSize);
  const [totalRecords, setTotalRecords] = useState(0);

  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Idle);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [saveApiKey] = useSaveApiKeyMutation();

  const [searchApiKeys] = useSearchApiKeysMutation();

  // 🔍 Fetch API Keys with pagination & filters
  const fetchApiKeys = async (
    filters: ApiKeySearchParams = {},
    pagination: PaginationParams = {}
  ) => {
    try {
      setLoading(true);

      const postFilters: ApiKeySearchParams = {
      clientName: filters.clientName ?? "",
      isActive: filters.isActive ?? -1,
      isIpCheck: filters.isIpCheck ?? -1,
      isCountryCheck: filters.isCountryCheck ?? -1,
      isRegionCheck: filters.isRegionCheck ?? -1,
    };

      const params = {
        search: postFilters,
        pagination: {
          page: pagination.page || currentPage,
          size: pagination.size || pageSize,
          sortBy: pagination.sortBy || "clientName",
          sortOrder: pagination.sortOrder || "asc",
        },
      };

      const response: any = await searchApiKeys(params).unwrap();

      setApiKeys(response.data || []);
      setTotalRecords(response.total_rows || 0);
    } catch (err) {
      console.error("Error fetching API keys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, [currentPage]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaveStatus(SaveStatus.Saving);
      await saveApiKey(formData).unwrap();
      setSaveStatus(SaveStatus.Success);
      setTimeout(() => {
        setIsFormOpen(false);
        resetForm();
        fetchApiKeys();
        setSaveStatus(SaveStatus.Idle);
      }, 1000);
    } catch (error) {
      console.error("Error saving API key:", error);
      setSaveStatus(SaveStatus.Error);
    }
  };

  const resetForm = () => {
    setFormData({
      apiKey: null,
      clientName: "",
      isActive: false,
      isIpCheck: false,
      isCountryCheck: false,
      isRegionCheck: false,
    });
    setErrors({});
  };

  return {
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
    loading,
    saveStatus,
    handleSave,
    resetForm,
    fetchApiKeys,
    errors,
  };
};
