import { useState } from "react";

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Reset to first page when search query changes
    return 1; // Return the page to reset to
  };

  const resetSearch = () => {
    setSearchQuery("");
    // Reset to first page when search is reset
    return 1; // Return the page to reset to
  };

  return {
    searchQuery,
    handleSearchChange,
    resetSearch,
  };
};
