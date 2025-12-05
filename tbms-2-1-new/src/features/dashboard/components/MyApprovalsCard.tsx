import React from "react";
import {
  FiArrowRight,
  FiEye,
  FiClock,
  FiCheck,
  FiX,
  FiUserPlus,
  FiEdit2,
  FiMessageSquare,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { SpeakUpItem } from "../../speakup/types/speakupTypes";
import { getStatusStyle, isActionable } from "../utils/statusStyles";

interface MyApprovalsCardProps {
  items: SpeakUpItem[];
  onApprove: (item: SpeakUpItem) => void;
  onReject: (item: SpeakUpItem) => void;
  onAssign: (item: SpeakUpItem) => void;
  onUpdate: (item: SpeakUpItem) => void;
  onClose: (item: SpeakUpItem) => void;
  onViewMessage: (item: SpeakUpItem) => void;
  onViewHistory: (item: SpeakUpItem) => void;
}

export const MyApprovalsCard: React.FC<MyApprovalsCardProps> = ({
  items,
  onApprove,
  onReject,
  onAssign,
  onUpdate,
  onClose,
  onViewMessage,
  onViewHistory,
}) => {
  const navigate = useNavigate();
  const actionableItems = items.filter((item) => isActionable(item)).slice(0, 8);

  return (
    <div
      className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col"
      id="my-approvals-card"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">My Approvals</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Review and take action on pending requests</p>
        </div>
        <button
          onClick={() => navigate("/speakup/approval")}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          View All
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
        {actionableItems.length > 0 ? (
          <div className="space-y-4">
            {actionableItems.map((item) => {
              const statusStyle = getStatusStyle(item.Status);
              return (
                <div
                  key={item.ID}
                  className="group p-4 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-300"
                >
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} flex-shrink-0`}></div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.SpeakUpType || "N/A"}</p>
                        </div>
                        {item.EMPNAME && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 ml-3.5">
                            By: <span className="font-semibold text-gray-700 dark:text-gray-300">{item.EMPNAME}</span>
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg shadow-sm flex-shrink-0 ${statusStyle.badge}`}
                      >
                        {item.Status}
                      </span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/50">
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {item.Message?.substring(0, 120) || "No message"}
                        {item.Message && item.Message.length > 120 ? "..." : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200/80 dark:border-gray-700/80 flex-wrap">
                    <button
                      onClick={() => onViewMessage(item)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => onViewHistory(item)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      <FiClock className="w-3.5 h-3.5" />
                      History
                    </button>

                    {item.ApproveBtn !== false && (
                      <button
                        onClick={() => onApprove(item)}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-green-400/20"
                      >
                        <FiCheck className="w-4 h-4" />
                        Approve
                      </button>
                    )}
                    {item.RejectBtn !== false && (
                      <button
                        onClick={() => onReject(item)}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-red-400/20"
                      >
                        <FiX className="w-4 h-4" />
                        Reject
                      </button>
                    )}
                    {item.AssignBtn === true && (
                      <button
                        onClick={() => onAssign(item)}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-blue-400/20"
                      >
                        <FiUserPlus className="w-4 h-4" />
                        Assign
                      </button>
                    )}
                    {item.UpdateBtn === true && (
                      <button
                        onClick={() => onUpdate(item)}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                        Update
                      </button>
                    )}
                    {item.CloseBtn === true && (
                      <button
                        onClick={() => onClose(item)}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                      >
                        <FiX className="w-3.5 h-3.5" />
                        Close
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[400px] text-gray-500 dark:text-gray-400">
            <FiMessageSquare className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">No pending approvals</p>
          </div>
        )}
      </div>
    </div>
  );
};

