import { useEffect, useState } from "react";
import { Modal } from "../../../features/common/components/ui/modal";
import Button from "../../../features/common/components/ui/button/Button";
import { FiCheck, FiLoader, FiX, FiUser } from "react-icons/fi";
import { useSubmitSpeakUpMutation } from "../../../services/Speakup/submit";
import { SpeakUpSubmitRequest } from "../types/speakupTypes";
import { SaveStatus } from "../../common/types/status";
import { useMediaQuery } from "react-responsive";
import { ActionType } from "../../../enum/actionType.enum";
import { EmployeeDto } from "../../../services/Common/employeeSearch";
import { EmployeeSelectModal } from "./EmployeeSelectModal";

interface ApprovalActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: ActionType;
  encryptedData?: string;
  assignedEmp?: string;
  onSuccess?: () => void; // Callback to refresh list after success
}

export const ApprovalActionModal = ({
  isOpen,
  onClose,
  actionType,
  encryptedData = "",
  assignedEmp: initialAssignedEmp = "",
  onSuccess,
}: ApprovalActionModalProps) => {
  const [remarks, setRemarks] = useState("");
  const [assignedEmp, setAssignedEmp] = useState(initialAssignedEmp);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDto | null>(null);
  const [status, setStatus] = useState<SaveStatus>(SaveStatus.Idle);
  const [submitSpeakUp, { isLoading, isSuccess, isError }] =
    useSubmitSpeakUpMutation();

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const primaryActionLabel = actionType === ActionType.Approve
    ? "Approve"
    : actionType === ActionType.Assign
    ? "Assign"
    : actionType === ActionType.Close
    ? "Close"
    : "Reject";

  useEffect(() => {
    if (isSuccess) setStatus(SaveStatus.Success);
    else if (isError) setStatus(SaveStatus.Error);
    else if (isLoading) setStatus(SaveStatus.Saving);
    else setStatus(SaveStatus.Idle);
  }, [isLoading, isSuccess, isError]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setRemarks("");
      setAssignedEmp(initialAssignedEmp || "");
      setStatus(SaveStatus.Idle);
    }
  }, [isOpen, initialAssignedEmp]);

  useEffect(() => {
    if (!isOpen) setIsEmpModalOpen(false);
  }, [isOpen]);

  // ✅ API call - convert to new API structure format
  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!remarks.trim()) {
      alert("Please provide a comment/remarks.");
      return;
    }

    if ((actionType === ActionType.Assign) && !assignedEmp.trim()) {
      alert("Please select an employee to assign.");
      return;
    }

    // Map action type to API actionBy button name
    const actionBy = actionType === ActionType.Approve ? "ApproveBtn"
                  : actionType === ActionType.Reject ? "RejectBtn"
                  : actionType === ActionType.Assign ? "AssignBtn"
                  : actionType === ActionType.Close ? "CloseBtn"
                  : "";

    const payload: SpeakUpSubmitRequest = {
      params: {
        payload: encryptedData || "",
        actionBy,
        remarks: remarks.trim(),
        assignedEmp: assignedEmp.trim() || "",
      },
    };

    try {
      setStatus(SaveStatus.Saving);
      const response = await submitSpeakUp(payload).unwrap();
      
      // Check response status
      if (response.data && response.data[0] && response.data[0].Status) {
        const statusMessage = response.data[0].Status;
        // Check if it's an error message
        if (statusMessage.toLowerCase().includes('error') || 
            statusMessage.toLowerCase().includes('not valid') ||
            statusMessage.toLowerCase().includes('not a valid')) {
          setStatus(SaveStatus.Error);
          alert(statusMessage);
        } else {
          setStatus(SaveStatus.Success);
          setTimeout(() => {
            onSuccess?.(); // Refresh the list
            onClose();
            setRemarks("");
            setAssignedEmp("");
          }, 1200); // auto close on success
        }
      } else {
        setStatus(SaveStatus.Success);
        setTimeout(() => {
          onSuccess?.(); // Refresh the list
          onClose();
          setRemarks("");
          setAssignedEmp("");
        }, 1200);
      }
    } catch (error: any) {
      console.error("Error submitting action:", error);
      setStatus(SaveStatus.Error);
      const errorMessage = error?.data?.message || error?.message || "Error performing action. Please try again.";
      alert(errorMessage);
    }
  };

  const titleColor =
    actionType === ActionType.Approve
      ? "text-green-600"
      : actionType === ActionType.Reject
      ? "text-red-600"
      : actionType === ActionType.Assign
      ? "text-blue-600"
      : actionType === ActionType.Close
      ? "text-gray-600"
      : "text-blue-600";

  const primaryBtnClass =
    actionType === ActionType.Approve
      ? "bg-green-600 hover:bg-green-700"
      : actionType === ActionType.Reject
      ? "bg-red-600 hover:bg-red-700"
      : actionType === ActionType.Assign
      ? "bg-blue-600 hover:bg-blue-700"
      : actionType === ActionType.Close
      ? "bg-gray-600 hover:bg-gray-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className={`${isMobile ? "w-full mx-0 max-w-full" : "max-w-md"} rounded-xl shadow-2xl`}
    >
      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-2xl font-bold ${titleColor}`}>
            {actionType} SpeakUp
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAction} className="space-y-5">
          {/* Assign To (Department/Employee) - Required for Assign only */}
          {(actionType === ActionType.Assign) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assign To (Department/Employee) <span className="text-red-500">*</span>
              </label>
              {/* Selection field that opens picker modal */}
              {!selectedEmployee ? (
                <button
                  type="button"
                  onClick={() => setIsEmpModalOpen(true)}
                  className="w-full px-4 py-3 border rounded-xl text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 flex items-center justify-center">
                    <FiUser className="text-blue-500" />
                  </div>
                  <div className="text-blue-600 dark:text-blue-300 font-medium">
                    Click here to select employee
                  </div>
                </button>
              ) : (
                <div className="w-full px-4 py-3 border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 flex items-center justify-center">
                      <FiUser className="text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {selectedEmployee.empName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {selectedEmployee.designation}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEmpModalOpen(true)}
                    className="text-blue-600 hover:underline dark:text-blue-300"
                  >
                    Change
                  </button>
                </div>
              )}
              {/* Picker Modal */}
              <EmployeeSelectModal
                isOpen={isEmpModalOpen}
                onClose={() => setIsEmpModalOpen(false)}
                onApply={(emp) => {
                  setSelectedEmployee(emp);
                  setAssignedEmp(emp.empNumber);
                  setIsEmpModalOpen(false);
                }}
              />
            </div>
          )}

          {/* No assignment UI for Reject/Close */}
          {actionType === ActionType.Reject && null}

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comment / Remarks <span className="text-red-500">*</span>
            </label>
            <textarea
              name="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              placeholder="Enter your comment here..."
              className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Status messages */}
          {status === SaveStatus.Success && (
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
              <FiCheck className="h-5 w-5 text-green-500 dark:text-green-400" />
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Action completed successfully!
              </p>
            </div>
          )}
          {status === SaveStatus.Error && (
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
              <FiX className="h-5 w-5 text-red-500 dark:text-red-400" />
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Error performing action. Please try again.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div
            className={`flex ${isMobile ? "flex-col gap-3" : "flex-row-reverse justify-start gap-3"}`}
          >
            <Button
              type="submit"
              disabled={status === SaveStatus.Saving}
              className={`${isMobile ? "w-full" : ""} ${primaryBtnClass} text-white px-6 py-3 rounded-lg transition-all`}
            >
              {status === SaveStatus.Saving ? (
                <span className="flex items-center justify-center gap-2">
                  <FiLoader className="animate-spin h-4 w-4" /> Processing...
                </span>
              ) : (
                primaryActionLabel
              )}
            </Button>

            <Button
              type="button"
              onClick={onClose}
              disabled={status === SaveStatus.Saving}
              className={`${isMobile ? "w-full" : ""} bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg transition`}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

