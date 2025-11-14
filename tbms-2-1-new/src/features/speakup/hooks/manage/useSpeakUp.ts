import { useState, useEffect } from "react";
import { useSaveSpeakUpMutation } from "../../../../services/Speakup/manage/save";
import { useSubmitSpeakUpMutation } from "../../../../services/Speakup/shared/submit";
import { useSearchSpeakUpMutation } from "../../../../services/Speakup/manage/search";
import { useGetSpeakUpFiltersQuery } from "../../../../services/Speakup/shared/getFilters";
import { useGetSpeakUpByIdQuery } from "../../../../services/Speakup/manage/getById";
import { 
  SpeakUpFormData, 
  SpeakUpSearchParams, 
  SpeakUpEntry,
  SpeakUpSaveRequest,
  SpeakUpSubmitRequest
} from "../../types/speakupTypes";
import { PaginationParams } from "../../../common/types/commonTypes";
import { PaginationDefaults } from "../../../../enum/pagination.enum";
import { SaveStatus } from "../../../common/types/status";

export const useSpeakUp = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<SpeakUpEntry | null>(null);
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [editingEncryptedPayload, setEditingEncryptedPayload] = useState<string | null>(null);

  const [formData, setFormData] = useState<SpeakUpFormData>({
    ID: 0,
    Message: "",
    Attachment: "",
    IsAnonymous: false,
    TypeID: -1,
    CompId: -1, // Use -1 as default as per API documentation
  });

  const [currentPage, setCurrentPage] = useState(PaginationDefaults.Page);
  const [pageSize] = useState(PaginationDefaults.PageSize);
  const [totalRecords, setTotalRecords] = useState(0);

  const [speakUpEntries, setSpeakUpEntries] = useState<SpeakUpEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Idle);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [saveSpeakUp] = useSaveSpeakUpMutation();
  const [submitSpeakUp] = useSubmitSpeakUpMutation();
  const [searchSpeakUp] = useSearchSpeakUpMutation();
  const { data: filtersData, isLoading: isLoadingFilters } = useGetSpeakUpFiltersQuery();
  const { data: entryData, isLoading: isLoadingEntry } = useGetSpeakUpByIdQuery(
    { payload: editingEncryptedPayload || "", compId: -1 },
    { skip: !editingEncryptedPayload }
  );

  // 🔍 Fetch Speak Up entries with pagination & filters
  const fetchSpeakUpEntries = async (
    filters: any = {},
    pagination: PaginationParams = {}
  ) => {
    try {
      setLoading(true);

      const searchParams: SpeakUpSearchParams = {
        IsAnonymous: filters.IsAnonymous && filters.IsAnonymous !== "" ? parseInt(filters.IsAnonymous, 10) : 0,
        compID: filters.CompId ?? (filters.compID ?? -1), // Support both CompId and compID for compatibility
        StatusID: filters.StatusID ?? "-1",
        TypeID: filters.TypeID ?? "-1",
        CommonSearchString: filters.CommonSearchString ?? "",
      };

      const paginationParams: PaginationParams = {
        page: pagination.page !== undefined ? pagination.page : currentPage,
        size: pagination.size || pageSize,
      };

      // Only include sortBy and sortOrder if they are explicitly provided
      if (pagination.sortBy) {
        paginationParams.sortBy = pagination.sortBy;
      }
      if (pagination.sortOrder) {
        paginationParams.sortOrder = pagination.sortOrder;
      }

      const params = {
        search: { params: searchParams },
        pagination: paginationParams,
      };

      console.log("Fetching Speak Up entries with params:", params);
      console.log("Search params being sent:", searchParams);
      console.log("Pagination params being sent:", paginationParams);

      const response: any = await searchSpeakUp(params).unwrap();

      setSpeakUpEntries(response.data || []);
      setTotalRecords(response.count?.[0]?.TotalCount || 0);
    } catch (err) {
      console.error("Error fetching Speak Up entries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakUpEntries();
  }, [currentPage]);

  // Effect to populate form when entry data is fetched for editing
  useEffect(() => {
    if (entryData && entryData.data && entryData.data.length > 0) {
      const entry = entryData.data[0];
      setFormData({
        ID: editingEntryId || 0,
        Message: entry.Message,
        Attachment: entry.Attachment,
        IsAnonymous: entry.IsAnonymous === 1,
        TypeID: entry.SpeakUpTypeID || -1,
        CompId: -1, // Default value as per API documentation
      });
    }
  }, [entryData, editingEntryId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.Message.trim()) {
      newErrors.Message = "Message is required";
    } else if (formData.Message.trim().length < 10) {
      newErrors.Message = "Message must be at least 10 characters long";
    } else if (formData.Message.trim().length > 1000) {
      newErrors.Message = "Message must be less than 1000 characters";
    }
    
    if (formData.TypeID === -1) {
      newErrors.TypeID = "Type is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaveStatus(SaveStatus.Saving);
      
      const isEditing = Boolean(editingEntryId);

      const saveRequest: SpeakUpSaveRequest = {
        params: {
          actionBy: isEditing ? "EditBtn" : "AddBtn",
          payload: isEditing ? editingEncryptedPayload ?? "" : undefined,
          IsAnonymous: formData.IsAnonymous ? 1 : 0,
          Attachment: formData.Attachment,
          TypeID: formData.TypeID,
          Message: formData.Message,
        },
      };

      if (isEditing && !saveRequest.params.payload) {
        throw new Error("Missing encrypted payload for edit action.");
      }

      await saveSpeakUp(saveRequest).unwrap();
      setSaveStatus(SaveStatus.Success);
      
      setTimeout(() => {
        setIsFormOpen(false);
        resetForm();
        fetchSpeakUpEntries();
        setSaveStatus(SaveStatus.Idle);
      }, 1000);
    } catch (error) {
      console.error("Error saving Speak Up entry:", error);
      setSaveStatus(SaveStatus.Error);
    }
  };

  const handleSubmit = async (entry: SpeakUpEntry, action: string, remarks: string = "", assignedEmp: string = "") => {
    try {
      const actionBy = action === "Approve"
        ? "ApproveBtn"
        : action === "Reject"
        ? "RejectBtn"
        : action === "Cancel"
        ? "CancelBtn"
        : action === "Submit"
        ? "SubmitBtn"
        : "";

      const submitRequest: SpeakUpSubmitRequest = {
        params: {
          payload: entry.encryptedData,
          actionBy,
          remarks,
          assignedEmp: assignedEmp || entry.AssignedEmp || "",
        },
      };

      if (!submitRequest.params.payload) {
        throw new Error("Missing payload for action request.");
      }

      const response = await submitSpeakUp(submitRequest).unwrap();
      
      // Show success message
      if (response.data && response.data[0] && response.data[0].Status) {
        const statusMessage = response.data[0].Status;
        console.log("Action result:", statusMessage);
        // Check if it's an error message
        if (statusMessage.toLowerCase().includes('error') || statusMessage.toLowerCase().includes('not valid')) {
          alert(statusMessage);
        } else {
          // Success - refresh the list
          fetchSpeakUpEntries();
        }
      } else {
        fetchSpeakUpEntries(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Error submitting Speak Up entry:", error);
      const errorMessage = error?.data?.message || error?.message || "Error performing action. Please try again.";
      alert(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      ID: 0,
      Message: "",
      Attachment: "",
      IsAnonymous: false,
      TypeID: -1,
      CompId: -1, // Use -1 as default as per API documentation
    });
    setErrors({});
    setEditingEntryId(null);
    setEditingEncryptedPayload(null);
  };

  const handleEdit = (entry: SpeakUpEntry) => {
    setEditingEntryId(entry.ID);
    setEditingEncryptedPayload(entry.encryptedData);
    setIsFormOpen(true);
  };

  const handleView = (entry: SpeakUpEntry) => {
    setSelectedEntry(entry);
    setIsViewOpen(true);
  };

  const closeViewModal = () => {
    setIsViewOpen(false);
    setSelectedEntry(null);
  };

  return {
    isFormOpen,
    setIsFormOpen,
    isFilterOpen,
    setIsFilterOpen,
    isViewOpen,
    setIsViewOpen,
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
  };
};
