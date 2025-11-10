import { useState, useEffect } from "react";
import { useGetSpeakUpFiltersQuery } from "../../../services/Speakup/getFilters";
import { SpeakUpSearchParams } from "../types/speakupTypes";
import { KeyValuePair } from "../../common/types/commonTypes";
import { SpeakUpType, SpeakUpStatus } from "../types/speakupTypes";

export const useSpeakUpFilters = () => {
  // Fetch filter data from API
  const { data, isLoading } = useGetSpeakUpFiltersQuery();

  // ✅ Current selected filters
  const [filters, setFilters] = useState<SpeakUpSearchParams>({
    IsAnonymous: 0,
    compID: 0,
    StatusID: -1,
    TypeID: -1,
    CommonSearchString: "",
  });

  // ✅ Available dropdown options
  const [options, setOptions] = useState<{
    typeOptions: KeyValuePair[];
    statusOptions: KeyValuePair[];
  }>({
    typeOptions: [],
    statusOptions: [],
  });

  // ✅ When API returns data, store dropdown options
  // Convert old structure (SpeakUpType/SpeakUpStatus with number keys) to KeyValuePair (string keys)
  useEffect(() => {
    if (data) {
      const typeOptions: KeyValuePair[] = (data.speakUpType || []).map((item: SpeakUpType) => ({
        key: String(item.key),
        value: item.value,
      }));
      
      const statusOptions: KeyValuePair[] = (data.speakUpStatus || []).map((item: SpeakUpStatus) => ({
        key: String(item.key),
        value: item.value,
        sortOrder: item.sortOrder,
      }));
      
      setOptions({
        typeOptions,
        statusOptions,
      });
    }
  }, [data]);

  // ✅ Handle dropdowns and checkbox
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFilters((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"? checked? 1 : 0
          : name === "TypeID" || name === "StatusID" || name === "compID" ? Number(value) : value,
    }));
  };

  // ✅ Reset filters to default values
  const resetFilters = () => {
    setFilters({
      IsAnonymous: 0,
      compID: 0,
      StatusID: -1,
      TypeID: -1,
      CommonSearchString: "",
    });
  };

  return {
    filters,
    options,
    handleFilterChange,
    resetFilters,
    isLoading,
  };
};
