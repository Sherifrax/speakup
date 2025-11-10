import { useState } from "react";
import { SpeakUpFilters } from "../types/speakUpTypes";

export const useSpeakUpFilters = () => {
  const [filters, setFilters] = useState<SpeakUpFilters>({
    StatusID: "-1",
    TypeID: "-1",
    IsAnonymous: "0",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      StatusID: "-1",
      TypeID: "-1",
      IsAnonymous: "0",
    });
  };

  return {
    filters,
    handleFilterChange,
    resetFilters,
  };
};

