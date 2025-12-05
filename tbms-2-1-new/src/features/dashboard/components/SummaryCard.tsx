import React from "react";
import { FiFileText, FiAlertCircle, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { DashboardStats } from "../types.ts";

interface SummaryCardProps {
  stats: DashboardStats;
  onNavigateManage: () => void;
  onNavigateApproval: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  stats,
  onNavigateManage,
  onNavigateApproval,
}) => {
  return (
    <div
      className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-lg hover:shadow-xl transition-all duration-300 p-3.5"
      id="today-summary-card"
    >
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2.5">Today&apos;s Summary</h3>
      <div className="space-y-2">
        <div
          className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 hover:shadow-md transition-all duration-200 cursor-pointer"
          onClick={onNavigateManage}
        >
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              My Requests
            </p>
            <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100 mt-0.5">
              {stats.myRequests}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              Total requests I created
            </p>
          </div>
          <div className="text-right">
            <div className="p-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <FiFileText className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between p-2 rounded-lg bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 hover:shadow-md transition-all duration-200 cursor-pointer"
          onClick={onNavigateApproval}
        >
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Awaiting My Action
            </p>
            <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-0.5">
              {stats.awaitingMyAction}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Need my approval/action</p>
          </div>
          <div className="text-right">
            <div className="p-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FiAlertCircle className="w-4.5 h-4.5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between p-2 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-all duration-200 cursor-pointer"
          onClick={onNavigateManage}
        >
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              My Active Requests
            </p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-0.5">
              {stats.myActiveRequests}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">My requests still in progress</p>
          </div>
          <div className="text-right">
            <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiRefreshCw className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between p-2 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 hover:shadow-md transition-all duration-200 cursor-pointer"
          onClick={onNavigateManage}
        >
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              My Completed Requests
            </p>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-0.5">
              {stats.myCompletedRequests}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              My requests that are closed/approved
            </p>
          </div>
          <div className="text-right">
            <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiCheckCircle className="w-4.5 h-4.5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

