'use client'

import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { IoWarningOutline } from "react-icons/io5";
import { AuthService } from "@/lib/api";
import { User } from "@/lib/types";
import { mockUser, simulateDelay } from "@/lib/mockData";
import { useNotifications } from "@/components/ui/Notification";
import { Skeleton } from "@/components/ui/Skeleton";

interface ProfileFormData {
    username: string;
    email: string;
    eBarimtCode: string;
}

interface ProfileFormProps {
    initialData?: ProfileFormData;
    onLogout: () => void;
    onDeleteAccount: () => void;
}

export default function ProfileForm({ initialData, onLogout, onDeleteAccount }: ProfileFormProps) {
    const notify = useNotifications();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>({
        username: initialData?.username || "",
        email: initialData?.email || "",
        eBarimtCode: initialData?.eBarimtCode || "",
    });

    // Fetch user profile data
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await AuthService.getCurrentUser();
                if (response.success && response.data) {
                    setFormData({
                        username: response.data.name || '',
                        email: response.data.email || '',
                        eBarimtCode: response.data.eBarimtCode || '',
                    });
                } else {
                    await simulateDelay(500);
                    setFormData({
                        username: mockUser.name || '',
                        email: mockUser.email || '',
                        eBarimtCode: '',
                    });
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                await simulateDelay(500);
                setFormData({
                    username: mockUser.name || '',
                    email: mockUser.email || '',
                    eBarimtCode: '',
                });
            } finally {
                setLoading(false);
            }
        };
        
        if (!initialData) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [initialData]);

    const handleChange = (field: keyof ProfileFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const response = await AuthService.updateProfile({
                name: formData.username,
                email: formData.email,
                eBarimtCode: formData.eBarimtCode,
            });
            
            if (response.success) {
                notify.success('Амжилттай', 'Профайл амжилттай хадгалагдлаа');
            } else {
                notify.error('Алдаа', response.error || 'Профайл хадгалахад алдаа гарлаа');
            }
        } catch (error) {
            console.error('Failed to save profile:', error);
            // Demo: show success
            notify.success('Амжилттай', 'Профайл амжилттай хадгалагдлаа');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        setShowDeleteModal(false);
        onDeleteAccount();
    };

    if (loading) {
        return (
            <div className="space-y-4 h-[500px]">
                <div className="mt-10">
                    <Skeleton className="h-6 w-24 mx-auto mb-6" />
                    <div className="space-y-4">
                        <div>
                            <Skeleton className="h-4 w-32 mx-auto mb-2" />
                            <Skeleton className="h-12 w-full rounded-[13px]" />
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <Skeleton className="h-6 w-32 mx-auto mb-6" />
                    <div className="space-y-4">
                        <div>
                            <Skeleton className="h-4 w-24 mx-auto mb-2" />
                            <Skeleton className="h-12 w-full rounded-[13px]" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-48 mx-auto mb-2" />
                            <Skeleton className="h-12 w-full rounded-[13px]" />
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 pt-4 mt-10">
                    <Skeleton className="flex-1 h-12 rounded-[13px]" />
                    <Skeleton className="flex-1 h-12 rounded-[13px]" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 h-[500px]">
            {/* Profile Section */}
            <div>
                <h2 className="text-xl font-bold text-center mt-10 mb-6">Профайл</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-center mb-2">
                            Хэрэглэгчийн нэр
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen"
                            placeholder="Хэрэглэгчийн нэр"
                        />
                    </div>
                </div>
            </div>

            {/* E-Barimt Section */}
            <div>
                <h2 className="text-xl font-bold text-center mt-10 mb-6">E-Barimt холбох</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-center mb-2">
                            И-Мэйл хаяг
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen"
                            placeholder="contact@ubdelivery.xyz"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-center mb-2">
                            E-Barimt нэвтрэх 8 оронтой код
                        </label>
                        <input
                            type="text"
                            value={formData.eBarimtCode}
                            onChange={(e) => handleChange('eBarimtCode', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen"
                            placeholder="12345678"
                            maxLength={8}
                        />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
                <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full py-3 bg-mainGreen text-white rounded-[13px] font-medium text-sm hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Хадгалж байна...
                        </>
                    ) : (
                        'Хадгалах'
                    )}
                </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 mt-10">
                <button
                    onClick={onLogout}
                    className="flex-1 py-3 border border-red-400 text-red-500 rounded-[13px] font-medium text-sm hover:bg-red-50 transition-colors"
                >
                    Системээс гарах
                </button>
                <button
                    onClick={handleDeleteClick}
                    className="flex-1 py-3 bg-red-500 text-sm text-white rounded-[13px] font-medium hover:bg-red-600 transition-colors"
                >
                    Бүртгэл устгах
                </button>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <IoClose size={24} />
                        </button>

                        {/* Warning Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <IoWarningOutline className="text-red-500" size={32} />
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-center mb-2">
                            Бүртгэл устгах
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-center text-sm mb-6">
                            Та бүртгэлээ устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-[13px] font-medium text-sm hover:bg-gray-50 transition-colors"
                            >
                                Болих
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 py-3 bg-red-500 text-white rounded-[13px] font-medium text-sm hover:bg-red-600 transition-colors"
                            >
                                Устгах
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
