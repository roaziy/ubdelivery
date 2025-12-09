'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { FiUser, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { AuthService } from '@/lib/services';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const formRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (isAuthenticated) {
      router.push('/dashboard');
      return;
    }

    // Entrance animation
    const tl = gsap.timeline();
    
    tl.from(logoRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    }).from(
      formRef.current,
      {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      },
      '-=0.3'
    );
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AuthService.login({ username, password });
      
      if (response.success) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminUser', JSON.stringify(response.data));
        router.push('/dashboard');
      } else {
        setError(response.error || 'Invalid credentials');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mainBlack flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(88,186,95,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(88,186,95,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mainGreen/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mainGreen/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div ref={logoRef} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-mainGreen rounded-2xl mb-4 shadow-lg shadow-mainGreen/30">
            <FiShield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">UB Delivery</h1>
          <p className="text-gray-400 mt-2">Super Admin Portal</p>
        </div>

        {/* Login Form */}
        <div
          ref={formRef}
          className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800"
        >
          <h2 className="text-xl font-bold text-white mb-6">
            Sign in to your account
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="superadmin"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-mainGreen focus:ring-1 focus:ring-mainGreen"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-mainGreen focus:ring-1 focus:ring-mainGreen"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-mainGreen text-white font-semibold rounded-xl hover:bg-mainGreen/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-mainGreen/10 rounded-xl border border-mainGreen/20">
            <p className="text-mainGreen text-sm font-medium mb-2">
              Demo Credentials
            </p>
            <p className="text-gray-400 text-xs">
              Username: superadmin
            </p>
            <p className="text-gray-400 text-xs">Password: any password</p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          © 2025 UB Delivery. All rights reserved.
        </p>
      </div>
    </div>
  );
}
