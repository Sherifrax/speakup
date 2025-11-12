import { useState, useEffect } from "react";
import { useGetSpeakupFilterQuery } from "../../../services/Speakup/getFilter";
import { SpeakUpSearchParams } from "../types/speakupTypes";
import { KeyValuePair } from "../../common/types/commonTypes";

export const useSpeakUpFilters = () => {
  // Fetch filter data from API
  const { data, isLoading } = useGetSpeakupFilterQuery();

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
  useEffect(() => {
    if (data) {
      setOptions({
        typeOptions: data.speakUpType ?? [],
        statusOptions: data.speakUpStatus ?? [],
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
