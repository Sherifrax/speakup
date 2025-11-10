// features/apiKeyManagement/hooks/useApiKeyManagement.ts
import { useState } from "react";
import { useSaveApiKeyMutation } from "../../../services/ApiKey/save";
import { useSearchApiKeysQuery } from "../../../services/ApiKey/search";
import { ApiKeyFormData } from "../types/apiKeyTypes";

export const useApiKeyManagement = () => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({}); // Add errors state

  const { data: apiKeys = [], refetch } = useSearchApiKeysQuery({});
  const [saveApiKey] = useSaveApiKeyMutation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return; // Validate before saving

    try {
      setSaveStatus("saving");
      await saveApiKey(formData).unwrap();
      setSaveStatus("success");
      setTimeout(() => {
        setIsFormOpen(false);
        resetForm();
        refetch();
        setSaveStatus("idle");
      }, 1000);
    } catch (error) {
      console.error("Error saving API key:", error);
      setSaveStatus("error");
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
    setErrors({}); // Clear errors on reset
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
    saveStatus,
    apiKeys,
    handleSave,
    resetForm,
    refetch,
    errors, // Return errors
  };
};