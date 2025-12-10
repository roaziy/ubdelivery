'use client';

import { useState, useEffect } from 'react';
import { IoTrendingUp, IoTrendingDown } from 'react-icons/io5';
import { FiCheck, FiX, FiDollarSign } from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';
import { useNotifications } from '@/components/ui/Notification';
import { RefundRequest, Payout } from '@/types';
import { FinanceService, StatsService } from '@/lib/services';

type TabType = 'overview' | 'refunds' | 'payouts';

interface FinanceStats {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  totalRevenue: number;
}

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
  const [stats, setStats] = useState<FinanceStats>({
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const notify = useNotifications();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [refundRes, payoutRes, statsRes] = await Promise.all([
          FinanceService.getRefundRequests(),
          FinanceService.getPayouts(),
          StatsService.getPlatformStats(),
        ]);
        
        if (refundRes.success && refundRes.data) {
          const items = (refundRes.data as any).items || refundRes.data;
          setRefunds(Array.isArray(items) ? items : []);
        }
        
        if (payoutRes.success && payoutRes.data) {
          const items = (payoutRes.data as any).items || payoutRes.data;
          setPayouts(Array.isArray(items) ? items : []);
        }
        
        if (statsRes.success && statsRes.data) {
          const data = statsRes.data as any;
          setStats({
            todayRevenue: data.revenue?.today || data.todayRevenue || 0,
            weekRevenue: data.revenue?.week || data.weekRevenue || 0,
            monthRevenue: data.revenue?.month || data.monthRevenue || 0,
            totalRevenue: data.revenue?.total || data.totalRevenue || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching finance data:', error);
        setRefunds([]);
        setPayouts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRefundAction = async (id: string, action: 'approve' | 'reject', orderId: string) => {
    try {
      if (action === 'approve') {
        await FinanceService.approveRefund(id);
        setRefunds((prev) => prev.map((r) => r.id === id ? { ...r, status: 'approved' as const } : r));
        notify.success('Зөвшөөрсөн', `Захиалга #${orderId}-н буцаалт зөвшөөрөгдлөө`);
      } else {
        await FinanceService.rejectRefund(id, 'Rejected by admin');
        setRefunds((prev) => prev.map((r) => r.id === id ? { ...r, status: 'rejected' as const } : r));
        notify.warning('Татгалзсан', `Захиалга #${orderId}-н буцаалт татгалзагдлаа`);
      }
    } catch (error) {
      console.error('Refund action error:', error);
      notify.error('Алдаа', 'Үйлдэл гүйцэтгэхэд алдаа гарлаа');
    }
  };

  const handleProcessPayout = async (id: string, restaurantName: string) => {
    try {
      await FinanceService.processPayout(id);
      setPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: 'completed' as const } : p));
      notify.success('Шилжүүлэгдлээ', `${restaurantName}-д төлбөр амжилттай шилжүүлэгдлээ`);
    } catch (error) {
      console.error('Payout error:', error);
      notify.error('Алдаа', 'Төлбөр шилжүүлэхэд алдаа гарлаа');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': case 'completed': return 'text-mainGreen';
      case 'rejected': case 'failed': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Зөвшөөрсөн';
      case 'completed': return 'Дууссан';
      case 'rejected': return 'Татгалзсан';
      case 'failed': return 'Амжилтгүй';
      default: return 'Хүлээгдэж буй';
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
        <h1 className="text-2xl font-bold text-mainBlack mb-6">Санхүү</h1>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-6">
          {(['overview', 'refunds', 'payouts'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-mainGreen text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab === 'overview' ? 'Тойм' : tab === 'refunds' ? 'Буцаалт' : 'Төлбөр'}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Өнөөдрийн орлого" value={`₮${stats.todayRevenue.toLocaleString()}`} change={8.2} />
              <StatCard title="Энэ долоо хоног" value={`₮${stats.weekRevenue.toLocaleString()}`} change={12.5} />
              <StatCard title="Энэ сар" value={`₮${stats.monthRevenue.toLocaleString()}`} change={5.1} />
              <StatCard title="Нийт орлого" value={`₮${stats.totalRevenue.toLocaleString()}`} change={15.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-mainBlack mb-4">Хүлээгдэж буй буцаалт ({refunds.filter(r => r.status === 'pending').length})</h3>
                <div className="space-y-3">
                  {refunds.filter(r => r.status === 'pending').length === 0 ? (
                    <p className="text-gray-400 text-center py-4">Хүлээгдэж буй буцаалт байхгүй</p>
                  ) : (
                    refunds.filter(r => r.status === 'pending').slice(0, 3).map((refund: any) => (
                      <div key={refund.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-sm">Захиалга #{refund.orderId || refund.order_id}</p>
                          <p className="text-gray-400 text-xs">₮{(refund.amount ?? 0).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleRefundAction(refund.id, 'approve', refund.orderId || refund.order_id)} className="p-2 bg-mainGreen text-white rounded-full"><FiCheck size={14} /></button>
                          <button onClick={() => handleRefundAction(refund.id, 'reject', refund.orderId || refund.order_id)} className="p-2 bg-red-500 text-white rounded-full"><FiX size={14} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-mainBlack mb-4">Хүлээгдэж буй төлбөр ({payouts.filter(p => p.status === 'pending').length})</h3>
                <div className="space-y-3">
                  {payouts.filter(p => p.status === 'pending').length === 0 ? (
                    <p className="text-gray-400 text-center py-4">Хүлээгдэж буй төлбөр байхгүй</p>
                  ) : (
                    payouts.filter(p => p.status === 'pending').slice(0, 3).map((payout: any) => (
                      <div key={payout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-sm">{payout.restaurantName || payout.restaurant_name || '-'}</p>
                          <p className="text-gray-400 text-xs">₮{(payout.amount ?? 0).toLocaleString()}</p>
                        </div>
                        <button onClick={() => handleProcessPayout(payout.id, payout.restaurantName || payout.restaurant_name || 'Ресторан')} className="px-4 py-2 bg-mainGreen text-white text-xs rounded-full">Шилжүүлэх</button>
                      </div>
                    ))
                  )}
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
                  <th className="text-left py-3 px-4 font-medium">Захиалгын ID</th>
                  <th className="text-left py-3 px-4 font-medium">Хэрэглэгч</th>
                  <th className="text-left py-3 px-4 font-medium">Дүн</th>
                  <th className="text-left py-3 px-4 font-medium">Шалтгаан</th>
                  <th className="text-left py-3 px-4 font-medium">Төлөв</th>
                  <th className="text-left py-3 px-4 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {refunds.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">Буцаалт олдсонгүй</td>
                  </tr>
                ) : (
                  refunds.map((refund: any) => (
                    <tr key={refund.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-4 text-sm font-medium">#{refund.orderId || refund.order_id}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{refund.customerName || refund.customer_name || '-'}</td>
                      <td className="py-3 px-4 text-sm font-medium">₮{(refund.amount ?? 0).toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{refund.reason || '-'}</td>
                      <td className="py-3 px-4"><span className={`text-sm ${getStatusColor(refund.status)}`}>{getStatusLabel(refund.status)}</span></td>
                      <td className="py-3 px-4">
                        {refund.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleRefundAction(refund.id, 'approve', refund.orderId || refund.order_id)} className="p-2 bg-mainGreen text-white rounded-full"><FiCheck size={14} /></button>
                            <button onClick={() => handleRefundAction(refund.id, 'reject', refund.orderId || refund.order_id)} className="p-2 bg-red-500 text-white rounded-full"><FiX size={14} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="text-left py-3 px-4 font-medium">Ресторан</th>
                  <th className="text-left py-3 px-4 font-medium">Хугацаа</th>
                  <th className="text-left py-3 px-4 font-medium">Дүн</th>
                  <th className="text-left py-3 px-4 font-medium">Төлөв</th>
                  <th className="text-left py-3 px-4 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">Төлбөр олдсонгүй</td>
                  </tr>
                ) : (
                  payouts.map((payout: any) => (
                    <tr key={payout.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-4 text-sm font-medium">{payout.restaurantName || payout.restaurant_name || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{payout.period || '-'}</td>
                      <td className="py-3 px-4 text-sm font-medium">₮{(payout.amount ?? 0).toLocaleString()}</td>
                      <td className="py-3 px-4"><span className={`text-sm ${getStatusColor(payout.status)}`}>{getStatusLabel(payout.status)}</span></td>
                      <td className="py-3 px-4">
                        {payout.status === 'pending' && (
                          <button onClick={() => handleProcessPayout(payout.id, payout.restaurantName || payout.restaurant_name || 'Ресторан')} className="px-4 py-2 bg-mainGreen text-white text-xs rounded-full">Шилжүүлэх</button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
