import { useEffect, useState } from "react";
import { Modal } from "../../../features/common/components/ui/modal";
import Button from "../../../features/common/components/ui/button/Button";
import { FiLoader, FiX } from "react-icons/fi";
import { useUpdateHistoryByPayloadMutation } from "../../../services/Speakup/updateHistoryPayload";
import { SaveStatus } from "../../common/types/status";

interface UpdateHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  encryptedData: string;
  onSuccess?: () => void;
}

export const UpdateHistoryModal = ({ isOpen, onClose, encryptedData, onSuccess }: UpdateHistoryModalProps) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SaveStatus>(SaveStatus.Idle);
  const [updateHistory, { isLoading, isSuccess, isError }] = useUpdateHistoryByPayloadMutation();

  useEffect(() => {
    if (isOpen) {
      setMessage("");
      setStatus(SaveStatus.Idle);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isLoading) setStatus(SaveStatus.Saving);
    else if (isSuccess) setStatus(SaveStatus.Success);
    else if (isError) setStatus(SaveStatus.Error);
  }, [isLoading, isSuccess, isError]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Please enter a comment to add to history.");
      return;
    }
    await updateHistory({ params: { payload: encryptedData, message: message.trim(), compId: -1 } });
    if (!isError) {
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 800);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} className="max-w-md rounded-xl shadow-2xl">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-blue-600">
            Update History
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Enter your update/comment"
            className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex gap-3 justify-end">
            <Button type="button" onClick={onClose} className="bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancel
            </Button>
            <Button type="submit" disabled={status === SaveStatus.Saving} className="bg-blue-600 hover:bg-blue-700 text-white">
              {status === SaveStatus.Saving ? (
                <span className="flex items-center gap-2"><FiLoader className="animate-spin h-4 w-4" /> Saving…</span>
              ) : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};


