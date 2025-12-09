'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlinePassword } from "react-icons/md";
import { useNotifications } from "@/components/ui/Notification";

export default function LoginForm() {
    const router = useRouter();
    const notifications = useNotifications();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Email validation helper
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation checks with custom notifications
        if (!formData.email && !formData.password) {
            notifications.warning("Талбарууд хоосон байна", "И-мэйл болон нууц үгээ оруулна уу");
            return;
        }

        if (!formData.email) {
            notifications.warning("И-мэйл хаяг оруулна уу", "Байгууллагын и-мэйл хаягаа оруулна уу");
            return;
        }

        if (!isValidEmail(formData.email)) {
            notifications.error("И-мэйл хаяг буруу байна", "Зөв и-мэйл хаяг оруулна уу. Жишээ: example@company.mn");
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
        
        // Simulate login - replace with actual API call
        setTimeout(() => {
            // Store login state
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminEmail', formData.email);
            
            // Show success notification
            notifications.success("Амжилттай нэвтэрлээ", "Тавтай морилно уу!");
            
            // Check if setup is already completed
            // In real app, this would come from API response
            const setupCompleted = sessionStorage.getItem('setupCompleted');
            
            setTimeout(() => {
                if (setupCompleted) {
                    // Setup already done, go to dashboard
                    router.push('/dashboard');
                } else {
                    // First time login, go to setup
                    router.push('/setup');
                }
            }, 500);
            
            setIsLoading(false);
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-[400px] mx-auto px-6">
            {/* Email Input */}
            <div className="mb-4">
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 focus-within:border-mainGreen transition-colors">
                    <MdOutlineEmail className="text-gray-400 mr-3 select-none" size={18} />
                    <input
                        type="text"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="Байгууллагын email хаяг"
                        className="flex-1 outline-none text-sm bg-transparent select-none"
                        draggable={false}
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
                className="w-full bg-mainGreen text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors disabled:opacity-70 select-none"
            >
                {isLoading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </button>
        </form>
    );
}
