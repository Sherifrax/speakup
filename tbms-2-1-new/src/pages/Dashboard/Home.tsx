import React, { useEffect, useState, useMemo } from 'react';
import { useSearchSpeakUpMutation } from '../../services/Speakup/manage/search';
import { useSearchSpeakupApprovalMutation } from '../../services/Speakup/approval/searchApproval';
import { SpeakUpItem } from '../../features/speakup/types/speakupTypes';
import { ApprovalActionModal } from '../../features/speakup/components/approval/ApprovalActionModal';
import { ViewMessageModal } from '../../features/speakup/components/approval/ViewMessageModal';
import { HistoryModal } from '../../features/speakup/components/shared/HistoryModal';
import { UpdateHistoryModal } from '../../features/speakup/components/approval/UpdateHistoryModal';
import { ActionType } from '../../enum/actionType.enum';
import { FiAlertTriangle, FiLoader } from 'react-icons/fi';
import { ApexOptions } from 'apexcharts';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery } from '../../services/Common/profileGet';
import { SummaryCard } from '../../features/dashboard/components/SummaryCard.tsx';
import { ApprovalsStatusCard } from '../../features/dashboard/components/ApprovalsStatusCard.tsx';
import { MyApprovalsCard } from '../../features/dashboard/components/MyApprovalsCard.tsx';
import { LatestUpdatesCard } from '../../features/dashboard/components/LatestUpdatesCard.tsx';
import { DashboardStats, StatusBreakdown } from '../../features/dashboard/types.ts';
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
  const [manageData, setManageData] = useState<SpeakUpItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pendingApprovals: 0,
    openRequests: 0,
    closedRequests: 0,
    rejectedRequests: 0,
    myRequests: 0,
    awaitingMyAction: 0,
    myActiveRequests: 0,
    myCompletedRequests: 0,
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
      setManageData(manageResult.data || []);

      // Calculate statistics based on requests (manage data) only
      const requestItems = manageResult.data || [];
      const approvalItems = approvalResult.data || [];

      // Calculate statistics
      const newStats: DashboardStats = {
        totalRequests: requestItems.length || 0,
        pendingApprovals: 0,
        openRequests: 0,
        closedRequests: 0,
        rejectedRequests: 0,
        myRequests: requestItems.length || 0,
        awaitingMyAction: 0,
        myActiveRequests: 0,
        myCompletedRequests: 0,
        byStatus: {},
      };

      // Process request items for accurate status counts
      requestItems.forEach((item) => {
        const status = item.Status?.toLowerCase() || '';
        newStats.byStatus[status] = (newStats.byStatus[status] || 0) + 1;
        
        // Categorize by status - focus on MY requests
        if (status === 'closed' || status === 'approved') {
          newStats.closedRequests++;
          newStats.myCompletedRequests++;
        } else if (status === 'rejected' || status === 'cancelled' || status === 'declined') {
          newStats.rejectedRequests++;
        } else {
          // All other statuses are considered active (my active requests)
          newStats.myActiveRequests++;
          if (status === 'open') {
            newStats.openRequests++;
          }
        }
      });

      // Count items awaiting user's action (from approval data)
      approvalItems.forEach((item) => {
        const canApprove = item.ApproveBtn !== false;
        const canReject = item.RejectBtn !== false;
        const canAssign = item.AssignBtn === true;
        const canUpdate = item.UpdateBtn === true;
        const canClose = item.CloseBtn === true;
        
        // If user can take any action, it's awaiting their action
        if (canApprove || canReject || canAssign || canUpdate || canClose) {
          newStats.awaitingMyAction++;
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

  // Calculate status breakdown for chart - from Speak up Entry (manage data)
  const statusBreakdown = useMemo<StatusBreakdown>(() => {
    let pending = 0;
    let open = 0;
    let approved = 0;
    let declined = 0;

    // Count from manage data (Speak up Entry) for approval status
    manageData.forEach((item) => {
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
  }, [manageData]);

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
        <div className="space-y-6">
          <SummaryCard
            stats={stats}
            onNavigateManage={() => navigate('/speakup/manage')}
            onNavigateApproval={() => navigate('/speakup/approval')}
          />

          <ApprovalsStatusCard
            chartOptions={chartOptions}
            chartSeries={chartSeries}
            statusBreakdown={statusBreakdown}
          />
        </div>

        <div className="space-y-6">
          <MyApprovalsCard
            items={approvalData}
            onApprove={handleApprove}
            onReject={handleReject}
            onAssign={handleAssign}
            onUpdate={handleUpdateHistory}
            onClose={handleClose}
            onViewMessage={handleViewMessage}
            onViewHistory={handleViewHistory}
          />

          <LatestUpdatesCard items={latestUpdates} />
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











