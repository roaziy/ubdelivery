'use client';

import { useState, useEffect } from 'react';
import { IoTrendingUp, IoTrendingDown } from 'react-icons/io5';
import { FiCheck, FiX, FiDollarSign } from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';
import { RefundRequest, Payout } from '@/types';
import { FinanceService } from '@/lib/services';
import { mockRefundRequests, mockPayouts, mockPlatformStats } from '@/lib/mockData';

type TabType = 'overview' | 'refunds' | 'payouts';

function StatCard({ title, value, change }: { title: string; value: string; change: number }) {
  const isPositive = change >= 0;
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className="text-3xl font-bold text-mainBlack">{value}</p>
      <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-mainGreen' : 'text-red-500'}`}>
        {isPositive ? <IoTrendingUp size={16} /> : <IoTrendingDown size={16} />}
        <span>{isPositive ? '+' : ''}{change}%</span>
      </div>
    </div>
  );
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [refundRes, payoutRes] = await Promise.all([
          FinanceService.getRefundRequests(),
          FinanceService.getPayouts(),
        ]);
        if (refundRes.success) setRefunds(refundRes.data!);
        if (payoutRes.success) setPayouts(payoutRes.data!);
      } catch {
        setRefunds(mockRefundRequests);
        setPayouts(mockPayouts);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRefundAction = async (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      await FinanceService.approveRefund(id);
      setRefunds((prev) => prev.map((r) => r.id === id ? { ...r, status: 'approved' as const } : r));
    } else {
      await FinanceService.rejectRefund(id, 'Rejected by admin');
      setRefunds((prev) => prev.map((r) => r.id === id ? { ...r, status: 'rejected' as const } : r));
    }
  };

  const handleProcessPayout = async (id: string) => {
    await FinanceService.processPayout(id);
    setPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: 'completed' as const } : p));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': case 'completed': return 'text-mainGreen';
      case 'rejected': case 'failed': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-mainGreen border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-mainBlack mb-6">Finance</h1>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-6">
          {(['overview', 'refunds', 'payouts'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-mainGreen text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Today's Revenue" value={`$${mockPlatformStats.today.revenue.toLocaleString()}`} change={8.2} />
              <StatCard title="This Week" value={`$${mockPlatformStats.week.revenue.toLocaleString()}`} change={12.5} />
              <StatCard title="This Month" value={`$${mockPlatformStats.month.revenue.toLocaleString()}`} change={5.1} />
              <StatCard title="Total Revenue" value={`$${(mockPlatformStats.today.revenue + mockPlatformStats.week.revenue + mockPlatformStats.month.revenue).toLocaleString()}`} change={15.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-mainBlack mb-4">Pending Refunds ({refunds.filter(r => r.status === 'pending').length})</h3>
                <div className="space-y-3">
                  {refunds.filter(r => r.status === 'pending').slice(0, 3).map((refund) => (
                    <div key={refund.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-sm">Order #{refund.orderId}</p>
                        <p className="text-gray-400 text-xs">${refund.amount}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleRefundAction(refund.id, 'approve')} className="p-2 bg-mainGreen text-white rounded-full"><FiCheck size={14} /></button>
                        <button onClick={() => handleRefundAction(refund.id, 'reject')} className="p-2 bg-red-500 text-white rounded-full"><FiX size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-mainBlack mb-4">Pending Payouts ({payouts.filter(p => p.status === 'pending').length})</h3>
                <div className="space-y-3">
                  {payouts.filter(p => p.status === 'pending').slice(0, 3).map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-sm">{payout.restaurantName}</p>
                        <p className="text-gray-400 text-xs">${payout.amount}</p>
                      </div>
                      <button onClick={() => handleProcessPayout(payout.id)} className="px-4 py-2 bg-mainGreen text-white text-xs rounded-full">Process</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'refunds' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="text-left py-3 px-4 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Reason</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((refund) => (
                  <tr key={refund.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 px-4 text-sm font-medium">#{refund.orderId}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{refund.customerName}</td>
                    <td className="py-3 px-4 text-sm font-medium">${refund.amount}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{refund.reason}</td>
                    <td className="py-3 px-4"><span className={`text-sm capitalize ${getStatusColor(refund.status)}`}>{refund.status}</span></td>
                    <td className="py-3 px-4">
                      {refund.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleRefundAction(refund.id, 'approve')} className="p-2 bg-mainGreen text-white rounded-full"><FiCheck size={14} /></button>
                          <button onClick={() => handleRefundAction(refund.id, 'reject')} className="p-2 bg-red-500 text-white rounded-full"><FiX size={14} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="text-left py-3 px-4 font-medium">Restaurant</th>
                  <th className="text-left py-3 px-4 font-medium">Period</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 px-4 text-sm font-medium">{payout.restaurantName}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{payout.period}</td>
                    <td className="py-3 px-4 text-sm font-medium">${payout.amount}</td>
                    <td className="py-3 px-4"><span className={`text-sm capitalize ${getStatusColor(payout.status)}`}>{payout.status}</span></td>
                    <td className="py-3 px-4">
                      {payout.status === 'pending' && (
                        <button onClick={() => handleProcessPayout(payout.id)} className="px-4 py-2 bg-mainGreen text-white text-xs rounded-full">Process</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
