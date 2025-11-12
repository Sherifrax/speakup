import { useState, useEffect } from "react";
import { useSaveSpeakupMutation } from "../../../services/Speakup/save";
import { useSearchSpeakupMutation } from "../../../services/Speakup/searchEntry";
import { SpeakUpSaveParams, SpeakUpSearchParams } from "../types/speakupTypes";
import { PaginationParams } from "../../common/types/commonTypes";
import { PaginationDefaults } from "../../../enum/pagination.enum";
import { SaveStatus } from "../../common/types/status";

export const useSpeakUp = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [formData, setFormData] = useState<SpeakUpSaveParams>({
    ID: 0,
    IsAnonymous: 0,
    Attachment: "",
    compID: 0,
    TypeID: 0,
    Message: "",
    encryptedData: "",
    actionBy: "",
  });

  const [currentPage, setCurrentPage] = useState(PaginationDefaults.Page);
  const [pageSize] = useState(PaginationDefaults.PageSize);
  const [totalRecords, setTotalRecords] = useState(0);

  const [speakUpList, setSpeakUpList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Idle);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [saveSpeakUp] = useSaveSpeakupMutation();
  const [searchSpeakUp] = useSearchSpeakupMutation();

  // 🔍 Fetch SpeakUp records with pagination & filters
  const fetchSpeakUps = async (
    filters: Partial<SpeakUpSearchParams> = {},
    pagination: PaginationParams = {}
  ) => {
    try {
      setLoading(true);

      const postFilters: SpeakUpSearchParams = {
        IsAnonymous: filters.IsAnonymous ?? 0,
        compID: filters.compID ?? 1,
        StatusID: filters.StatusID ?? -1,
        TypeID: filters.TypeID ?? -1,
        CommonSearchString: filters.CommonSearchString ?? "",
      };

      const params = {
        search: postFilters,
        pagination: {
          page: pagination.page || currentPage,
          size: pagination.size || pageSize,
          sortBy: pagination.sortBy || "ID",
          sortOrder: pagination.sortOrder || "asc",
        },
      };

      const response: any = await searchSpeakUp(params).unwrap();

      setSpeakUpList(response?.data || []);
      setTotalRecords(response?.count?.[0]?.TotalCount || 0);
    } catch (err) {
      console.error("Error fetching SpeakUp records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakUps();
  }, [currentPage]);

  // Validate Form before Save
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.Message.trim()) {
      newErrors.Message = "Message is required";
    }
    if (formData.TypeID === -1) {
      newErrors.TypeID = "Please select a Type";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save SpeakUp record
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaveStatus(SaveStatus.Saving);
      await saveSpeakUp(formData).unwrap();
      setSaveStatus(SaveStatus.Success);
      setTimeout(() => {
        setIsFormOpen(false);
        resetForm();
        fetchSpeakUps();
        setSaveStatus(SaveStatus.Idle);
      }, 1000);
    } catch (error) {
      console.error("Error saving SpeakUp record:", error);
      setSaveStatus(SaveStatus.Error);
    }
  };

  // Reset form (optionally set actionBy)
  const resetForm = (actionBy: string = "") => {
    setFormData({
      ID: 0,
      IsAnonymous: 0,
      Attachment: "",
      compID: 0,
      TypeID: 0,
      Message: "",
      encryptedData: "",
      actionBy, 
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
    speakUpList,
    loading,
    saveStatus,
    handleSave,
    resetForm,
    fetchSpeakUps,
    errors,
  };
};
