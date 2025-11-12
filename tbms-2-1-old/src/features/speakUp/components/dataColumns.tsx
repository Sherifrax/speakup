import { ColumnType } from "../../../features/common/components/tables/DataTable";
import { SpeakUpItem } from "../types/speakupTypes";
import { ActionMenu } from "../../../features/common/components/tables/ActionMenu";
import { FiEdit, FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";
import { ActionType } from "../../../enum/actionType.enum";

export const dataColumns = (actionHandlers: {
  onInfo?: (item: SpeakUpItem, actionBy: string) => void;
  onEdit?: (item: SpeakUpItem, actionBy: string) => void;
  onSubmit?: (item: SpeakUpItem, actionType: ActionType, actionBy: string) => void;
  onCancel?: (item: SpeakUpItem, actionType: ActionType, actionBy: string) => void;
}): ColumnType<SpeakUpItem>[] => [
  {
    key: "SpeakUpType",
    title: "Type",
    sortable: true,
    render: (item) => (
      <div className="text-sm font-medium">{item.SpeakUpType || "N/A"}</div>
    ),
  },
  {
    key: "Message",
    title: "Message",
    sortable: true,
    render: (item) => (
      <div
        className="text-sm truncate max-w-[250px]"
        title={item.Message || "N/A"}
      >
        {item.Message || "N/A"}
      </div>
    ),
  },
  {
    key: "Attachment",
    title: "Attachment",
    sortable: false,
    render: (item) =>
      item.Attachment ? (
        <a
          href={item.Attachment}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View
        </a>
      ) : (
        <span className="text-gray-400">No Attachment</span>
      ),
  },
  {
    key: "IsAnonymous",
    title: "Is Anonymous",
    sortable: true,
    render: (item) => (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          item.IsAnonymous
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {item.IsAnonymous ? "Yes" : "No"}
      </span>
    ),
  },
  {
    key: "Status",
    title: "Status",
    sortable: true,
    render: (item) => (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          item.Status === "Open"
            ? "bg-blue-100 text-blue-800"
            : item.Status === "Closed"
            ? "bg-gray-200 text-gray-700"
            : "bg-green-100 text-green-800"
        }`}
      >
        {item.Status || "N/A"}
      </span>
    ),
  },
  {
    key: "actions",
    title: "Action",
    sortable: false,
    render: (item) => {
      const actions = [
        {
          key: "info",
          label: "Info",
          icon: <FiInfo size={14} />,
          visible: !!item.InfoBtn,
          onClick: () => actionHandlers.onInfo && actionHandlers.onInfo(item, "btnInfo"),
        },
        {
          key: "edit",
          label: "Edit",
          icon: <FiEdit size={14} />,
          visible: !!item.EditBtn,
          onClick: () => actionHandlers.onEdit && actionHandlers.onEdit(item, "btnEdit"),
        },
        {
          key: "submit",
          label: "Submit",
          icon: <FiCheckCircle size={14} />,
          visible: !!item.SubmitBtn,
          onClick: () => actionHandlers.onSubmit && actionHandlers.onSubmit(item, ActionType.Submit,"btnSubmit"),
        },
        {
          key: "cancel",
          label: "Cancel",
          icon: <FiXCircle size={14} />,
          visible: !!item.CancelBtn,
          onClick: () => actionHandlers.onCancel && actionHandlers.onCancel(item, ActionType.Cancel,"btnCancel"),
        },
      ];

      return <ActionMenu rowId={item.ID.toString()} actions={actions} visible={true} />;
    },
  },
];
