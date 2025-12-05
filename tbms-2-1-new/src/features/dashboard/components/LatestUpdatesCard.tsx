import React from "react";
import { FiClock } from "react-icons/fi";
import { SpeakUpItem } from "../../speakup/types/speakupTypes";
import { getStatusStyle } from "../utils/statusStyles";

interface LatestUpdatesCardProps {
  items: SpeakUpItem[];
}

export const LatestUpdatesCard: React.FC<LatestUpdatesCardProps> = ({ items }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Updates</h3>
      </div>

      <div className="bg-white dark:bg-gray-800/95 rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-6 h-[280px] flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item) => {
                const statusStyle = getStatusStyle(item.Status);
                return (
                  <div
                    key={item.ID}
                    className="group relative p-4 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800/60 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300"
                  >
                    <div
                      className={`absolute left-4 top-6 bottom-0 w-0.5 bg-gradient-to-b ${statusStyle.timeline} to-transparent opacity-30 group-hover:opacity-60 transition-opacity`}
                    ></div>
                    <div className={`absolute left-3.5 top-5 w-2 h-2 rounded-full ${statusStyle.dot} shadow-sm`}></div>

                    <div className="ml-6">
                      <div className="flex items-start justify-between mb-2.5 gap-3">
                        <div className="flex-1 min-w-0 pr-3">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate mb-1">
                            {item.SpeakUpType || "N/A"}
                          </p>
                          {item.EMPNAME && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              By:{" "}
                              <span className="font-semibold text-gray-700 dark:text-gray-300">{item.EMPNAME}</span>
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg shadow-sm flex-shrink-0 max-w-[45%] min-w-0 ${statusStyle.badge}`}
                          title={item.Status}
                        >
                          <span className="block truncate">{item.Status}</span>
                        </span>
                      </div>
                      {item.Message && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 leading-relaxed">
                          {item.Message.substring(0, 80)}
                          {item.Message.length > 80 ? "..." : ""}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <FiClock className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No recent updates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

