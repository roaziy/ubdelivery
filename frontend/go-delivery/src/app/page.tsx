'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IoCall, IoLockClosed, IoEye, IoEyeOff } from 'react-icons/io5';

export default function DriverLoginPage() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if already logged in
        const token = sessionStorage.getItem('driver_token');
        if (token) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!phone || !password) {
            setError('Утасны дугаар болон нууц үг оруулна уу');
            return;
        }

        if (phone.length !== 8) {
            setError('Утасны дугаар 8 оронтой байх ёстой');
            return;
        }

        setIsLoading(true);

        // Mock login - replace with actual API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock success
            if (phone === '99001122' && password === '123456') {
                sessionStorage.setItem('driver_token', 'mock_driver_token_123');
                sessionStorage.setItem('driver_info', JSON.stringify({
                    id: 'driver_001',
                    name: 'Одхүү Батцэцэг',
                    phone: '99001122',
                }));
                router.push('/dashboard');
            } else {
                setError('Утасны дугаар эсвэл нууц үг буруу байна');
            }
        } catch {
            setError('Сүлжээний алдаа. Дахин оролдоно уу.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-backgroundGreen flex items-center justify-center p-4">
            <div className="w-full max-w-[400px]">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4">
                        <Image 
                            src="/logos/logo.svg" 
                            alt="UB Delivery" 
                            width={80} 
                            height={80}
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-mainBlack">Go Delivery</h1>
                    <p className="text-gray-500 mt-1">Хүргэлтийн ажилтны систем</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-center mb-6">Нэвтрэх</h2>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Phone Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Утасны дугаар
                            </label>
                            <div className="relative">
                                <IoCall className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                    placeholder="99001122"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-mainGreen transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Нууц үг
                            </label>
                            <div className="relative">
                                <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••"
                                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-mainGreen transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-mainGreen text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Уншиж байна...' : 'Нэвтрэх'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Бүртгэл байхгүй юу?{' '}
                            <a href="/register" className="text-mainGreen font-medium hover:underline">
                                Бүртгүүлэх
                            </a>
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 text-center">
                            Туршилтын нэвтрэх: <strong>99001122</strong> / <strong>123456</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
