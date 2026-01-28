import { SpeakUpItem } from "../../speakup/types/speakupTypes";

export type StatusVariant = "pending" | "open" | "approved" | "declined" | "default";

const STATUS_STYLE_MAP: Record<
  StatusVariant,
  { badge: string; dot: string; timeline: string }
> = {
  pending: {
    badge:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800",
    dot: "bg-yellow-500 dark:bg-yellow-400",
    timeline: "from-yellow-400",
  },
  open: {
    badge:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500 dark:bg-blue-400",
    timeline: "from-blue-400",
  },
  approved: {
    badge:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 border border-green-200 dark:border-green-800",
    dot: "bg-green-500 dark:bg-green-400",
    timeline: "from-green-400",
  },
  declined: {
    badge:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border border-red-200 dark:border-red-800",
    dot: "bg-red-500 dark:bg-red-400",
    timeline: "from-red-400",
  },
  default: {
    badge:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200 border border-gray-200 dark:border-gray-800",
    dot: "bg-indigo-500 dark:bg-indigo-400",
    timeline: "from-indigo-400",
  },
};

export const mapStatusToVariant = (status?: string): StatusVariant => {
  const normalized = status?.toLowerCase().trim() || "";
  if (!normalized) return "default";

  if (
    normalized === "pending" ||
    normalized.includes("awaiting") ||
    normalized.includes("under hr") ||
    normalized.includes("assigned to employee") ||
    normalized.includes("in progress")
  ) {
    return "pending";
  }

  if (normalized === "open") {
    return "open";
  }

  if (
    normalized === "approved" ||
    normalized === "closed" ||
    normalized.includes("completed") ||
    normalized.includes("resolved")
  ) {
    return "approved";
  }

  if (
    normalized === "declined" ||
    normalized === "rejected" ||
    normalized === "cancelled" ||
    normalized === "canceled" ||
    normalized.includes("not approved")
  ) {
    return "declined";
  }

  return "default";
};

export const getStatusStyle = (status?: string) => STATUS_STYLE_MAP[mapStatusToVariant(status)];

export const isActionable = (item: SpeakUpItem) => {
  const canApprove = item.ApproveBtn !== false;
  const canReject = item.RejectBtn !== false;
  const canAssign = item.AssignBtn === true;
  const canUpdate = item.UpdateBtn === true;
  const canClose = item.CloseBtn === true;
  return canApprove || canReject || canAssign || canUpdate || canClose;
};


