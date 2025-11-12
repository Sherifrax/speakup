export enum speakupUrls {
    // Path segments only; module prefix comes from baseModule.speakup
    Search = "api/speakup/search",
    SearchManage = "api/speakup/searchEntry", // Returns entries created by user (for manage page)
    SearchApproval = "api/speakup/searchManage", // Returns entries assigned to user (for approval page)
    Get ="api/speakup/getbyId",
    Filters="api/speakup/getFilters",
    Save = "api/speakup/save",
    action = "api/speakup/action",
    GetHistory= "api/speakup/getHistory",
    UpdateHistory = "api/speakup/updateHistory"
  }