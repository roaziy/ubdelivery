'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdOutlinePhone, MdOutlinePassword } from "react-icons/md";
import { useNotifications } from "@/components/ui/Notification";
import { authService } from "@/lib/services";

export default function LoginForm() {
    const router = useRouter();
    const notifications = useNotifications();
    const [formData, setFormData] = useState({
        phone: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Phone validation helper
    const isValidPhone = (phone: string) => {
        const phoneRegex = /^[0-9]{8}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.phone && !formData.password) {
            notifications.warning("Талбарууд хоосон байна", "Утас болон нууц үгээ оруулна уу");
            return;
        }

        if (!formData.phone) {
            notifications.warning("Утасны дугаар оруулна уу", "Байгууллагын утасны дугаараа оруулна уу");
            return;
        }

        if (!isValidPhone(formData.phone)) {
            notifications.error("Утасны дугаар буруу байна", "8 оронтой утасны дугаар оруулна уу");
            return;
        }

        if (!formData.password) {
            notifications.warning("Нууц үг оруулна уу", "Нууц үгээ оруулна уу");
            return;
        }

        if (formData.password.length < 6) {
            notifications.error("Нууц үг богино байна", "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой");
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await authService.login({
                phone: formData.phone,
                password: formData.password
            });

            if (response.success && response.data) {
                sessionStorage.setItem('auth_token', response.data.token);
                sessionStorage.setItem('adminLoggedIn', 'true');
                
                if (response.data.restaurant) {
                    sessionStorage.setItem('restaurant', JSON.stringify(response.data.restaurant));
                    sessionStorage.setItem('setupCompleted', 'true');
                }
                
                notifications.success("Амжилттай нэвтэрлээ", "Тавтай морилно у|!");
                
                setTimeout(() => {
                    if (response.data?.restaurant) {
                        router.push('/dashboard');
                    } else {
                        router.push('/setup');
                    }
                }, 500);
            } else {
                notifications.error("Нэвтрэх амжилтгүй", response.error || "Утас эсвэл нууц үг буруу байна");
            }
        } catch {
            notifications.error("Алдаа гарлаа", "Сервертэй холбогдоход алдаа гарлаа");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-[400px] mx-auto px-6">
            {/* Phone Input */}
            <div className="mb-4">
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 focus-within:border-mainGreen transition-colors">
                    <MdOutlinePhone className="text-gray-400 mr-3 select-none" size={18} />
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="Утасны дугаар"
                        className="flex-1 outline-none text-sm bg-transparent select-none"
                        draggable={false}
                        maxLength={8}
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
                        className="flex-1 outline-none text-sm bg-transparent select-none"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                draggable={false}
                className="w-full bg-mainGreen text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors disabled:opacity-70 select-none flex items-center justify-center gap-2"
            >
                {isLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isLoading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </button>
        </form>
    );
}
