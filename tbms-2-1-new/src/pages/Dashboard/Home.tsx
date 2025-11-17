import React, { useEffect, useState, useMemo } from 'react';
import { useSearchSpeakUpMutation } from '../../services/Speakup/manage/search';
import { useSearchSpeakupApprovalMutation } from '../../services/Speakup/approval/searchApproval';
import { SpeakUpItem } from '../../features/speakup/types/speakupTypes';
import { ApprovalActionModal } from '../../features/speakup/components/approval/ApprovalActionModal';
import { ViewMessageModal } from '../../features/speakup/components/approval/ViewMessageModal';
import { HistoryModal } from '../../features/speakup/components/shared/HistoryModal';
import { UpdateHistoryModal } from '../../features/speakup/components/approval/UpdateHistoryModal';
import { ActionType } from '../../enum/actionType.enum';
import { 
  FiCheckCircle, 
  FiClock, 
  FiAlertTriangle,
  FiLoader,
  FiArrowRight,
  FiTrendingUp,
  FiCheck,
  FiX,
  FiUserPlus,
  FiMessageSquare,
  FiEye,
  FiEdit2
} from 'react-icons/fi';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery } from '../../services/Common/profileGet';

interface DashboardStats {
  totalRequests: number;
  pendingApprovals: number;
  openRequests: number;
  closedRequests: number;
  rejectedRequests: number;
  byStatus: Record<string, number>;
}

