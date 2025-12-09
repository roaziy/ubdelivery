'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DriverLayout from '@/components/layout/DriverLayout';
import { IoArrowBack, IoCard } from 'react-icons/io5';
import { mockDriver } from '@/lib/mockData';
import { useNotifications } from '@/components/ui/Notification';

const banks = [
    { id: 'khan', name: 'Хаан банк', logo: '🏦' },
    { id: 'golomt', name: 'Голомт банк', logo: '🏦' },
    { id: 'tdb', name: 'Худалдаа хөгжлийн банк', logo: '🏦' },
    { id: 'state', name: 'Төрийн банк', logo: '🏦' },
    { id: 'xac', name: 'Хас банк', logo: '🏦' },
];

export default function BankAccountPage() {
    const router = useRouter();
    const notify = useNotifications();
    const [bankInfo, setBankInfo] = useState({
        bankId: mockDriver.bankInfo?.bankId || '',
        accountNumber: mockDriver.bankInfo?.accountNumber || '',
        accountHolder: mockDriver.bankInfo?.accountHolder || mockDriver.name,
    });
    const [isEditing, setIsEditing] = useState(!mockDriver.bankInfo?.bankId);

    const selectedBank = banks.find(b => b.id === bankInfo.bankId);

    const handleSave = () => {
        if (!bankInfo.bankId) {
            notify.warning('Анхааруулга', 'Банк сонгоно уу');
            return;
        }
        if (!bankInfo.accountNumber) {
            notify.warning('Анхааруулга', 'Дансны дугаар оруулна уу');
            return;
        }
        if (!bankInfo.accountHolder) {
            notify.warning('Анхааруулга', 'Данс эзэмшигчийн нэр оруулна уу');
            return;
        }
        // TODO: API call to save bank info
        notify.success('Амжилттай', 'Дансны мэдээлэл хадгалагдлаа');
        setIsEditing(false);
    };

    return (
        <DriverLayout hideNav>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button 
                    onClick={() => router.back()}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
                >
                    <IoArrowBack size={20} />
                </button>
                <h1 className="text-xl font-bold">Дансны мэдээлэл</h1>
            </div>

            {/* Current Bank Info */}
            {!isEditing && selectedBank && (
                <div className="bg-white rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                            {selectedBank.logo}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{selectedBank.name}</p>
                            <p className="text-sm text-gray-500">Үндсэн данс</p>
                        </div>
                        <IoCard className="text-mainGreen" size={24} />
                    </div>
                    
                    <div className="space-y-3 border-t border-gray-100 pt-4">
                        <div>
                            <p className="text-xs text-gray-400">Дансны дугаар</p>
                            <p className="font-mono font-medium">{bankInfo.accountNumber}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Данс эзэмшигч</p>
                            <p className="font-medium">{bankInfo.accountHolder}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full mt-4 py-3 border border-mainGreen text-mainGreen rounded-xl font-medium hover:bg-green-50"
                    >
                        Өөрчлөх
                    </button>
                </div>
            )}

            {/* Edit Form */}
            {isEditing && (
                <div className="bg-white rounded-2xl p-4">
                    <h3 className="font-semibold mb-4">Банк сонгох</h3>
                    
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {banks.map(bank => (
                            <button
                                key={bank.id}
                                onClick={() => setBankInfo({ ...bankInfo, bankId: bank.id })}
                                className={`p-3 rounded-xl border-2 text-left transition-colors ${
                                    bankInfo.bankId === bank.id 
                                        ? 'border-mainGreen bg-green-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <span className="text-xl mb-1 block">{bank.logo}</span>
                                <span className="text-sm font-medium">{bank.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">Дансны дугаар</label>
                            <input
                                type="text"
                                value={bankInfo.accountNumber}
                                onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                                placeholder="1234567890"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">Данс эзэмшигчийн нэр</label>
                            <input
                                type="text"
                                value={bankInfo.accountHolder}
                                onChange={(e) => setBankInfo({ ...bankInfo, accountHolder: e.target.value })}
                                placeholder="Нэр"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mainGreen"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                        {selectedBank && (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium"
                            >
                                Болих
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={!bankInfo.bankId || !bankInfo.accountNumber || !bankInfo.accountHolder}
                            className="flex-1 py-3 bg-mainGreen text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Хадгалах
                        </button>
                    </div>
                </div>
            )}

            {/* Info Note */}
            <div className="mt-4 p-4 bg-yellow-50 rounded-xl">
                <p className="text-sm text-yellow-700">
                    ⚠️ Дансны мэдээлэл зөвхөн орлого шилжүүлэхэд ашиглагдана. 
                    Мэдээлэл буруу оруулсан тохиолдолд шилжүүлэг амжилтгүй болно.
                </p>
            </div>
        </DriverLayout>
    );
}
