import { useEffect, useState } from "react";
import { FiCheck, FiLoader, FiX, FiUpload } from "react-icons/fi";
import { Modal } from "../../../features/common/components/ui/modal";
import Button from "../../../features/common/components/ui/button/Button";
import { useMediaQuery } from "react-responsive";
import { useSaveSpeakupMutation } from "../../../services/Speakup/save";
import { SpeakUpSaveParams } from "../types/speakupTypes";
import { SaveStatus } from "../../common/types/status";
import { KeyValuePair } from "../../common/types/commonTypes";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: SpeakUpSaveParams;
  onFormChange: (data: SpeakUpSaveParams) => void;
  typeOptions: KeyValuePair[];
  encryptedData: string;
  onSave: () => Promise<void>;
  saveStatus: SaveStatus;
  errors: Record<string, string>;
}

export const SpeakUpFormModal = ({
  isOpen,
  onClose,
  formData,
  onFormChange,
  typeOptions,
  encryptedData,
}: FormModalProps) => {
  const [saveSpeakup, { isLoading, isSuccess, isError }] =
    useSaveSpeakupMutation();
  const [status, setStatus] = useState<SaveStatus>(SaveStatus.Idle);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (isSuccess) setStatus(SaveStatus.Success);
    else if (isError) setStatus(SaveStatus.Error);
    else if (isLoading) setStatus(SaveStatus.Saving);
    else setStatus(SaveStatus.Idle);
  }, [isLoading, isSuccess, isError]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onFormChange({ ...formData, [name]: checked ? 1 : 0 });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onFormChange({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        onFormChange({ ...formData, Attachment: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: SpeakUpSaveParams = {
      ...formData,
      encryptedData,
      actionBy: formData.ID > 0 ? "btnEdit" : "btnAdd",
    };
    await saveSpeakup(payload);
  };

  useEffect(() => {
    if (formData.TypeID && typeOptions.length > 0) {
      // Ensure selected type remains visible on edit
      const exists = typeOptions.some(
        (t) => String(t.key) === String(formData.TypeID)
      );
      if (!exists) {
        console.warn("Type not found in options, defaulting");
      }
    }
  }, [formData.TypeID, typeOptions]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`${
        isMobile ? "w-full mx-0 max-w-full" : "max-w-lg"
      } rounded-xl shadow-2xl`}
    >
      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {formData.ID > 0 ? "Edit SpeakUp" : "Add SpeakUp"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* IsAnonymous */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="IsAnonymous"
              name="IsAnonymous"
              checked={formData.IsAnonymous === 1}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="IsAnonymous"
              className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Submit Anonymously
            </label>
          </div>

          {/* Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="TypeID"
              value={formData.TypeID || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Type</option>
              {typeOptions.map((type) => (
                <option key={type.key} value={type.key}>
                  {type.value}
                </option>
              ))}
            </select>
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
              rows={4}
              placeholder="Enter your message here..."
              className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Attachment Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attachment
            </label>
            <label
              htmlFor="attachmentUpload"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
            >
              <FiUpload className="text-gray-600 dark:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {fileName || "Choose File"}
              </span>
              <input
                type="file"
                id="attachmentUpload"
                accept="*/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {fileName && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Selected: {fileName}
              </p>
            )}
          </div>

          {/* Status messages */}
          {status === SaveStatus.Success && (
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
              <FiCheck className="h-5 w-5 text-green-500 dark:text-green-400" />
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                SpeakUp saved successfully!
              </p>
            </div>
          )}
          {status === SaveStatus.Error && (
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
              <FiX className="h-5 w-5 text-red-500 dark:text-red-400" />
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Error saving SpeakUp. Please try again.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div
            className={`flex ${
              isMobile
                ? "flex-col gap-3"
                : "flex-row-reverse justify-start gap-3"
            }`}
          >
            {/* ✅ Show Save only if actionBy = btnAdd or btnEdit */}
            {(formData.actionBy === "btnAdd" ||
              formData.actionBy === "btnEdit") && (
              <Button
                type="submit"
                disabled={status === SaveStatus.Saving}
                className={`${
                  isMobile ? "w-full" : ""
                } px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all`}
              >
                {status === SaveStatus.Saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin h-4 w-4" /> Saving...
                  </span>
                ) : formData.ID > 0 ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </Button>
            )}

            {/* Cancel always visible */}
            <Button
              onClick={onClose}
              disabled={status === SaveStatus.Saving}
              className={`${
                isMobile ? "w-full" : ""
              } bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition`}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
