'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlinePassword } from "react-icons/md";



export default function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            setError("Бүх талбарыг бөглөнө үү");
            return;
        }

        setIsLoading(true);
        
        // Simulate login - replace with actual API call
        setTimeout(() => {
            // Store login state
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminEmail', formData.email);
            
            // Navigate to dashboard
            router.push('/dashboard');
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
                        type="email"
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

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

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
