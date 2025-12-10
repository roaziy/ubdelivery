'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineEmail, MdOutlinePassword } from "react-icons/md";
import { useNotifications } from "@/components/ui/Notification";
import { authService } from "@/lib/services";

export default function Home() {
    const router = useRouter();
    const notify = useNotifications();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            notify.warning('Анхааруулга', 'Нэвтрэх нэр болон нууц үг оруулна уу');
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await authService.login({
                email: formData.email,
                password: formData.password
            });

            if (response.success && response.data) {
                // Store the token
                sessionStorage.setItem('admin_token', response.data.token);
                sessionStorage.setItem('admin_user', JSON.stringify(response.data.user));
                sessionStorage.setItem('adminAuthenticated', 'true');
                
                notify.success('Амжилттай нэвтэрлээ', `Тавтай морил, ${response.data.user.name || 'Админ'}!`);
                router.push('/dashboard');
            } else {
                notify.error('Нэвтрэх амжилтгүй', response.error || 'Имэйл эсвэл нууц үг буруу байна');
            }
        } catch (error) {
            console.error('Login error:', error);
            notify.error('Алдаа гарлаа', 'Сервертэй холбогдоход алдаа гарлаа');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                       <img src="/logoSmall.svg" alt="UB Delivery" className="w-16 h-16" />
                    </div>
                    <h2 className="text-xl font-bold text-mainBlack">UB Delivery</h2>
                    <p className="text-gray-400 text-sm">Super Admin Portal</p>
                </div>

                {/* Title */}
                <h1 className="text-xl font-bold mb-8 select-none">Нэвтрэх</h1>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="w-full max-w-[400px] mx-auto px-6">
                    {/* Email Input */}
                    <div className="mb-4">
                        <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 focus-within:border-mainGreen transition-colors">
                            <MdOutlineEmail className="text-gray-400 mr-3 select-none" size={18} />
                            <input
                                type="text"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="Имэйл хаяг"
                                className="flex-1 outline-none text-sm bg-transparent"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 focus-within:border-mainGreen transition-colors">
                            <MdOutlinePassword className="text-gray-400 mr-3 select-none" size={18} />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                placeholder="Нууц үг"
                                className="flex-1 outline-none text-sm bg-transparent"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-mainGreen text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {isLoading ? "Нэвтэрч байна..." : "Нэвтрэх"}
                    </button>

                    {/* Info */}
                    <p className="text-center text-gray-400 text-xs mt-4">
                        Суперадмин эрхээр нэвтэрнэ үү
                    </p>
                    <p className="text-center text-gray-400 text-xs mt-1">
                        © 2025 UB Delivery. Бүх эрх хуулиар хамгаалагдсан.
                    </p>
                </form>
            </main>
        </div>
    );
}
