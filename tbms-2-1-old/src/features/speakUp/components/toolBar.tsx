import { SearchBarPlaceholders } from "../../../constants/actionBarPlaceholders";
import { AddButton } from "../../../features/common/components/ui/button/add-button/index";
import { FilterButton } from "../../../features/common/components/ui/button/filter-button";
import { SearchInput } from "../../../features/common/components/ui/input/search-input";

interface ActionBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterToggle: () => void;
  onAddClick: () => void;
  placeholderKey?: keyof typeof SearchBarPlaceholders;
}

export const Toolbar = ({
  searchQuery,
  onSearchChange,
  onFilterToggle,
  onAddClick,
  placeholderKey = "speakUp",
}: ActionBarProps) => {
  return (
    <div className="flex flex-row md:flex-row gap-4 items-center w-full">
      <div className="relative w-full">
        <SearchInput value={searchQuery} onChange={onSearchChange} placeholder={SearchBarPlaceholders[placeholderKey]} />
        <FilterButton onClick={onFilterToggle} />
      </div>
      <AddButton onClick={onAddClick} />
    </div>
  );
};
