// features/speakUp/types/speakUpTypes.ts

export interface SpeakUpEntry {
  ID: number;
  Message: string;
  Attachment: string;
  IsAnonymous: boolean;
  EditBtn: boolean;
  SubmitBtn: boolean;
  CancelBtn: boolean;
  Status: string;
  Approver: string;
  SpeakUpType: string | null;
  encryptedData: string;
} // This interface is the response for the entry page

export interface SpeakUpFormData {
  ID: number; 
  Message: string;
  Attachment: string;
  IsAnonymous: boolean;
  TypeID: number;
  CompId: number;
} // Insert/ Update speak-up entry.

export interface SpeakUpSearchParams {
  IsAnonymous?: number;
  CompId?: number;
  StatusID?: string;
  TypeID?: string;
  CommonSearchString?: string;
}

export interface SpeakUpFilters {
  StatusID: string;
  TypeID: string;
  IsAnonymous: string;
}

export interface SpeakUpType {
  key: number;
  value: string;
} // Request Type

export interface SpeakUpStatus {
  key: number;
  value: string;
  sortOrder: number;
} // Request Status

export interface SpeakUpFiltersResponse {
  speakUpStatus: SpeakUpStatus[];
  speakUpType: SpeakUpType[];
}

export interface SpeakUpHistoryEntry {
  Action: string;
  "Action By": string;
  "Action On": string;
  Comment: string | null;
  "Approver Action": string | null;
}

export interface SpeakUpSubmitParams {
  compId: number;
  ID: number;
  action: string;
  approvalActionID: number;
  status: string;
  remarks: string;
  assignedEmp: string;
}

export interface SpeakUpSaveRequest {
  params: {
    IsAnonymous: number;
    ID: number;
    compID: string;
    Attachment: string;
    TypeID: number;
    Message: string;
  };
}

export interface SpeakUpSubmitRequest {
  params: SpeakUpSubmitParams;
}

export interface SpeakUpSearchRequest {
  params: SpeakUpSearchParams;
}

export interface SpeakUpSearchResponse {
  data: SpeakUpEntry[];
  count: Array<{ TotalCount: number }>;
}

export interface SpeakUpGetByIdResponse {
  data: Array<{
    Message: string;
    Attachment: string;
    IsAnonymous: number;
    SpeakUpTypeID: number;
  }>;
}

export interface SpeakUpHistoryResponse {
  data: SpeakUpHistoryEntry[];
}

export interface SpeakUpSaveResponse {
  data: Array<{
    Status: string;
  }>;
}

export interface SpeakUpSubmitResponse {
  data: Array<{
    Status: string;
  }>;
}

export interface SpeakUpUpdateHistoryParams {
  compId: number;
  ID: number;
  message: string;
}

export interface SpeakUpUpdateHistoryRequest {
  params: SpeakUpUpdateHistoryParams;
}

export interface SpeakUpUpdateHistoryResponse {
  data: Array<{
    Status: string;
  }>;
}

export type SortDirection = "asc" | "desc";
