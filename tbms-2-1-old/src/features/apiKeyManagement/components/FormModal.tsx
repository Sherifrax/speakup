import { FiCheck, FiLoader, FiX } from "react-icons/fi";
import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import { ApiKeyFormData } from "../types/apiKeyTypes";
import { SaveStatus } from "../../../types/apiKeyManagement";
import { useMediaQuery } from "react-responsive";

interface ApiKeyFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ApiKeyFormData;
  onFormChange: (data: ApiKeyFormData) => void;
  onSubmit: () => void;
  saveStatus: SaveStatus;
  errors: Record<string, string>;
}

export const ApiKeyFormModal = ({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  saveStatus,
  errors = {},
}: ApiKeyFormProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const MAX_CLIENT_NAME_LENGTH = 50;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "clientName" && value.length > MAX_CLIENT_NAME_LENGTH) {
      return;
    }
    onFormChange({ ...formData, [name]: value });
    if (errors[name]) {
      onFormChange({ ...formData, [name]: value });
    }
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onFormChange({ ...formData, [name]: checked });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className={`${isMobile ? 'w-full mx-0 max-w-full' : 'max-w-lg'} rounded-xl shadow-2xl`}
    >
      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {formData.apiKey ? "Edit API Key" : "Create New API Key"}
          </h2>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              maxLength={MAX_CLIENT_NAME_LENGTH}
              className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 ${
                errors.clientName 
                  ? "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500" 
                  : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Enter client name"
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${
                formData.clientName.length > MAX_CLIENT_NAME_LENGTH 
                  ? "text-red-500" 
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {formData.clientName.length}/{MAX_CLIENT_NAME_LENGTH}
              </span>
            </div>
            {errors.clientName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.clientName}</p>
            )}
          </div>



          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Security Settings
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active
                </label>
              </div>

              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                <input
                  type="checkbox"
                  id="isIpCheck"
                  name="isIpCheck"
                  checked={formData.isIpCheck}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="isIpCheck" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  IP Check
                </label>
              </div>

              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                <input
                  type="checkbox"
                  id="isCountryCheck"
                  name="isCountryCheck"
                  checked={formData.isCountryCheck}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="isCountryCheck" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country Check
                </label>
              </div>

              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                <input
                  type="checkbox"
                  id="isRegionCheck"
                  name="isRegionCheck"
                  checked={formData.isRegionCheck}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="isRegionCheck" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Region Check
                </label>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {saveStatus === "success" && (
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex-shrink-0">
                <FiCheck className="h-5 w-5 text-green-500 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                API Key saved successfully!
              </p>
            </div>
          )}
          {saveStatus === "error" && (
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex-shrink-0">
                <FiX className="h-5 w-5 text-red-500 dark:text-red-400" />
              </div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Error saving API Key. Please try again.
              </p>
            </div>
          )}

          <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-row-reverse justify-start gap-3'}`}>
            <Button
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
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};