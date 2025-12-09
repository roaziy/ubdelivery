'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  FiDollarSign,
  FiCheck,
  FiX,
  FiEye,
  FiSearch,
  FiFilter,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';
import { MdStorefront } from 'react-icons/md';
import AdminLayout from '@/components/layout/AdminLayout';
import { RefundRequest, Payout, RevenueData } from '@/types';
import { FinanceService } from '@/lib/services';
import {
  mockRefundRequests,
  mockPayouts,
  mockRevenueData,
  mockPlatformStats,
} from '@/lib/mockData';

type TabType = 'overview' | 'refunds' | 'payouts';
type RefundFilter = 'all' | 'pending' | 'approved' | 'rejected';
type PayoutFilter = 'all' | 'pending' | 'processing' | 'completed' | 'failed';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundFilter, setRefundFilter] = useState<RefundFilter>('pending');
  const [payoutFilter, setPayoutFilter] = useState<PayoutFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);

  const statsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLTableSectionElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [refundRes, payoutRes, revenueRes] = await Promise.all([
          FinanceService.getRefundRequests(),
          FinanceService.getPayouts(),
          FinanceService.getRevenueData(),
        ]);

        if (refundRes.success) setRefunds(refundRes.data!);
        if (payoutRes.success) setPayouts(payoutRes.data!);
        if (revenueRes.success) setRevenueData(revenueRes.data!);
      } catch {
        setRefunds(mockRefundRequests);
        setPayouts(mockPayouts);
        setRevenueData(mockRevenueData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && statsRef.current) {
      gsap.from(statsRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && listRef.current) {
      gsap.from(listRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power3.out',
      });
    }
  }, [loading, activeTab, refundFilter, payoutFilter]);

  useEffect(() => {
    if (selectedRefund && modalRef.current) {
      gsap.from(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power3.out',
      });
    }
  }, [selectedRefund]);

  const handleApproveRefund = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await FinanceService.approveRefund(id);
      if (response.success) {
        setRefunds((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r))
        );
        setSelectedRefund(null);
      }
    } catch (error) {
      console.error('Failed to approve refund:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRefund = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await FinanceService.rejectRefund(id, 'Not eligible for refund');
      if (response.success) {
        setRefunds((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as const } : r))
        );
        setSelectedRefund(null);
      }
    } catch (error) {
      console.error('Failed to reject refund:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleProcessPayout = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await FinanceService.processPayout(id);
      if (response.success) {
        setPayouts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: 'processing' as const } : p))
        );
      }
    } catch (error) {
      console.error('Failed to process payout:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRefunds = refunds.filter((refund) => {
    const matchesFilter = refundFilter === 'all' || refund.status === refundFilter;
    const matchesSearch =
      refund.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredPayouts = payouts.filter((payout) => {
    const matchesFilter = payoutFilter === 'all' || payout.status === payoutFilter;
    const matchesSearch = payout.restaurantName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const totalRevenue = mockPlatformStats.month.revenue;
  const totalRefunds = refunds
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);
  const pendingPayouts = payouts
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-mainGreen border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-mainBlack">Finance</h1>
          <p className="text-gray-500 mt-1">
            Manage refunds, payouts, and financial overview
          </p>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-mainBlack mt-1">
                  ${totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2 text-mainGreen text-sm">
                  <FiArrowUp size={14} />
                  <span>+12% vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-mainGreen/10 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="text-mainGreen" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Refunds</p>
                <p className="text-2xl font-bold text-mainBlack mt-1">
                  {refunds.filter((r) => r.status === 'pending').length}
                </p>
                <p className="text-yellow-600 text-sm mt-2">Requires attention</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FiArrowDown className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Refunds (Approved)</p>
                <p className="text-2xl font-bold text-mainBlack mt-1">
                  ${totalRefunds.toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm mt-2">This month</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FiDollarSign className="text-red-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Payouts</p>
                <p className="text-2xl font-bold text-mainBlack mt-1">
                  ${pendingPayouts.toLocaleString()}
                </p>
                <p className="text-blue-600 text-sm mt-2">
                  {payouts.filter((p) => p.status === 'pending').length} restaurants
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MdStorefront className="text-blue-500" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          {(['overview', 'refunds', 'payouts'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-medium transition-colors relative capitalize ${
                activeTab === tab
                  ? 'text-mainGreen'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {tab === 'refunds' && refunds.filter((r) => r.status === 'pending').length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                  {refunds.filter((r) => r.status === 'pending').length}
                </span>
              )}
              {tab === 'payouts' && payouts.filter((p) => p.status === 'pending').length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {payouts.filter((p) => p.status === 'pending').length}
                </span>
              )}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mainGreen"></div>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-mainBlack mb-4">Revenue Overview</h3>
            <div className="space-y-4">
              {revenueData.map((data, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-mainBlack">{data.month}</p>
                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                      <span>Orders: ${data.orderRevenue.toLocaleString()}</span>
                      <span>Delivery: ${data.deliveryFees.toLocaleString()}</span>
                      <span>Service: ${data.serviceFees.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-mainGreen">
                      ${data.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Refunds Tab */}
        {activeTab === 'refunds' && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                />
              </div>
              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-400" />
                <select
                  value={refundFilter}
                  onChange={(e) => setRefundFilter(e.target.value as RefundFilter)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Refunds List */}
            <div ref={listRef} className="space-y-4">
              {filteredRefunds.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <FiDollarSign className="mx-auto text-gray-300" size={48} />
                  <p className="text-gray-500 mt-4">No refund requests found</p>
                </div>
              ) : (
                filteredRefunds.map((refund) => (
                  <div
                    key={refund.id}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-bold text-mainBlack">
                              Order #{refund.orderId}
                            </p>
                            <p className="text-gray-500">{refund.customerName}</p>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                              refund.status
                            )}`}
                          >
                            {refund.status}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                          <span className="font-bold text-xl text-red-500">
                            -${refund.amount.toFixed(2)}
                          </span>
                          <span className="text-gray-500">
                            Requested: {new Date(refund.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600 text-sm">
                          <span className="font-medium">Reason:</span> {refund.reason}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedRefund(refund)}
                          className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <FiEye size={20} className="text-gray-600" />
                        </button>
                        {refund.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveRefund(refund.id)}
                              disabled={actionLoading === refund.id}
                              className="p-3 bg-mainGreen text-white rounded-xl hover:bg-mainGreen/90 transition-colors disabled:opacity-50"
                            >
                              <FiCheck size={20} />
                            </button>
                            <button
                              onClick={() => handleRejectRefund(refund.id)}
                              disabled={actionLoading === refund.id}
                              className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              <FiX size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                />
              </div>
              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-400" />
                <select
                  value={payoutFilter}
                  onChange={(e) => setPayoutFilter(e.target.value as PayoutFilter)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Payouts Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                        Restaurant
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                        Period
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                        Amount
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody ref={listRef} className="divide-y divide-gray-100">
                    {filteredPayouts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12">
                          <FiDollarSign className="mx-auto text-gray-300" size={48} />
                          <p className="text-gray-500 mt-4">No payouts found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredPayouts.map((payout) => (
                        <tr
                          key={payout.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                <MdStorefront className="text-orange-500" size={20} />
                              </div>
                              <span className="font-medium">
                                {payout.restaurantName}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-500">{payout.period}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-bold text-mainGreen text-lg">
                              ${payout.amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                                payout.status
                              )}`}
                            >
                              {payout.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              {payout.status === 'pending' && (
                                <button
                                  onClick={() => handleProcessPayout(payout.id)}
                                  disabled={actionLoading === payout.id}
                                  className="px-4 py-2 bg-mainGreen text-white text-sm font-medium rounded-xl hover:bg-mainGreen/90 transition-colors disabled:opacity-50"
                                >
                                  Process
                                </button>
                              )}
                              {payout.status === 'completed' && (
                                <span className="text-gray-500 text-sm">
                                  Paid: {payout.paidAt ? new Date(payout.paidAt).toLocaleDateString() : 'N/A'}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Refund Detail Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-mainBlack">Refund Request</h2>
                <button
                  onClick={() => setSelectedRefund(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-red-500">
                  -${selectedRefund.amount.toFixed(2)}
                </p>
                <span
                  className={`inline-block mt-2 px-4 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(
                    selectedRefund.status
                  )}`}
                >
                  {selectedRefund.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Order ID</p>
                  <p className="font-medium text-mainBlack mt-1">
                    #{selectedRefund.orderId}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Customer</p>
                  <p className="font-medium text-mainBlack mt-1">
                    {selectedRefund.customerName}
                  </p>
                  <p className="text-gray-500 text-sm">{selectedRefund.customerEmail}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Reason</p>
                  <p className="font-medium text-mainBlack mt-1">
                    {selectedRefund.reason}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Requested On</p>
                  <p className="font-medium text-mainBlack mt-1">
                    {new Date(selectedRefund.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedRefund.status === 'pending' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleApproveRefund(selectedRefund.id)}
                    disabled={actionLoading === selectedRefund.id}
                    className="flex-1 py-3 bg-mainGreen text-white font-semibold rounded-xl hover:bg-mainGreen/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiCheck size={20} />
                    Approve Refund
                  </button>
                  <button
                    onClick={() => handleRejectRefund(selectedRefund.id)}
                    disabled={actionLoading === selectedRefund.id}
                    className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiX size={20} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
