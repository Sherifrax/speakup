import { SpeakUpEntry } from "../types/speakUpTypes";

interface SpeakUpExpandedDetailsProps {
  entry: SpeakUpEntry;
}

export const SpeakUpExpandedDetails = ({ entry }: SpeakUpExpandedDetailsProps) => {
  return (
    <tr className="bg-gray-50 dark:bg-gray-700">
      <td colSpan={7} className="px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Full Message</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                {entry.Message}
              </p>
            </div>
            
            {entry.Attachment && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Attachment</h4>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle attachment download
                    }}
                  >
                    {entry.Attachment}
                  </a>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Entry Details</h4>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">ID:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{entry.ID}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{entry.SpeakUpType || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Anonymous:</span>
                  <span className={`text-sm font-medium ${entry.IsAnonymous ? 'text-green-600' : 'text-gray-600'}`}>
                    {entry.IsAnonymous ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{entry.Status}</span>
                </div>
              </div>
            </div>
            
            {entry.Approver && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Approver</h4>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{entry.Approver}</p>
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Available Actions</h4>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex flex-wrap gap-2">
                  {entry.EditBtn && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                      Can Edit
                    </span>
                  )}
                  {entry.SubmitBtn && (
                    <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                      Can Submit
                    </span>
                  )}
                  {entry.CancelBtn && (
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                      Can Cancel
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

