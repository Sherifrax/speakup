export const ApiKeyStatusChecks = [
  { label: "IP Check", key: "isIpCheck" },
  { label: "Country Check", key: "isCountryCheck" },
  { label: "Region Check", key: "isRegionCheck" },
];

export const ApiKeyMenuItems = [
  {
    key: "edit",
    label: "Edit",
  },
];

export const ApiKeyFilterNames = [
  "isActive",
  "isIpCheck",
  "isCountryCheck",
  "isRegionCheck",
];

export const ApiKeyFilterOptions = [
  { value: "all", label: "All" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const ApiKeySecuritySettings = [
  { id: "isActive", label: "Active" },
  { id: "isIpCheck", label: "IP Check" },
  { id: "isCountryCheck", label: "Country Check" },
  { id: "isRegionCheck", label: "Region Check" },
];

export const ApiKeyTableColumns = [
  { column: "clientName", label: "Client" },
  { column: "apiKey", label: "API Key" },
  { column: "isActive", label: "Status" },
  { column: "isIpCheck", label: "IP Check" },
  { column: "isCountryCheck", label: "Country" },
  { column: "isRegionCheck", label: "Region" },
];