const Home: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  const [searchManage] = useSearchSpeakUpMutation();
  const [searchApproval] = useSearchSpeakupApprovalMutation();
  const { data: profileData } = useGetProfileQuery();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvalData, setApprovalData] = useState<SpeakUpItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pendingApprovals: 0,
    openRequests: 0,
    closedRequests: 0,
    rejectedRequests: 0,
    byStatus: {},
  });

  // Action modal states
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionType>(ActionType.Approve);
  const [selectedItem, setSelectedItem] = useState<SpeakUpItem | null>(null);
  
  // View and History modal states
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isUpdateHistoryOpen, setIsUpdateHistoryOpen] = useState(false);
  const [historyEntry, setHistoryEntry] = useState<SpeakUpItem | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch manage data (user's own requests)
      const manageResult = await searchManage({
        search: { 
          params: {
            IsAnonymous: 0,
            compID: 1,
            StatusID: "-1",
            TypeID: "-1",
            CommonSearchString: ""
          }
        },
        pagination: { page: 1, size: 1000 },
      }).unwrap();

      // Fetch approval data (requests assigned to user)
      const approvalResult = await searchApproval({
        search: {
          IsAnonymous: 0,
          compID: 1,
          StatusID: "-1",
          TypeID: "-1",
          CommonSearchString: ""
        },
        pagination: { page: 1, size: 1000 },
      }).unwrap();

      setApprovalData(approvalResult.data || []);

      // Combine all data for accurate statistics
      const allItems = [...(manageResult.data || []), ...(approvalResult.data || [])];
      const uniqueItems = Array.from(
        new Map(allItems.map(item => [item.ID, item])).values()
      );

      // Calculate statistics
      const newStats: DashboardStats = {
        totalRequests: manageResult.data?.length || 0,
        pendingApprovals: 0,
        openRequests: 0,
        closedRequests: 0,
        rejectedRequests: 0,
        byStatus: {},
      };

      // Process all unique items for accurate status counts
      uniqueItems.forEach((item) => {
        const status = item.Status?.toLowerCase() || '';
        newStats.byStatus[status] = (newStats.byStatus[status] || 0) + 1;
        
        if (status === 'open') {
          newStats.openRequests++;
        } else if (status === 'closed' || status === 'approved') {
          newStats.closedRequests++;
        } else if (status === 'rejected' || status === 'cancelled' || status === 'declined') {
          newStats.rejectedRequests++;
        }
      });

      // Count pending approvals from approval data
      approvalResult.data?.forEach((item) => {
        const status = item.Status?.toLowerCase() || '';
        if (status.includes('awaiting') || status.includes('approval') || 
            status === 'under hr manager' || status === 'assigned to employee' ||
            status === 'pending') {
          newStats.pendingApprovals++;
        }
      });

      setStats(newStats);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to load dashboard data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Match My Approvals height to Today's Summary height
  useEffect(() => {
    const matchHeights = () => {
      const todaySummaryCard = document.getElementById('today-summary-card');
      const myApprovalsCard = document.getElementById('my-approvals-card');
      
      if (todaySummaryCard && myApprovalsCard) {
        const todayHeight = todaySummaryCard.offsetHeight;
        myApprovalsCard.style.height = `${todayHeight}px`;
        myApprovalsCard.style.maxHeight = `${todayHeight}px`;
      }
    };

    // Match heights on load, after data loads, and on resize
    const timeoutId = setTimeout(matchHeights, 100);
    window.addEventListener('resize', matchHeights);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', matchHeights);
    };
  }, [stats, approvalData]);

  // Calculate status breakdown for chart - from all approval data
  const statusBreakdown = useMemo(() => {
    let pending = 0;
    let open = 0;
    let approved = 0;
    let declined = 0;

    // Count from approval data for accurate approval status
    approvalData.forEach((item) => {
      const status = item.Status?.toLowerCase() || '';
      if (status.includes('awaiting') || status.includes('approval') || 
          status === 'under hr manager' || status === 'assigned to employee' ||
          status === 'pending') {
        pending++;
      } else if (status === 'open') {
        open++;
      } else if (status === 'closed' || status === 'approved') {
        approved++;
      } else if (status === 'rejected' || status === 'cancelled' || status === 'declined') {
        declined++;
      }
    });

    const total = pending + open + approved + declined;

    return { pending, open, approved, declined, total };
  }, [approvalData]);

  // Donut chart options matching Trojan style
  const chartOptions: ApexOptions = useMemo(() => ({
    chart: {
      type: 'donut',
      height: 220,
      toolbar: { show: false },
    },
    labels: ['Pending', 'Open', 'Approved', 'Declined'],
    colors: ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'],
    legend: {
      show: false, // Hide default legend, we'll use custom one
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%', // Even wider bars (smaller donut hole)
          labels: {
            show: false, // Hide default labels, using custom overlay
          }
        },
        expandOnClick: false,
      }
    },
    stroke: {
      show: true,
      width: 3, // Small white border between segments
      colors: ['#FFFFFF']
    },
    tooltip: {
      enabled: true,
      theme: isDarkMode ? 'dark' : 'light',
    },
    theme: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  }), [statusBreakdown.total, isDarkMode]);

  const chartSeries = useMemo(() => [
    statusBreakdown.pending,
    statusBreakdown.open,
    statusBreakdown.approved,
    statusBreakdown.declined,
  ], [statusBreakdown]);

  // Get recent items for My Approvals - only show items where user can take action
  const recentItems = useMemo(() => {
    // Filter to only show items with actionable buttons
    const actionableItems = approvalData.filter((item) => {
      // Check if at least one action button is available
      const canApprove = item.ApproveBtn !== false;
      const canReject = item.RejectBtn !== false;
      const canAssign = item.AssignBtn === true;
      const canUpdate = item.UpdateBtn === true;
      const canClose = item.CloseBtn === true;
      
      // Return true if at least one action is available
      // Note: View and History are always available, so we check for actionable buttons
      return canApprove || canReject || canAssign || canUpdate || canClose;
    });
    
    // Return up to 8 actionable items
    return actionableItems.slice(0, 8);
  }, [approvalData]);

  // Get latest updates - show all recent items (not filtered)
  const latestUpdates = useMemo(() => 
    approvalData.slice(0, 6), 
    [approvalData]
  );

  // Action handlers
  const handleApprove = (item: SpeakUpItem) => {
    setSelectedItem(item);
    setCurrentAction(ActionType.Approve);
    setIsActionModalOpen(true);
  };

  const handleReject = (item: SpeakUpItem) => {
    setSelectedItem(item);
    setCurrentAction(ActionType.Reject);
    setIsActionModalOpen(true);
  };

  const handleAssign = (item: SpeakUpItem) => {
    setSelectedItem(item);
    setCurrentAction(ActionType.Assign);
    setIsActionModalOpen(true);
  };

  const handleClose = (item: SpeakUpItem) => {
    setSelectedItem(item);
    setCurrentAction(ActionType.Close);
    setIsActionModalOpen(true);
  };

  const handleViewMessage = (item: SpeakUpItem) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleViewHistory = (item: SpeakUpItem) => {
    setHistoryEntry(item);
    setIsHistoryOpen(true);
  };

  const handleUpdateHistory = (item: SpeakUpItem) => {
    setHistoryEntry(item);
    setIsUpdateHistoryOpen(true);
  };

  const handleActionSuccess = () => {
    setIsActionModalOpen(false);
    setIsUpdateHistoryOpen(false);
    setSelectedItem(null);
    setHistoryEntry(null);
    fetchDashboardData();
  };

  const closeViewModal = () => {
    setIsViewOpen(false);
    setSelectedItem(null);
  };

  const closeHistoryModal = () => {
    setIsHistoryOpen(false);
    setHistoryEntry(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <FiLoader className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
  return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <FiAlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
    </div>
  );
}

  return (
    <div className="space-y-6">
      {/* Header with greeting */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Hello, {profileData?.profile?.employeeName || 'User'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome to your Speak Up Dashboard
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Today's Summary Card */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-lg hover:shadow-xl transition-all duration-300 p-6" id="today-summary-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Today's Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-all duration-200">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Request Under Process</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1.5">
                    {stats.openRequests}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">In Last 30 Days</p>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FiTrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 hover:shadow-md transition-all duration-200">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Pending Approvals</p>
                  <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mt-1.5">
                    {stats.pendingApprovals}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">In Last 30 Days</p>
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <FiClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 hover:shadow-md transition-all duration-200">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Closed Requests</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1.5">
                    {stats.closedRequests}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">In Last 30 Days</p>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 hover:shadow-md transition-all duration-200">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Rejected/Cancelled</p>
                  <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-1.5">
                    {stats.rejectedRequests}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">In Last 30 Days</p>
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Section */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
            {/* Reports Header */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reports
              </h3>
            </div>

            {/* Reports Card - Inner Card */}
            <div className="bg-white dark:bg-gray-800/95 rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-4 h-[280px] flex flex-col overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                  Approvals Status
                </h4>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Today
                </span>
              </div>

              {/* Chart and Legend */}
              <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-16 flex-1 min-h-0">
                {chartSeries.some(v => v > 0) ? (
                  <>
                    <div className="relative flex-shrink-0 max-w-[240px] w-full flex items-center justify-center">
                      <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="donut"
                        height={220}
                      />
                      {/* White circle overlay for center label - perfectly centered */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-28 h-28 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center">
                          <span className="text-[9px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">TOTAL</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">{statusBreakdown.total}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 md:space-y-4 flex-1 w-full">
                      <div className="flex items-center gap-2 md:gap-2.5 justify-between pb-2.5 md:pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 md:gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] flex-shrink-0"></div>
                          <span className="text-[11px] md:text-xs font-medium text-gray-700 dark:text-gray-300">Pending</span>
                        </div>
                        <span className="text-[11px] md:text-xs font-bold text-gray-900 dark:text-white">{statusBreakdown.pending}</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-2.5 justify-between pb-2.5 md:pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 md:gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] flex-shrink-0"></div>
                          <span className="text-[11px] md:text-xs font-medium text-gray-700 dark:text-gray-300">Open</span>
                        </div>
                        <span className="text-[11px] md:text-xs font-bold text-gray-900 dark:text-white">{statusBreakdown.open}</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-2.5 justify-between pb-2.5 md:pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 md:gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] flex-shrink-0"></div>
                          <span className="text-[11px] md:text-xs font-medium text-gray-700 dark:text-gray-300">Approved</span>
                        </div>
                        <span className="text-[11px] md:text-xs font-bold text-gray-900 dark:text-white">{statusBreakdown.approved}</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-2.5 justify-between">
                        <div className="flex items-center gap-2 md:gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] flex-shrink-0"></div>
                          <span className="text-[11px] md:text-xs font-medium text-gray-700 dark:text-gray-300">Declined</span>
                        </div>
                        <span className="text-[11px] md:text-xs font-bold text-gray-900 dark:text-white">{statusBreakdown.declined}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <p>No data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* My Approvals Card - Match Today's Summary height */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col" id="my-approvals-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  My Approvals
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Review and take action on pending requests
                </p>
              </div>
              <button
                onClick={() => navigate('/speakup/approval')}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                View All
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Content Area with Actions - Scrollable - Match Today's Summary height */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
              {recentItems.length > 0 ? (
                <div className="space-y-4">
                  {recentItems.map((item) => (
                    <div
                      key={item.ID}
                      className="group p-4 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-300"
                    >
                      {/* Request Summary */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 pr-3">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0"></div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {item.SpeakUpType || 'N/A'}
                              </p>
                            </div>
                            {item.EMPNAME && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 ml-3.5">
                                By: <span className="font-semibold text-gray-700 dark:text-gray-300">{item.EMPNAME}</span>
                              </p>
                            )}
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg shadow-sm flex-shrink-0 ${
                            item.Status?.toLowerCase() === 'open' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                              : item.Status?.toLowerCase() === 'closed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 border border-green-200 dark:border-green-800'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800'
                          }`}>
                            {item.Status}
                          </span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/50">
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {item.Message?.substring(0, 120) || 'No message'}
                            {item.Message && item.Message.length > 120 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-4 border-t border-gray-200/80 dark:border-gray-700/80 flex-wrap">
                        {/* View Actions - Always Available */}
                        <button
                          onClick={() => handleViewMessage(item)}
                          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleViewHistory(item)}
                          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                        >
                          <FiClock className="w-3.5 h-3.5" />
                          History
                        </button>
                        
                        {/* Action Buttons - Conditional */}
                        {item.ApproveBtn !== false && (
                          <button
                            onClick={() => handleApprove(item)}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-green-400/20"
                          >
                            <FiCheck className="w-4 h-4" />
                            Approve
                          </button>
                        )}
                        {item.RejectBtn !== false && (
                          <button
                            onClick={() => handleReject(item)}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-red-400/20"
                          >
                            <FiX className="w-4 h-4" />
                            Reject
                          </button>
                        )}
                        {item.AssignBtn === true && (
                          <button
                            onClick={() => handleAssign(item)}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-blue-400/20"
                          >
                            <FiUserPlus className="w-4 h-4" />
                            Assign
                          </button>
                        )}
                        {item.UpdateBtn === true && (
                          <button
                            onClick={() => handleUpdateHistory(item)}
                            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                            Update
                          </button>
                        )}
                        {item.CloseBtn === true && (
                          <button
                            onClick={() => handleClose(item)}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                          >
                            <FiX className="w-3.5 h-3.5" />
                            Close
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 min-h-[400px] text-gray-500 dark:text-gray-400">
                  <FiMessageSquare className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm font-medium">No pending approvals</p>
                </div>
              )}
            </div>
          </div>

          {/* Latest Updates Section */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
            {/* Latest Updates Header */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Latest Updates
              </h3>
            </div>

            {/* Latest Updates Card - Inner Card */}
            <div className="bg-white dark:bg-gray-800/95 rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-6 h-[280px] flex flex-col">
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {latestUpdates.length > 0 ? (
                <div className="space-y-3">
                  {latestUpdates.map((item) => (
                    <div
                      key={item.ID}
                      className="group relative p-4 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800/60 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300"
                    >
                      {/* Timeline indicator */}
                      <div className="absolute left-4 top-6 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 to-transparent opacity-30 group-hover:opacity-60 transition-opacity"></div>
                      <div className="absolute left-3.5 top-5 w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-sm"></div>
                      
                      <div className="ml-6">
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate mb-1">
                              {item.SpeakUpType || 'N/A'}
                            </p>
                            {item.EMPNAME && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                By: <span className="font-semibold text-gray-700 dark:text-gray-300">{item.EMPNAME}</span>
                              </p>
                            )}
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg shadow-sm flex-shrink-0 ml-3 ${
                            item.Status?.toLowerCase() === 'open' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                              : item.Status?.toLowerCase() === 'closed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 border border-green-200 dark:border-green-800'
                              : item.Status?.toLowerCase() === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200 border border-gray-200 dark:border-gray-800'
                          }`}>
                            {item.Status}
                          </span>
                        </div>
                        {item.Message && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 leading-relaxed">
                            {item.Message.substring(0, 80)}
                            {item.Message.length > 80 ? '...' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <FiClock className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm font-medium">No recent updates</p>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal - Always render, controlled by isActionModalOpen */}
      <ApprovalActionModal
        isOpen={isActionModalOpen && selectedItem !== null}
        onClose={() => {
          setIsActionModalOpen(false);
          setSelectedItem(null);
        }}
        actionType={currentAction}
        encryptedData={selectedItem?.encryptedData || ""}
        assignedEmp={selectedItem?.AssignedEmp || ""}
        onSuccess={handleActionSuccess}
      />

      {/* View Message Modal */}
      <ViewMessageModal
        isOpen={isViewOpen}
        onClose={closeViewModal}
        entry={selectedItem}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={closeHistoryModal}
        entry={historyEntry}
      />

      {/* Update History Modal */}
      <UpdateHistoryModal
        isOpen={isUpdateHistoryOpen}
        onClose={() => {
          setIsUpdateHistoryOpen(false);
          setHistoryEntry(null);
        }}
        encryptedData={historyEntry?.encryptedData || ""}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
};

export default Home;
