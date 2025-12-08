'use client'

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../../components/LandingPage/footer/footer";

export default function VerifyPage() {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [phoneNumber, setPhoneNumber] = useState("");
    const [countdown, setCountdown] = useState(59);
    const [canResend, setCanResend] = useState(false);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length === 6) {
            // For demo purposes, accept any 6-digit code
            // In production, you would verify with your backend
            sessionStorage.setItem('isLoggedIn', 'true');
            router.push('/home');
        }
    };

    const handleResend = () => {
        if (canResend) {
            setCountdown(59);
            setCanResend(false);
            // Here you would call your API to resend the OTP
        }
    };

    // Format phone number for display (e.g., 99049990)
    const formatPhoneDisplay = (phone: string) => {
        return phone;
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
                        Таны <span className="font-semibold">{formatPhoneDisplay(phoneNumber)}</span> утас руу 6-н оронтой код илгээлээ. Кодоо оруулна уу.
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
                                    className="w-[46px] h-[54px] text-center text-lg font-semibold border border-gray-300 rounded-full outline-none focus:border-mainGreen focus:ring-1 focus:ring-mainGreen transition-all"
                                    maxLength={1}
                                />
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={otp.join('').length < 6}
                            draggable={false}
                            className="w-full bg-mainGreen text-white py-3 rounded-full hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Үргэлжлүүлэх
                        </button>

                        {/* Resend */}
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={!canResend}
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
