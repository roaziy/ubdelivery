'use client';

import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { MdOutlinePassword } from 'react-icons/md';
import { useNotifications } from './Notification';

import { userService } from '@/lib/services';

interface PasswordChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    entityType: 'restaurant' | 'driver' | 'user';
    entityName: string;
    entityId: string;
    userId?: string; // User ID for restaurant/driver owners or direct user
}

export default function PasswordChangeModal({ isOpen, onClose, entityType, entityName, entityId, userId }: PasswordChangeModalProps) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const notifications = useNotifications();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword.length < 6) {
            notifications.error('Алдаа', 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            notifications.error('Алдаа', 'Нууц үг таарахгүй байна');
            return;
        }

        setLoading(true);
        try {
            // Determine the user ID to reset password for
            let targetUserId = userId;
            
            // If userId is not provided, use entityId (for direct user changes)
            if (!targetUserId) {
                if (entityType === 'user') {
                    targetUserId = entityId;
                } else {
                    // For restaurant/driver, userId should be passed from parent
                    // If not provided, show error
                    notifications.error('Алдаа', 'Хэрэглэгчийн ID олдсонгүй. Ресторан эсвэл жолоочийн эзэмшлийн мэдээлэл дутуу байна.');
                    setLoading(false);
                    return;
                }
            }

            const response = await userService.resetPassword(targetUserId, newPassword);
            
            if (response.success) {
            notifications.success('Амжилттай', `${entityName}-н нууц үг амжилттай солигдлоо`);
            setNewPassword('');
            setConfirmPassword('');
            onClose();
            } else {
                notifications.error('Алдаа', response.error || 'Нууц үг солиход алдаа гарлаа');
            }
        } catch (error: any) {
            console.error('Password change error:', error);
            const errorMessage = error?.error || error?.message || 'Нууц үг солиход алдаа гарлаа. Дахин оролдоно уу.';
            notifications.error('Алдаа', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-2xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-mainBlack">Нууц үг солих</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <IoClose size={20} className="text-gray-500" />
                    </button>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                    <span className="font-medium text-mainBlack">{entityName}</span>-н нууц үгийг солих
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Шинэ нууц үг</label>
                        <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 focus-within:border-mainGreen transition-colors">
                            <MdOutlinePassword className="text-gray-400 mr-3" size={18} />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Шинэ нууц үг оруулна уу"
                                className="flex-1 outline-none text-sm bg-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Нууц үг баталгаажуулах</label>
                        <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 focus-within:border-mainGreen transition-colors">
                            <MdOutlinePassword className="text-gray-400 mr-3" size={18} />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Нууц үг дахин оруулна уу"
                                className="flex-1 outline-none text-sm bg-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            Болих
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-mainGreen text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Солиж байна...' : 'Нууц үг солих'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
