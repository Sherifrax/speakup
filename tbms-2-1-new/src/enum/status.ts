export enum Status {
  Active = "Active",
  Inactive = "Inactive",
}

export const StatusColors = {
  [Status.Active]: {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-800 dark:text-green-200",
  },
  [Status.Inactive]: {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-800 dark:text-red-200",
  },
};
