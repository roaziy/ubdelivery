'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DriverLayout from '@/components/layout/DriverLayout';
import { IoWallet, IoTrendingUp, IoCalendar, IoCheckmarkCircle, IoTime, IoArrowForward, IoClose, IoCard } from 'react-icons/io5';
import { mockEarningsSummary, mockDailyEarnings, mockPayoutHistory, formatCurrency, mockDriver } from '@/lib/mockData';
import { useNotifications } from '@/components/ui/Notification';

type EarningsTab = 'summary' | 'daily' | 'payouts';

const banks = [
    { id: 'khan', name: 'Хаан банк', logo: '🏦' },
    { id: 'golomt', name: 'Голомт банк', logo: '🏦' },
    { id: 'tdb', name: 'Худалдаа хөгжлийн банк', logo: '🏦' },
    { id: 'state', name: 'Төрийн банк', logo: '🏦' },
    { id: 'xac', name: 'Хас банк', logo: '🏦' },
];

export default function EarningsPage() {
    const router = useRouter();
    const notify = useNotifications();
    const [activeTab, setActiveTab] = useState<EarningsTab>('summary');
    const [summary] = useState(mockEarningsSummary);
    const [dailyEarnings] = useState(mockDailyEarnings);
    const [payoutHistory] = useState(mockPayoutHistory);
    
    // Withdraw modal state
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [withdrawStep, setWithdrawStep] = useState<'amount' | 'bank' | 'confirm' | 'success'>('amount');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [selectedBank, setSelectedBank] = useState(mockDriver.bankInfo?.bankId || '');
    const [accountNumber, setAccountNumber] = useState(mockDriver.bankInfo?.accountNumber || '');
    const [accountHolder, setAccountHolder] = useState(mockDriver.bankInfo?.accountHolder || mockDriver.name);
    const [isProcessing, setIsProcessing] = useState(false);

    const maxWithdrawAmount = summary.pendingPayout;
    const selectedBankInfo = banks.find(b => b.id === selectedBank);

    const handleOpenWithdraw = () => {
        setWithdrawStep('amount');
        setWithdrawAmount('');
        setIsWithdrawModalOpen(true);
    };

    const handleWithdrawAmountNext = () => {
        const amount = parseInt(withdrawAmount.replace(/,/g, ''));
        if (!amount || amount < 1000) {
            notify.warning('Анхааруулга', 'Хамгийн багадаа ₮1,000 татах боломжтой');
            return;
        }
        if (amount > maxWithdrawAmount) {
            notify.warning('Анхааруулга', `Хамгийн ихдээ ${formatCurrency(maxWithdrawAmount)} татах боломжтой`);
            return;
        }
        setWithdrawStep('bank');
    };

    const handleBankNext = () => {
        if (!selectedBank) {
            notify.warning('Анхааруулга', 'Банк сонгоно уу');
            return;
        }
        if (!accountNumber || accountNumber.length < 8) {
            notify.warning('Анхааруулга', 'Дансны дугаар оруулна уу');
            return;
        }
        if (!accountHolder) {
            notify.warning('Анхааруулга', 'Данс эзэмшигчийн нэр оруулна уу');
            return;
        }
        setWithdrawStep('confirm');
    };

    const handleConfirmWithdraw = async () => {
        setIsProcessing(true);
        try {
            // TODO: API call to process withdrawal
            await new Promise(resolve => setTimeout(resolve, 2000));
            setWithdrawStep('success');
        } catch (error) {
            notify.error('Алдаа', 'Шилжүүлэг хийхэд алдаа гарлаа');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCloseModal = () => {
        setIsWithdrawModalOpen(false);
        setWithdrawStep('amount');
    };

    const formatAmountInput = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleRequestPayout = () => {
        handleOpenWithdraw();
    };

    const handleChangeBank = () => {
        router.push('/bank-account');
    };

    const tabs = [
        { id: 'summary', label: 'Нийт', icon: IoWallet },
        { id: 'daily', label: 'Өдөр бүр', icon: IoCalendar },
        { id: 'payouts', label: 'Шилжүүлэг', icon: IoArrowForward },
    ];

    const getPayoutStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Дууссан</span>;
            case 'pending':
                return <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">Хүлээгдэж байна</span>;
            case 'processing':
                return <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Боловсруулж байна</span>;
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('mn-MN', { month: 'short', day: 'numeric' });
    };

    const getDayName = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['Ням', 'Дав', 'Мяг', 'Лха', 'Пүр', 'Баа', 'Бям'];
        return days[date.getDay()];
    };

    return (
        <DriverLayout>
            <h1 className="text-xl font-bold mb-4">Орлого</h1>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as EarningsTab)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-mainGreen text-white'
                                    : 'bg-white text-gray-600 border border-gray-200'
                            }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Summary Tab */}
            {activeTab === 'summary' && (
                <div className="space-y-4">
                    {/* Main Balance */}
                    <div className="bg-gradient-to-r from-mainGreen to-green-400 rounded-2xl p-6 text-white">
                        <p className="text-green-100 text-sm mb-1">Энэ сарын орлого</p>
                        <p className="text-3xl font-bold">{formatCurrency(summary.thisMonth)}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-gray-500 text-xs mb-1">Өнөөдөр</p>
                            <p className="text-xl font-bold">{formatCurrency(summary.today)}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-gray-500 text-xs mb-1">Энэ долоо хоног</p>
                            <p className="text-xl font-bold">{formatCurrency(summary.thisWeek)}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-gray-500 text-xs mb-1">Нийт хүргэлт</p>
                            <p className="text-xl font-bold">{summary.totalDeliveries}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-gray-500 text-xs mb-1">Дундаж/хүргэлт</p>
                            <p className="text-xl font-bold">{formatCurrency(summary.averagePerDelivery)}</p>
                        </div>
                    </div>

                    {/* Pending Payout */}
                    <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Татаж авах боломжтой</p>
                                <p className="text-2xl font-bold text-mainGreen">{formatCurrency(summary.pendingPayout)}</p>
                            </div>
                            <button 
                                onClick={handleRequestPayout}
                                className="px-4 py-2 bg-mainGreen text-white rounded-full text-sm font-medium hover:bg-green-600"
                            >
                                Мөнгөө авах
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Daily Tab */}
            {activeTab === 'daily' && (
                <div className="space-y-3">
                    {dailyEarnings.map((day, index) => (
                        <div key={day.date} className="bg-white rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        index === 0 ? 'bg-mainGreen text-white' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        <span className="text-xs font-medium">{getDayName(day.date)}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{formatDate(day.date)}</p>
                                        <p className="text-xs text-gray-400">{day.deliveries} хүргэлт</p>
                                    </div>
                                </div>
                                <p className="text-lg font-bold">{formatCurrency(day.total)}</p>
                            </div>

                            {/* Breakdown */}
                            <div className="flex gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                                <span>Орлого: {formatCurrency(day.earnings)}</span>
                                {day.tips > 0 && <span className="text-blue-500">Tip: {formatCurrency(day.tips)}</span>}
                                {day.bonuses > 0 && <span className="text-orange-500">Бонус: {formatCurrency(day.bonuses)}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Payouts Tab */}
            {activeTab === 'payouts' && (
                <div className="space-y-4">
                    {/* Bank Info */}
                    <div className="bg-white rounded-xl p-4">
                        <p className="text-gray-500 text-sm mb-2">Холбогдсон данс</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Хаан банк</p>
                                <p className="text-sm text-gray-400">****5678</p>
                            </div>
                            <button 
                                onClick={handleChangeBank}
                                className="text-mainGreen text-sm font-medium hover:underline"
                            >
                                Өөрчлөх
                            </button>
                        </div>
                    </div>

                    {/* Payout History */}
                    <h3 className="font-semibold">Шилжүүлгийн түүх</h3>
                    <div className="space-y-3">
                        {payoutHistory.map(payout => (
                            <div key={payout.id} className="bg-white rounded-xl p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-bold">{formatCurrency(payout.amount)}</p>
                                        <p className="text-xs text-gray-400">
                                            {formatDate(payout.requestedAt)}
                                        </p>
                                    </div>
                                    {getPayoutStatusBadge(payout.status)}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {payout.bankName} • {payout.accountNumber}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Withdraw Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
                    <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold">
                                {withdrawStep === 'amount' && 'Мөнгөө авах'}
                                {withdrawStep === 'bank' && 'Банкны мэдээлэл'}
                                {withdrawStep === 'confirm' && 'Баталгаажуулах'}
                                {withdrawStep === 'success' && 'Амжилттай'}
                            </h2>
                            <button 
                                onClick={handleCloseModal}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                            >
                                <IoClose size={24} />
                            </button>
                        </div>

                        {/* Step 1: Amount */}
                        {withdrawStep === 'amount' && (
                            <div className="p-4">
                                <div className="text-center mb-6">
                                    <p className="text-sm text-gray-500 mb-1">Татаж авах боломжтой</p>
                                    <p className="text-2xl font-bold text-mainGreen">{formatCurrency(maxWithdrawAmount)}</p>
                                </div>

                                <div className="mb-6">
                                    <label className="text-sm text-gray-500 mb-2 block">Татах дүн</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₮</span>
                                        <input
                                            type="text"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(formatAmountInput(e.target.value))}
                                            placeholder="0"
                                            className="w-full pl-8 pr-4 py-4 text-2xl font-bold text-center border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                                        />
                                    </div>
                                </div>

                                {/* Quick amounts */}
                                <div className="grid grid-cols-3 gap-2 mb-6">
                                    {[50000, 100000, 200000].map(amount => (
                                        <button
                                            key={amount}
                                            onClick={() => setWithdrawAmount(formatAmountInput(amount.toString()))}
                                            disabled={amount > maxWithdrawAmount}
                                            className="py-2 px-3 text-sm border border-gray-200 rounded-lg hover:border-mainGreen disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {formatCurrency(amount)}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setWithdrawAmount(formatAmountInput(maxWithdrawAmount.toString()))}
                                    className="w-full py-2 mb-4 text-mainGreen text-sm font-medium hover:underline"
                                >
                                    Бүгдийг татах
                                </button>

                                <button
                                    onClick={handleWithdrawAmountNext}
                                    disabled={!withdrawAmount}
                                    className="w-full py-3 bg-mainGreen text-white rounded-xl font-medium disabled:opacity-50"
                                >
                                    Үргэлжлүүлэх
                                </button>
                            </div>
                        )}

                        {/* Step 2: Bank Info */}
                        {withdrawStep === 'bank' && (
                            <div className="p-4">
                                <p className="text-sm text-gray-500 mb-4">Шилжүүлэг хийх дансаа сонгоно уу</p>

                                {/* Bank Selection */}
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {banks.map(bank => (
                                        <button
                                            key={bank.id}
                                            onClick={() => setSelectedBank(bank.id)}
                                            className={`p-3 rounded-xl border-2 text-left transition-colors ${
                                                selectedBank === bank.id 
                                                    ? 'border-mainGreen bg-green-50' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <span className="text-lg mb-1 block">{bank.logo}</span>
                                            <span className="text-xs font-medium">{bank.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Account Details */}
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Дансны дугаар</label>
                                        <input
                                            type="text"
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                                            placeholder="1234567890"
                                            maxLength={16}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Данс эзэмшигчийн нэр</label>
                                        <input
                                            type="text"
                                            value={accountHolder}
                                            onChange={(e) => setAccountHolder(e.target.value)}
                                            placeholder="Нэр"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setWithdrawStep('amount')}
                                        className="flex-1 py-3 border border-gray-200 rounded-xl font-medium"
                                    >
                                        Буцах
                                    </button>
                                    <button
                                        onClick={handleBankNext}
                                        className="flex-1 py-3 bg-mainGreen text-white rounded-xl font-medium"
                                    >
                                        Үргэлжлүүлэх
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Confirm */}
                        {withdrawStep === 'confirm' && (
                            <div className="p-4">
                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <div className="text-center mb-4">
                                        <p className="text-sm text-gray-500">Татах дүн</p>
                                        <p className="text-3xl font-bold text-mainGreen">₮{withdrawAmount}</p>
                                    </div>
                                    
                                    <div className="border-t border-gray-200 pt-4 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Банк</span>
                                            <span className="font-medium">{selectedBankInfo?.name}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Дансны дугаар</span>
                                            <span className="font-mono font-medium">{accountNumber}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Данс эзэмшигч</span>
                                            <span className="font-medium">{accountHolder}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 rounded-xl p-3 mb-6">
                                    <p className="text-xs text-yellow-700">
                                        ⚠️ Дансны мэдээлэл буруу байвал шилжүүлэг амжилтгүй болно. Мэдээллээ сайн шалгана уу.
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setWithdrawStep('bank')}
                                        disabled={isProcessing}
                                        className="flex-1 py-3 border border-gray-200 rounded-xl font-medium disabled:opacity-50"
                                    >
                                        Буцах
                                    </button>
                                    <button
                                        onClick={handleConfirmWithdraw}
                                        disabled={isProcessing}
                                        className="flex-1 py-3 bg-mainGreen text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Боловсруулж байна...
                                            </>
                                        ) : (
                                            'Баталгаажуулах'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Success */}
                        {withdrawStep === 'success' && (
                            <div className="p-4 text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <IoCheckmarkCircle className="text-mainGreen" size={48} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Хүсэлт илгээгдлээ!</h3>
                                <p className="text-gray-500 mb-2">₮{withdrawAmount}</p>
                                <p className="text-sm text-gray-400 mb-6">
                                    Шилжүүлэг 1-2 ажлын өдөрт таны дансанд орно.
                                </p>

                                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <IoCard className="text-blue-500" size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{selectedBankInfo?.name}</p>
                                            <p className="text-xs text-gray-400">{accountNumber}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCloseModal}
                                    className="w-full py-3 bg-mainGreen text-white rounded-xl font-medium"
                                >
                                    Дуусгах
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </DriverLayout>
    );
}
