// import { FiUser } from 'react-icons/fi';
// import { SpeakUpItem } from "../types/speakupTypes";

// interface SpeakUpExpandedDetailsProps {
//   entry: SpeakUpItem;
// }

// export const SpeakUpExpandedDetails = ({ entry }: SpeakUpExpandedDetailsProps) => {
//   // Determine which columns to show based on screen size
//   // Anonymous is hidden on < lg screens in the table, so show it in expanded row only on < lg screens
//   // Attachment is hidden on < 2xl screens in the table, so show it in expanded row only on < 2xl screens
//   // Expanded row itself only appears on < 2xl screens (when expand button is visible)

//   return (
//     <tr className="bg-gray-50/60 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-600">
//       <td colSpan={8} className="px-3 sm:px-4 py-3">
//         <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 sm:p-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//             {/* Employee Name (only when the table cell is hidden for smaller screens) */}
//             <div className="xl:hidden space-y-1">
//               <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Employee Name</div>
//               <div className="text-sm text-gray-900 dark:text-white whitespace-normal break-words">{entry.IsAnonymous ? "Anonymous" : (entry.EMPNAME || "—")}</div>
//             </div>
//             {/* Assigned Employee (only when the table cell is hidden for smaller screens) */}
//             <div className="xl:hidden space-y-1">
//               <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Assigned Employee</div>
//               <div className="text-sm text-gray-900 dark:text-white whitespace-normal break-words">{entry.AssignedEmp || "—"}</div>
//             </div>
//             {/* Anonymous badge for small screens for clarity */}
//             <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
//               <FiUser className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
//               <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap min-w-[90px]">
//                 Anonymous:
//               </span>
//               <div className="flex-1 min-w-0">
//                 <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                   entry.IsAnonymous 
//                     ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
//                     : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
//                 }`}>
//                   {entry.IsAnonymous ? 'Yes' : 'No'}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </td>
//     </tr>
//   );
// };

