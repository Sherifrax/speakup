import React, { useState, useRef, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { FiFilter, FiX, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import Button from '../../../features/common/components/ui/button';
import { SpeakUpSearchParams } from '../types/speakupTypes';
import { KeyValuePair } from '../../common/types/commonTypes';

interface SpeakUpFilterProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SpeakUpSearchParams;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onReset: () => void;
  onApply: () => void;
  speakUpStatuses?: KeyValuePair[];
  speakUpTypes?: KeyValuePair[];
  isLoading?: boolean;
}

export const SpeakUpFilter: React.FC<SpeakUpFilterProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  onApply,
  speakUpStatuses = [],
  speakUpTypes = [],
  isLoading = false,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !dropdownRefs.current[openDropdown]?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const toggleDropdown = (fieldName: string) => {
    setOpenDropdown(openDropdown === fieldName ? null : fieldName);
  };

  const CustomSelect = ({ field, options, value, onChange, disabled }: any) => {
    const isOpen = openDropdown === field.name;
    
    const getCurrentDisplay = () => {
      // For StatusID and TypeID fields, check if value is -1 or empty
      if (field.name === 'StatusID' || field.name === 'TypeID') {
        // Convert value to string for consistent comparison
        const valueStr = String(value);
        
        // If value is -1 (number or string), undefined, null, or empty string, show placeholder
        if (value === -1 || valueStr === '-1' || value === null || value === undefined || valueStr === '') {
          return '<--select-->';
        }
        
        // Try to find the option
        const option = options?.find((opt: any) => String(opt.key) === valueStr);
        
        // If option found, check if it's a placeholder-like value
        if (option) {
          const optionValueLower = option.value.toLowerCase().trim();
          // Filter out placeholder-like values (select, all, etc.)
          if (optionValueLower === 'select' || 
              optionValueLower === 'all' || 
              optionValueLower === '<--select-->' ||
              optionValueLower === '--select--') {
            return '<--select-->';
          }
          return option.value;
        }
        
        // If no option found, show placeholder
        return '<--select-->';
      }
      
      // For other fields (like checkbox), return the value as-is
      return value || '';
    };
    
    // Render checkbox for IsAnonymous
    if (field.type === 'checkbox') {
      return (
        <div className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800">
          <input
            type="checkbox"
            id={`checkbox-${field.name}`}
            checked={value === '1' || value === 1}
            onChange={(e) => {
              onChange(e.target.checked ? '1' : '0');
            }}
            disabled={disabled}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label 
            htmlFor={`checkbox-${field.name}`}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            Show only anonymous entries
          </label>
        </div>
      );
    }
    
    const displayText = getCurrentDisplay();
    const isPlaceholder = displayText === '<--select-->' || !value || value === '-1' || value === -1;
    
    return (
      <div className="relative" ref={(el) => { dropdownRefs.current[field.name] = el; }}>
        <button
          type="button"
          onClick={() => toggleDropdown(field.name)}
          disabled={disabled}
          className={`w-full p-3 pl-4 pr-5 text-sm border rounded-xl appearance-none transition text-left flex items-center justify-between ${
            disabled 
              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500' 
              : 'border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer'
          }`}
        >
          <span className={isPlaceholder ? 'text-gray-500' : 'text-gray-900 dark:text-white'}>
            {displayText}
          </span>
          {isOpen ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {/* Add Select placeholder option */}
            <button
              key="select-placeholder"
              type="button"
              onClick={() => {
                onChange('-1');
                setOpenDropdown(null);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                value === '-1' || value === -1 || !value
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              &lt;--select--&gt;
            </button>
            {options
              ?.filter((option: any) => {
                if (field.name === 'TypeID' || field.name === 'StatusID') {
                  if (!option || !option.value) return false;
                  const optionValueLower = option.value.toLowerCase().trim();
                  // Filter out placeholder values - check for exact matches and common variations
                  const isPlaceholder = 
                    optionValueLower === 'all' || 
                    optionValueLower === 'select' || 
                    optionValueLower === '<--select-->' ||
                    optionValueLower === '--select--' ||
                    optionValueLower === 'select...' ||
                    optionValueLower === '--select' ||
                    optionValueLower === 'select--' ||
                    // Also filter if value matches common placeholder patterns (case-insensitive)
                    /^[\s\-<>]*select[\s\-<>]*$/i.test(option.value.trim());
                  return !isPlaceholder;
                }
                return true;
              })
              ?.map((option: any) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => {
                    onChange(option.key);
                    setOpenDropdown(null);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    String(value) === String(option.key)
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option.value}
                </button>
              ))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  const FilterButtons = (
    <div className="p-5 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900">
      <div className="flex space-x-4">
        <Button
          onClick={onReset}
          className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-white py-3.5 rounded-xl transition-all active:scale-95"
        >
          Clear All
        </Button>
        <Button
          onClick={onApply}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );

  const filterFields = [
    { 
      name: 'StatusID', 
      label: 'Status', 
      type: 'select', 
      options: speakUpStatuses,
      disabled: isLoading
    },
    { 
      name: 'TypeID', 
      label: 'Type', 
      type: 'select', 
      options: speakUpTypes,
      disabled: isLoading
    },
    { 
      name: 'IsAnonymous', 
      label: 'Anonymous', 
      type: 'checkbox'
    }
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
      />

      {isMobile ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl z-[9999] rounded-t-3xl flex flex-col max-h-[85vh] transform transition-transform duration-300 ease-out">
          <div className="flex justify-center pt-3">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </div>

          <div className="p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 dark:bg-gray-900 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FiFilter className="text-blue-500 w-5 h-5" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Filter Speak Up
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1 -mr-1"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {filterFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {field.label}
                </label>
                <div className="relative">
                  <CustomSelect
                    field={field}
                    options={field.options}
                    value={filters[field.name as keyof SpeakUpSearchParams] ?? -1}
                    onChange={(value: string) => {
                      const event = {
                        target: {
                          name: field.name,
                          value: value
                        }
                      } as React.ChangeEvent<HTMLSelectElement>;
                      onFilterChange(event);
                    }}
                    disabled={field.disabled}
                  />
                </div>
              </div>
            ))}
          </div>

          {FilterButtons}
        </div>
      ) : (
        <div className="fixed top-14 right-0 h-[calc(99%-3rem)] w-96 bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out z-[9999] rounded-l-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FiFilter className="text-blue-500 w-6 h-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Advanced Filters
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1 -mr-1"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {filterFields.map((field) => (
              <div key={field.name} className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {field.label}
                </label>
                <div className="relative">
                  <CustomSelect
                    field={field}
                    options={field.options}
                    value={filters[field.name as keyof SpeakUpSearchParams] ?? -1}
                    onChange={(value: string) => {
                      const event = {
                        target: {
                          name: field.name,
                          value: value
                        }
                      } as React.ChangeEvent<HTMLSelectElement>;
                      onFilterChange(event);
                    }}
                    disabled={field.disabled}
                  />
                </div>
              </div>
            ))}
          </div>

          {FilterButtons}
        </div>
      )}
    </>
  );
};
