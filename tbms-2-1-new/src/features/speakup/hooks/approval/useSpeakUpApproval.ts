import { useState, useEffect } from "react";
import { useSubmitSpeakUpMutation } from "../../../../services/Speakup/shared/submit";
import { useSearchSpeakupApprovalMutation } from "../../../../services/Speakup/approval/searchApproval";
import { useGetSpeakUpFiltersQuery } from "../../../../services/Speakup/shared/getFilters";
import { 
  SpeakUpSearchParams, 
  SpeakUpEntry,
  SpeakUpSubmitRequest
} from "../../types/speakupTypes";
import { PaginationParams } from "../../../common/types/commonTypes";
import { PaginationDefaults } from "../../../../enum/pagination.enum";

export const useSpeakUpApproval = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<SpeakUpEntry | null>(null);

  const [currentPage, setCurrentPage] = useState(PaginationDefaults.Page);
  const [pageSize] = useState(PaginationDefaults.PageSize);
  const [totalRecords, setTotalRecords] = useState(0);

  const [speakUpEntries, setSpeakUpEntries] = useState<SpeakUpEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const [submitSpeakUp] = useSubmitSpeakUpMutation();
  const [searchSpeakUp] = useSearchSpeakupApprovalMutation();
  const { data: filtersData, isLoading: isLoadingFilters } = useGetSpeakUpFiltersQuery();

  // 🔍 Fetch Speak Up entries for approval with pagination & filters
  const fetchSpeakUpEntries = async (
    filters: any = {},
    pagination: PaginationParams = {}
  ) => {
    try {
      setLoading(true);

      const searchParams: SpeakUpSearchParams = {
        IsAnonymous: filters.IsAnonymous && filters.IsAnonymous !== "" ? parseInt(filters.IsAnonymous, 10) : 0,
        compID: filters.CompId ?? (filters.compID ?? 1),
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
        search: searchParams,
        pagination: paginationParams,
      };

      const response: any = await searchSpeakUp(params).unwrap();

      setSpeakUpEntries(response.data || []);
      setTotalRecords(response.count?.[0]?.TotalCount || 0);
    } catch (err) {
      console.error("Error fetching Speak Up entries for approval:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakUpEntries();
  }, [currentPage]);

  const handleSubmit = async (entry: SpeakUpEntry, action: string, remarks: string = "", assignedEmp: string = "") => {
    try {
      const actionBy = action === "Approve"
        ? "ApproveBtn"
        : action === "Reject"
        ? "RejectBtn"
        : action === "Assign"
        ? "AssignBtn"
        : action === "Close"
        ? "CloseBtn"
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

  const handleView = (entry: SpeakUpEntry) => {
    setSelectedEntry(entry);
    setIsViewOpen(true);
  };

  const closeViewModal = () => {
    setIsViewOpen(false);
    setSelectedEntry(null);
  };

  return {
    isFilterOpen,
    setIsFilterOpen,
    isViewOpen,
    setIsViewOpen,
    selectedEntry,
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    speakUpEntries,
    loading,
    handleSubmit,
    fetchSpeakUpEntries,
    handleView,
    closeViewModal,
    filtersData,
    isLoadingFilters,
  };
};

