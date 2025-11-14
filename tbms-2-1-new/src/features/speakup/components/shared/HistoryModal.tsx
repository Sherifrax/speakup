import React from 'react';
import { FiX, FiClock, FiUser, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { useGetSpeakUpHistoryQuery } from '../../../../services/Speakup/shared/getHistory';
import { Modal } from '../../../common/components/ui/modal';
import type { SpeakUpItem } from '../../types/speakupTypes';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: SpeakUpItem | null;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  entry,
}) => {
  const { data: historyData, isLoading, error } = useGetSpeakUpHistoryQuery(
    { payload: entry?.encryptedData || "" },
    { skip: !isOpen || !entry?.encryptedData }
  );

  const historyEntries = historyData?.data || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-4xl rounded-2xl shadow-2xl"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-b border-blue-400 dark:border-blue-500">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-2.5 bg-white/20 rounded-lg">
                <FiClock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white tracking-tight">
                History
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading history...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-2">
                <FiX className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Error Loading History
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Unable to load the history data. Please try again.
              </p>
            </div>
          ) : historyEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FiClock className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No History Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No action history has been recorded for this SpeakUp entry.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Action By
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Action On
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Comment
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Assigned To
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {historyEntries.map((history: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                                <FiCheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {history.Action}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                                <FiUser className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              </div>
                              <span className="text-sm text-gray-900 dark:text-white">
                                {history["Action By"]}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                                <FiClock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              </div>
                              <span className="text-sm text-gray-900 dark:text-white">
                                {history["Action On"]}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {history.Comment ? (
                              <div className="flex items-center">
                                <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                                  <FiMessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </div>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {history.Comment}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                                No comment
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {history["Approver Action"] ? (
                              <span className="text-sm text-gray-900 dark:text-white">
                                {history["Approver Action"]}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                                Not assigned
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {historyEntries.map((history: any, index: number) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <div className="space-y-3">
                      {/* Action */}
                      <div className="flex items-center">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                          <FiCheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Action
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {history.Action}
                          </div>
                        </div>
                      </div>

                      {/* Action By */}
                      <div className="flex items-center">
                        <div className="p-1.5 bg-gray-100 dark:bg-gray-600 rounded-lg mr-3">
                          <FiUser className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Action By
                          </div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {history["Action By"]}
                          </div>
                        </div>
                      </div>

                      {/* Action On */}
                      <div className="flex items-center">
                        <div className="p-1.5 bg-gray-100 dark:bg-gray-600 rounded-lg mr-3">
                          <FiClock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Action On
                          </div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {history["Action On"]}
                          </div>
                        </div>
                      </div>

                      {/* Comment */}
                      <div className="flex items-start">
                        <div className="p-1.5 bg-gray-100 dark:bg-gray-600 rounded-lg mr-3 mt-0.5">
                          <FiMessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Comment
                          </div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {history.Comment || (
                              <span className="text-gray-400 dark:text-gray-500 italic">
                                No comment
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Assigned To */}
                      {history["Approver Action"] && (
                        <div className="flex items-center">
                          <div className="p-1.5 bg-gray-100 dark:bg-gray-600 rounded-lg mr-3">
                            <FiUser className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Assigned To
                            </div>
                            <div className="text-sm text-gray-900 dark:text-white">
                              {history["Approver Action"]}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white rounded-lg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

