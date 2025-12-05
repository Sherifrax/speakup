import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { StatusBreakdown } from "../types.ts";

interface ApprovalsStatusCardProps {
  chartOptions: ApexOptions;
  chartSeries: number[];
  statusBreakdown: StatusBreakdown;
}

export const ApprovalsStatusCard: React.FC<ApprovalsStatusCardProps> = ({
  chartOptions,
  chartSeries,
  statusBreakdown,
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h3>
      </div>

      <div className="bg-white dark:bg-gray-800/95 rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-4 h-auto md:h-[280px] min-h-[400px] md:min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h4 className="text-md font-bold text-gray-900 dark:text-white">Approvals Status</h4>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</span>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-16 flex-1 min-h-0 overflow-y-auto md:overflow-visible">
          {chartSeries.some((v) => v > 0) ? (
            <>
              <div className="relative flex-shrink-0 max-w-[240px] w-full flex items-center justify-center">
                <Chart options={chartOptions} series={chartSeries} type="donut" height={220} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-28 h-28 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-[9px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                      TOTAL
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {statusBreakdown.total}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 md:space-y-4 flex-1 w-full">
                <div className="flex items-center gap-2 md:gap-2.5 justify-between pb-2.5 md:pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 md:gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] flex-shrink-0"></div>
                    <span className="text-[11px] md:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Pending
                    </span>
                  </div>
                  <span className="text-[11px] md:text-xs font-bold text-gray-900 dark:text-white">
                    {statusBreakdown.pending}
                  </span>
                </div>
                <div className="flex items-center gap-2 md:gap-2.5 justify-between pb-2.5 md:pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 md:gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] flex-shrink-0"></div>
                    <span className="text-[11px] md:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Open
                    </span>
                  </div>
                  <span className="text-[11px] md:text-xs font-bold text-gray-900 dark:text-white">
                    {statusBreakdown.open}
                  </span>
                </div>
                <div className="flex items-center gap-2 md:gap-2.5 justify-between pb-2.5 md:pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 md:gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] flex-shrink-0"></div>
                    <span className="text-[11px] md:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Approved
                    </span>
                  </div>
                  <span className="text-[11px] md:text-xs font-bold text-gray-900 dark:text-white">
                    {statusBreakdown.approved}
                  </span>
                </div>
                <div className="flex items-center gap-2 md:gap-2.5 justify-between">
                  <div className="flex items-center gap-2 md:gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] flex-shrink-0"></div>
                    <span className="text-[11px] md:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Declined
                    </span>
                  </div>
                  <span className="text-[11px] md:text-xs font-bold text-gray-900 dark:text-white">
                    {statusBreakdown.declined}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

