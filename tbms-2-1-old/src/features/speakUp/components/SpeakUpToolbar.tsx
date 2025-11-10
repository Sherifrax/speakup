import React from 'react';
import { SearchInput } from '../../../components/ui/input/search-input';
import { AddButton } from '../../../components/ui/button/add-button';
import { FilterButton } from '../../../components/ui/button/filter-button';
import { SearchBarPlaceholders } from '../../../constants/actionBarPlaceholders';

interface SpeakUpToolbarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterToggle: () => void;
  onAddClick: () => void;
  placeholderKey?: keyof typeof SearchBarPlaceholders;
}

export const Toolbar: React.FC<SpeakUpToolbarProps> = ({
  searchQuery,
  onSearchChange,
  onFilterToggle,
  onAddClick,
  placeholderKey = "speakUpEntry",
}) => {
  return (
    <div className="flex flex-row md:flex-row gap-4 items-center w-full">
      <div className="relative w-full">
        <SearchInput 
          value={searchQuery} 
          onChange={onSearchChange} 
          placeholder={SearchBarPlaceholders[placeholderKey]} 
        />
        <FilterButton onClick={onFilterToggle} />
      </div>
      <AddButton onClick={onAddClick} text="Add" />
    </div>
  );
};

