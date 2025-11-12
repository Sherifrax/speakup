import { FiUser, FiPaperclip } from 'react-icons/fi';
import { SpeakUpItem } from "../types/speakupTypes";
import { useState, useEffect } from 'react';

interface SpeakUpEntryExpandedDetailsProps {
  entry: SpeakUpItem;
}

export const SpeakUpEntryExpandedDetails = ({ entry }: SpeakUpEntryExpandedDetailsProps) => {
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1920);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Tailwind breakpoints: lg = 1024px, 2xl = 1536px
  // Determine which fields should be shown in expanded row based on screen size
  // Anonymous is hidden on < lg (1024px) screens in table, so show in expanded row
  // Attachment is hidden on < 2xl (1536px) screens in table, so show in expanded row
  const showAnonymous = windowWidth < 1024; // < lg: Anonymous is hidden in table
  const showAttachment = windowWidth < 1536; // < 2xl: Attachment is hidden in table

  // Calculate total number of visible columns for colSpan based on actual table structure:
  // Screen < lg: Expand button, Type, Message, Status, Actions = 5 columns
  // Screen lg to < 2xl: Expand button, Type, Message, Anonymous, Status, Actions = 6 columns
  // Screen >= 2xl: Type, Message, Anonymous, Status, Attachment, Actions = 6 columns (no expand button)
  let colSpan = 6; // Default for >= 2xl
  const hasExpandButton = windowWidth < 1536; // Expand button only shown < 2xl
  if (hasExpandButton) {
    if (windowWidth < 1024) {
      colSpan = 5; // < lg: Expand, Type, Message, Status, Actions
    } else {
      colSpan = 6; // lg to < 2xl: Expand, Type, Message, Anonymous, Status, Actions
    }
  }

  const hasFieldsToShow = showAnonymous || showAttachment;

  if (!hasFieldsToShow) return null;

  return (
    <tr className="bg-gray-50/60 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-600">
      <td colSpan={colSpan} className="px-3 sm:px-4 py-3">
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Anonymous (only when hidden in table: < lg screens) */}
            {showAnonymous && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FiUser className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Anonymous
                  </div>
                </div>
                <div className="text-sm text-gray-900 dark:text-white">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    entry.IsAnonymous 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {entry.IsAnonymous ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            )}

            {/* Attachment (only when hidden in table: < 2xl screens) */}
            {showAttachment && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FiPaperclip className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Attachment
                  </div>
                </div>
                <div className="text-sm text-gray-900 dark:text-white whitespace-normal break-words">
                  {entry.Attachment ? (
                    <a
                      href={entry.Attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                      title={entry.Attachment}
                    >
                      {entry.Attachment.length > 50 
                        ? `${entry.Attachment.substring(0, 50)}...` 
                        : entry.Attachment}
                    </a>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">No Attachment</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

