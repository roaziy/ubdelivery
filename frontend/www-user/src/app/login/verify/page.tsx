'use client'

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/components/ui/Notification";
import Footer from "../../../components/LandingPage/footer/footer";
import { verifyOTP, setupRecaptcha, sendOTP } from "@/lib/firebase";
import { AuthService } from "@/lib/api";

export default function VerifyPage() {
    const router = useRouter();
    const notify = useNotifications();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [phoneNumber, setPhoneNumber] = useState("");
    const [countdown, setCountdown] = useState(59);
    const [canResend, setCanResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Get phone number from session storage
        const storedPhone = sessionStorage.getItem('phoneNumber');
        if (storedPhone) {
            setPhoneNumber(storedPhone);
        } else {
            // If no phone number, redirect to login
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        // Countdown timer
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleOtpChange = (index: number, value: string) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only take last character
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits entered
        if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
            setTimeout(() => handleSubmit(undefined, newOtp.join('')), 100);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);
        // Focus last filled input or next empty input
        const focusIndex = Math.min(pastedData.length, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleSubmit = async (e?: React.FormEvent, codeOverride?: string) => {
        if (e) e.preventDefault();
        
        const otpCode = codeOverride || otp.join('');
        if (otpCode.length !== 6) {
            notify.error('Алдаа', '6 оронтой код оруулна уу');
            return;
        }

        setIsLoading(true);

        try {
            // Verify OTP with Firebase
            const firebaseResult = await verifyOTP(otpCode);
            
            if (!firebaseResult.success || !firebaseResult.token) {
                notify.error('Алдаа', firebaseResult.error || 'Код буруу байна');
                setIsLoading(false);
                return;
            }

            // Now verify with backend and create/login user
            const backendResult = await AuthService.verifyOtp(firebaseResult.token);
            
            if (backendResult.success) {
                sessionStorage.setItem('isLoggedIn', 'true');
                notify.success('Амжилттай', 'Нэвтрэлт амжилттай боллоо');
                router.push('/home');
            } else {
                notify.error('Алдаа', backendResult.error || 'Нэвтрэхэд алдаа гарлаа');
            }
        } catch {
            notify.error('Алдаа', 'Сервертэй холбогдоход алдаа гарлаа');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend || !phoneNumber) return;

        setIsLoading(true);
        
        try {
            // Setup new reCAPTCHA verifier
            setupRecaptcha('resend-button');
            
            const result = await sendOTP(phoneNumber);
            
            if (result.success) {
                setCountdown(59);
                setCanResend(false);
                setOtp(Array(6).fill(""));
                notify.info('Код илгээгдлээ', 'Шинэ код таны утас руу илгээгдлээ');
            } else {
                notify.error('Алдаа', result.error || 'Код дахин илгээхэд алдаа гарлаа');
            }
        } catch {
            notify.error('Алдаа', 'Сервертэй холбогдоход алдаа гарлаа');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-backgroundGreen">
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full h-screen pb-[150px] md:pb-[100px] justify-center max-w-[334px] flex flex-col items-center">
                    {/* Logo */}
                    <Link href="/" draggable={false}>
                        <Image 
                            src="/LandingPage/logo.svg" 
                            alt="UB Delivery Logo" 
                            width={200} 
                            height={32} 
                            className="mb-12 select-none"
                            draggable={false}
                        />
                    </Link>

                    {/* Title */}
                    <h1 className="text-xl font-bold mb-4">Баталгаажуулах</h1>

                    {/* Instructions */}
                    <p className="text-sm text-gray-600 text-center mb-8">
                        Таны <span className="font-semibold">+976 {phoneNumber}</span> утас руу 6-н оронтой код илгээлээ. Кодоо оруулна уу.
                    </p>

                    {/* OTP Input */}
                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        <div className="flex justify-center gap-2" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-[46px] h-[54px] bg-white text-center text-lg font-semibold border border-gray-300 rounded-full outline-none focus:border-mainGreen focus:ring-1 focus:ring-mainGreen transition-all"
                                    maxLength={1}
                                    disabled={isLoading}
                                />
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={otp.join('').length < 6 || isLoading}
                            draggable={false}
                            className="w-full bg-mainGreen text-white py-3 rounded-full hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle 
                                            className="opacity-25" 
                                            cx="12" cy="12" r="10" 
                                            stroke="currentColor" strokeWidth="4" fill="none"
                                        />
                                        <path 
                                            className="opacity-75" 
                                            fill="currentColor" 
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Шалгаж байна...
                                </>
                            ) : (
                                'Үргэлжлүүлэх'
                            )}
                        </button>

                        {/* Resend */}
                        <button
                            id="resend-button"
                            type="button"
                            onClick={handleResend}
                            disabled={!canResend || isLoading}
                            draggable={false}
                            className="w-full py-3 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {canResend ? 'Дахин код илгээх' : `Дахин код илгээх: ${countdown} сек`}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
