import { FiPaperclip, FiUser } from 'react-icons/fi';
import { SpeakUpItem } from "../types/speakupTypes";

interface SpeakUpExpandedDetailsProps {
  entry: SpeakUpItem;
}

export const SpeakUpExpandedDetails = ({ entry }: SpeakUpExpandedDetailsProps) => {
  // Determine which columns to show based on screen size
  // Anonymous is hidden on < lg screens in the table, so show it in expanded row only on < lg screens
  // Attachment is hidden on < 2xl screens in the table, so show it in expanded row only on < 2xl screens
  // Expanded row itself only appears on < 2xl screens (when expand button is visible)

  return (
    <tr className="bg-gray-50/50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-600">
      <td colSpan={7} className="px-3 sm:px-4 py-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Anonymous - shown only on screens < lg (where it's hidden in table) */}
          <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
            <FiUser className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap min-w-[90px]">
              Anonymous:
            </span>
            <div className="flex-1 min-w-0">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                entry.IsAnonymous 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {entry.IsAnonymous ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          {/* Attachment - shown only on screens < 2xl (where it's hidden in table) */}
          <div className="flex items-center gap-2 sm:gap-3 2xl:hidden">
            <FiPaperclip className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap min-w-[90px]">
              Attachment:
            </span>
            <div className="flex-1 min-w-0">
              {entry.Attachment ? (
                <a
                  href={entry.Attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded transition-colors"
                  title={entry.Attachment}
                >
                  View
                </a>
              ) : (
                <span className="text-sm text-gray-400 dark:text-gray-500 italic">No Attachment</span>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

