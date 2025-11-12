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
  IsAnonymous: number; // "0" or "1"
  compID: number;
  StatusID: number;
  TypeID: number;
  CommonSearchString: string;
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

// 🔹 Save request body
export interface SpeakUpSaveParams {
  ID: number; 
  IsAnonymous: number; 
  Attachment: string;
  compID: number;
  TypeID: number;
  Message: string;
  encryptedData: string;
  actionBy: string;
}

// 🔹 update history request body
export interface SpeakUpHistorySaveParams {
  Message: string;
  encryptedData: string; 
  actionBy: string;
}

// 🔹 action request body
export interface SpeakUpActionParams {
  action: string; 
  remarks: string;
  approvalActionID: number;
  assignedEmp: string;
  encryptedData: string;
  actionBy: string;
}

export interface SpeakUpGet {
  Id: number; 
  SpeakUpTypeID: number;
  IsAnonymous: boolean;
  Attachment: string;
  Message: string;
}
