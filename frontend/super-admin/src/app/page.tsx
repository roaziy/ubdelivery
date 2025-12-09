'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineEmail, MdOutlinePassword } from 'react-icons/md';
import { AuthService } from '@/lib/services';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('И-мэйл хаяг оруулна уу');
      return;
    }
    
    if (!password) {
      setError('Нууц үг оруулна уу');
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.login({ username: email, password });
      
      if (response.success) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminUser', JSON.stringify(response.data));
        router.push('/dashboard');
      } else {
        setError(response.error || 'Нэвтрэх мэдээлэл буруу байна');
      }
    } catch {
      setError('Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-mainGreen rounded-2xl flex items-center justify-center mx-auto mb-4 select-none">
            <span className="text-white font-bold text-2xl">UB</span>
          </div>
          <h2 className="text-2xl font-bold text-mainBlack select-none">UB Delivery</h2>
          <p className="text-gray-400 text-sm mt-1 select-none">Super Admin Portal</p>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold mb-8 select-none text-mainBlack">Нэвтрэх</h1>

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-[400px] mb-4 px-6">
            <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-full text-center">
              {error}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-[400px] mx-auto px-6">
          {/* Email Input */}
          <div className="mb-4">
            <div className="flex items-center border-[1px] border-gray-300 rounded-full px-4 py-3 focus-within:border-mainGreen transition-colors bg-white">
              <MdOutlineEmail className="text-gray-400 mr-3 select-none" size={18} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin"
                className="flex-1 outline-none text-sm bg-transparent"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <div className="flex items-center border-[1px] border-gray-300 rounded-full px-4 py-3 focus-within:border-mainGreen transition-colors bg-white">
              <MdOutlinePassword className="text-gray-400 mr-3 select-none" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Нууц үг"
                className="flex-1 outline-none text-sm bg-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-mainGreen text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors disabled:opacity-70 select-none"
          >
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>

          {/* Demo Credentials */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs">
              Demo: superadmin / any password
            </p>
          </div>
        </form>

        {/* Footer */}
        <p className="text-gray-300 text-xs mt-12 select-none">
          © 2025 UB Delivery. All rights reserved.
        </p>
      </main>
    </div>
  );
}
