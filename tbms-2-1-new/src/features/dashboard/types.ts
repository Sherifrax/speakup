export interface DashboardStats {
  totalRequests: number;
  pendingApprovals: number;
  openRequests: number;
  closedRequests: number;
  rejectedRequests: number;
  myRequests: number;
  awaitingMyAction: number;
  myActiveRequests: number;
  myCompletedRequests: number;
  byStatus: Record<string, number>;
}

export interface StatusBreakdown {
  pending: number;
  open: number;
  approved: number;
  declined: number;
  total: number;
}

