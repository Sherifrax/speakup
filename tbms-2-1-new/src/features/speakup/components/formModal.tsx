import React, { useState, useRef, useEffect } from "react";
import { FiCheck, FiLoader, FiX, FiUpload, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { Modal } from "../../../features/common/components/ui/modal";
import Button from "../../../features/common/components/ui/button/Button";
import { useMediaQuery } from "react-responsive";
import { SpeakUpFormData } from "../types/speakupTypes";
import { SaveStatus } from "../../common/types/status";
import { KeyValuePair } from "../../common/types/commonTypes";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: SpeakUpFormData;
  onFormChange: (data: SpeakUpFormData) => void;
  typeOptions: KeyValuePair[];
  onSave: () => Promise<void>;
  saveStatus: SaveStatus;
  errors: Record<string, string>;
  isLoadingTypes?: boolean;
  isLoadingEntry?: boolean;
  editingEntryId?: number | null;
}

export const SpeakUpFormModal = ({
  isOpen,
  onClose,
  formData,
  onFormChange,
  typeOptions,
  onSave,
  saveStatus,
  errors = {},
  isLoadingTypes = false,
  isLoadingEntry = false,
  editingEntryId = null,
}: FormModalProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const MAX_MESSAGE_LENGTH = 1000;
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside or when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsTypeDropdownOpen(false);
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    };

    if (isTypeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isTypeDropdownOpen, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "Message") {
      if (value.length > MAX_MESSAGE_LENGTH) {
        return;
      }
      onFormChange({ ...formData, Message: value });
    }
  };

  const handleTypeChange = (value: string | number) => {
    onFormChange({ ...formData, TypeID: Number(value) });
    setIsTypeDropdownOpen(false);
  };

  const getTypeDisplayText = () => {
    const typeID = formData.TypeID || -1;
    if (typeID === -1 || typeID === null || typeID === undefined) {
      return '<--select-->';
    }
    const selectedType = typeOptions.find(type => String(type.key) === String(typeID));
    return selectedType ? selectedType.value : '<--select-->';
  };

  const isTypePlaceholder = () => {
    const typeID = formData.TypeID || -1;
    return typeID === -1 || typeID === null || typeID === undefined;
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "IsAnonymous") {
      onFormChange({ ...formData, IsAnonymous: checked });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid file type (PDF, JPG, PNG, DOC, DOCX)');
        return;
      }
      
      onFormChange({ ...formData, Attachment: file.name });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      await onSave();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className={`${isMobile ? 'w-full mx-4 max-w-full' : 'max-w-2xl'} rounded-xl shadow-2xl`}
      showCloseButton={false}
    >
      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {editingEntryId ? 'Edit Speak Up Entry' : 'Create New Speak Up Entry'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 -mr-1"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {isLoadingEntry ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <FiLoader className="animate-spin h-8 w-8 text-blue-500" />
                <p className="text-gray-600 dark:text-gray-400">Loading entry details...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <div className="relative" ref={typeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                  disabled={isLoadingTypes}
                  className={`w-full p-3 pl-4 pr-5 text-sm border rounded-xl appearance-none transition text-left flex items-center justify-between ${
                    isLoadingTypes
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500'
                      : errors.TypeID
                      ? 'border-red-500 dark:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer dark:bg-gray-800 dark:border-red-500'
                      : 'border-gray-300 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer'
                  }`}
                >
                  <span className={
                    isLoadingTypes 
                      ? 'text-gray-400 dark:text-gray-500' 
                      : isTypePlaceholder() 
                        ? 'text-gray-500 dark:text-gray-400' 
                        : 'text-gray-900 dark:text-white'
                  }>
                    {getTypeDisplayText()}
                  </span>
                  {isTypeDropdownOpen ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                </button>
                
                {isTypeDropdownOpen && !isLoadingTypes && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {/* Select placeholder option */}
                    <button
                      key="select-placeholder"
                      type="button"
                      onClick={() => handleTypeChange(-1)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        isTypePlaceholder()
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      &lt;--select--&gt;
                    </button>
                    {typeOptions
                      .filter((type) => {
                        if (!type || !type.value) return false;
                        const valueLower = type.value.toLowerCase().trim();
                        // Filter out placeholder values like "all", "select", etc.
                        const isPlaceholder = 
                          valueLower === 'all' || 
                          valueLower === 'select' || 
                          valueLower === '<--select-->' ||
                          valueLower === '--select--' ||
                          valueLower === 'select...' ||
                          valueLower === '--select' ||
                          valueLower === 'select--' ||
                          /^[\s\-<>]*select[\s\-<>]*$/i.test(type.value.trim());
                        return !isPlaceholder;
                      })
                      .map((type) => (
                        <button
                          key={type.key}
                          type="button"
                          onClick={() => handleTypeChange(type.key)}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                            String(formData.TypeID || -1) === String(type.key)
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {type.value}
                        </button>
                      ))}
                  </div>
                )}
              </div>
              {errors.TypeID && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.TypeID}</p>
              )}
            </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="Message"
              value={formData.Message || ""}
              onChange={handleInputChange}
              maxLength={MAX_MESSAGE_LENGTH}
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 resize-none ${
                errors.Message 
                  ? "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500" 
                  : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Enter your message here..."
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${
                formData.Message && formData.Message.length > MAX_MESSAGE_LENGTH 
                  ? "text-red-500" 
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {formData.Message?.length || 0}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
            {errors.Message && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Message}</p>
            )}
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attachment
            </label>
            <div className="relative">
              <input
                type="file"
                id="attachment"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
              />
              <label
                htmlFor="attachment"
                className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <FiUpload className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.Attachment ? formData.Attachment : "Choose file or drag and drop"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                  </span>
                </div>
              </label>
            </div>
            {errors.Attachment && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Attachment}</p>
            )}
          </div>

          {/* Is Anonymous */}
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
            <input
              type="checkbox"
              id="IsAnonymous"
              name="IsAnonymous"
              checked={formData.IsAnonymous}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="IsAnonymous" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Submit anonymously
            </label>
          </div>

          {/* Status Messages */}
          {saveStatus === "success" && (
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex-shrink-0">
                <FiCheck className="h-5 w-5 text-green-500 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Speak Up entry submitted successfully!
              </p>
            </div>
          )}
          {saveStatus === "error" && (
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex-shrink-0">
                <FiX className="h-5 w-5 text-red-500 dark:text-red-400" />
              </div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Error submitting Speak Up entry. Please try again.
              </p>
            </div>
          )}

            <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-row-reverse justify-start gap-3'}`}>
              <Button
                type="submit"
                disabled={saveStatus === "saving"}
                className={`${isMobile ? 'w-full' : ''} px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-sm transition-all duration-200 transform hover:scale-[1.02]`}
              >
                {saveStatus === "saving" ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin h-4 w-4" />
                    Saving...
                  </span>
                ) : (
                  <span>Save</span>
                )}
              </Button>
              <Button
                onClick={onClose}
                disabled={saveStatus === "saving"}
                className={`${isMobile ? 'w-full' : ''} bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition`}
              >
                Close
              </Button>
            </div>
          </form>
          )}
        </div>
      </div>
    </Modal>
  );
};
