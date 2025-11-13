// import { useState } from "react";
// import { ColumnType } from "../../../features/common/components/tables/DataTable";
// import { SpeakUpItem } from "../types/speakupTypes";
// import { FiMoreVertical } from "react-icons/fi";
// import { ActionType } from "../../../enum/actionType.enum";
// import { MessageCell } from "./MessageCell";
// import { SpeakUpActionMenu } from "./SpeakUpActionMenu";
// import { Dropdown } from "../../../features/common/components/ui/dropdown/Dropdown";

// export const dataColumns = (actionHandlers: {
//   onInfo?: (item: SpeakUpItem, actionBy: string) => void;
//   onEdit?: (item: SpeakUpItem, actionBy: string) => void;
//   onSubmit?: (item: SpeakUpItem, actionType: ActionType, actionBy: string) => void;
//   onCancel?: (item: SpeakUpItem, actionType: ActionType, actionBy: string) => void;
//   onView?: (item: SpeakUpItem) => void;
//   onDelete?: (item: SpeakUpItem) => void;
//   onApprove?: (item: SpeakUpItem) => void;
//   onReject?: (item: SpeakUpItem) => void;
//   onViewHistory?: (item: SpeakUpItem) => void;
// }): ColumnType<SpeakUpItem>[] => [
//   {
//     key: "SpeakUpType",
//     title: "Type",
//     sortable: true,
//     render: (item) => (
//       <div className="text-sm font-medium">{item.SpeakUpType || "N/A"}</div>
//     ),
//   },
//   {
//     key: "Message",
//     title: "Message",
//     sortable: true,
//     render: (item) => {
//       return <MessageCell message={item.Message || ""} maxLength={15} className="max-w-xs" />;
//     },
//   },
//   {
//     key: "Attachment",
//     title: "Attachment",
//     sortable: false,
//     render: (item) =>
//       item.Attachment ? (
//         <a
//           href={item.Attachment}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-600 hover:underline"
//         >
//           View
//         </a>
//       ) : (
//         <span className="text-gray-400">No Attachment</span>
//       ),
//   },
//   {
//     key: "IsAnonymous",
//     title: "Is Anonymous",
//     sortable: true,
//     render: (item) => (
//       <span
//         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//           item.IsAnonymous
//             ? "bg-yellow-100 text-yellow-800"
//             : "bg-green-100 text-green-800"
//         }`}
//       >
//         {item.IsAnonymous ? "Yes" : "No"}
//       </span>
//     ),
//   },
//   {
//     key: "Status",
//     title: "Status",
//     sortable: true,
//     render: (item) => (
//       <span
//         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//           item.Status === "Open"
//             ? "bg-blue-100 text-blue-800"
//             : item.Status === "Closed"
//             ? "bg-gray-200 text-gray-700"
//             : "bg-green-100 text-green-800"
//         }`}
//       >
//         {item.Status || "N/A"}
//       </span>
//     ),
//   },
//   {
//     key: "actions",
//     title: "Actions",
//     sortable: false,
//     render: (item) => {
//       const ActionMenuWrapper = () => {
//         const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
//         const isOpen = openDropdownId === item.ID;

//         return (
//           <div className="relative">
//             <button
//               onClick={() => setOpenDropdownId(isOpen ? null : item.ID)}
//               className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//             >
//               <FiMoreVertical className="h-4 w-4" />
//             </button>
//             <Dropdown
//               isOpen={isOpen}
//               onClose={() => setOpenDropdownId(null)}
//               className="right-0 mt-2"
//             >
//               <SpeakUpActionMenu
//                 entry={item}
//                 onEdit={(entry) => {
//                   actionHandlers.onEdit && actionHandlers.onEdit(entry, "btnEdit");
//                   setOpenDropdownId(null);
//                 }}
//                 onView={(entry) => {
//                   actionHandlers.onView && actionHandlers.onView(entry);
//                   setOpenDropdownId(null);
//                 }}
//                 onDelete={(entry) => {
//                   actionHandlers.onDelete && actionHandlers.onDelete(entry);
//                   setOpenDropdownId(null);
//                 }}
//                 onApprove={(entry) => {
//                   actionHandlers.onApprove && actionHandlers.onApprove(entry);
//                   setOpenDropdownId(null);
//                 }}
//                 onReject={(entry) => {
//                   actionHandlers.onReject && actionHandlers.onReject(entry);
//                   setOpenDropdownId(null);
//                 }}
//                 onCancel={(entry) => {
//                   actionHandlers.onCancel && actionHandlers.onCancel(entry, ActionType.Cancel, "btnCancel");
//                   setOpenDropdownId(null);
//                 }}
//                 onSubmit={(entry) => {
//                   actionHandlers.onSubmit && actionHandlers.onSubmit(entry, ActionType.Submit, "btnSubmit");
//                   setOpenDropdownId(null);
//                 }}
//                 onViewHistory={(entry) => {
//                   actionHandlers.onViewHistory && actionHandlers.onViewHistory(entry);
//                   setOpenDropdownId(null);
//                 }}
//                 onClose={() => setOpenDropdownId(null)}
//                 isEndUser={true}
//               />
//             </Dropdown>
//           </div>
//         );
//       };

//       return <ActionMenuWrapper />;
//     },
//   },
// ];
