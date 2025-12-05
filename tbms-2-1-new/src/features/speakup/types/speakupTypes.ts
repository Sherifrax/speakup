import { KeyValuePair } from "../../common/types/commonTypes";

// 🔹 Each record in search response
export interface SpeakUpItem {
  ID: number;
  Message: string;
  Attachment: string;
  IsAnonymous: boolean;
  Status: string;
  EMPNUMBER: string;
  EMPNAME: string;
  Designation: string;
  AssignedEmp: string;
  Approver: string;
  SpeakUpType: string;
  encryptedData: string;
  CompId?: number;
  InfoBtn: boolean | null;
  EditBtn: boolean | null;
  SubmitBtn: boolean | null;
  CancelBtn: boolean | null;
  AssignBtn: boolean | null;
  UpdateBtn: boolean | null;
  CloseBtn: boolean | null;
  ApproveBtn: boolean | null;
  RejectBtn: boolean | null;
}

// 🔹 Search request body
export interface SpeakUpSearchParams {
  IsAnonymous?: number; // "0" or "1"
  compID?: number;
  CompId?: number; // Alias for compatibility with old structure
  StatusID?: number | string; // Can be number or string ("-1" for empty)
  TypeID?: number | string; // Can be number or string ("-1" for empty)
  CommonSearchString?: string;
}

export interface SpeakUpFilterState {
  TypeID: string;
  StatusID: string;
  IsAnonymous: boolean;
}

export interface SpeakUpFilter {
  speakUpStatus: KeyValuePair[];
  speakUpType: KeyValuePair[];
  message: string;
}

// ===== Old structure filter types =====

export interface SpeakUpType {
  key: number;
  value: string;
}

export interface SpeakUpStatus {
  key: number;
  value: string;
  sortOrder: number;
}

export interface SpeakUpFiltersResponse {
  speakUpStatus: SpeakUpStatus[];
  speakUpType: SpeakUpType[];
}

// 🔹 Save request body
export interface SpeakUpSaveParams {
  payload?: string;
  actionBy: string;
  IsAnonymous: number | string; // Backend expects string, but we use number in form
  Attachment: string;
  TypeID: number | string; // Backend expects string, but we use number in form
  Message: string;
}

// ===== Old structure types (for compatibility) =====

// Alias for SpeakUpItem to match old naming
export type SpeakUpEntry = SpeakUpItem;

// Form data for insert/update
export interface SpeakUpFormData {
  ID: number; 
  Message: string;
  Attachment: string;
  IsAnonymous: boolean;
  TypeID: number;
  CompId: number;
}

// Search request (wraps search params)
export interface SpeakUpSearchRequest {
  params: SpeakUpSearchParams;
}

// Search response
export interface SpeakUpSearchResponse {
  data: SpeakUpEntry[];
  count: Array<{ TotalCount: number }>;
}

// Save request (wraps save params)
export interface SpeakUpSaveRequest {
  params: SpeakUpSaveParams;
}

// Save response
export interface SpeakUpSaveResponse {
  data: Array<{
    Status: string;
  }>;
}

// Submit request
export interface SpeakUpSubmitRequest {
  params: {
    payload: string;
    actionBy: string;
    remarks: string;
    assignedEmp: string;
  };
}

// Submit response
export interface SpeakUpSubmitResponse {
  data: Array<{
    Status: string;
  }>;
}

// GetById response
export interface SpeakUpGetByIdResponse {
  data: Array<{
    Message: string;
    Attachment: string;
    IsAnonymous: number;
    SpeakUpTypeID: number;
  }>;
}

// History entry
export interface SpeakUpHistoryEntry {
  Action: string;
  "Action By": string;
  "Action On": string;
  Comment: string | null;
  "Approver Action": string | null;
}

// History response
export interface SpeakUpHistoryResponse {
  data: SpeakUpHistoryEntry[];
  message?: string;
}

// Sort direction type
export type SortDirection = "asc" | "desc";