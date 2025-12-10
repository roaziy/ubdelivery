'use client'

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import Footer from "../../components/LandingPage/footer/footer";
import { useNotifications } from "@/components/ui/Notification";
import { setupRecaptcha, sendOTP } from "@/lib/firebase";

export default function LoginPage() {
    const router = useRouter();
    const notify = useNotifications();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Setup reCAPTCHA when component mounts (hidden container)
        const timer = setTimeout(() => {
        setupRecaptcha('recaptcha-container');
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (phoneNumber.length < 8) {
            notify.error('Алдаа', 'Утасны дугаар буруу байна');
            return;
        }

        setIsLoading(true);

        try {
            const result = await sendOTP(phoneNumber);
            
            if (result.success) {
                notify.success('Амжилттай', 'Баталгаажуулах код илгээгдлээ');
                router.push('/login/verify');
            } else {
                notify.error('Алдаа', result.error || 'OTP илгээхэд алдаа гарлаа');
            }
        } catch {
            notify.error('Алдаа', 'Сервертэй холбогдоход алдаа гарлаа');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 8) {
            setPhoneNumber(value);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-backgroundGreen">
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full h-screen pb-[150px] md:pb-[100px] justify-center max-w-[336px] flex flex-col items-center">
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
                    <h1 className="text-[24px] font-bold mb-8">Нэвтрэх</h1>

                    {/* Phone Input */}
                    <form onSubmit={handleSubmit} className="w-full space-y-6 mt-4">
                        <div className="relative">
                            <div className="flex items-center border border-gray-300 bg-white rounded-full px-4 py-4">
                                <span className="text-gray-500 mr-2"><FaPhoneAlt size={13}/></span>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    placeholder="Утасны дугаараа оруулна уу"
                                    className="flex-1 outline-none text-sm bg-transparent"
                                    maxLength={8}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-10">
                            <Link 
                                href="/"
                                className="flex items-center justify-center gap-1 bg-[#8C8C8C] text-white px-5 py-4 rounded-full hover:bg-neutral-500 transition-colors text-sm"
                                draggable={false}
                            >
                                <IoChevronBack size={16} />
                                БУЦАХ
                            </Link>
                            <button
                                id="send-otp-button"
                                type="submit"
                                disabled={phoneNumber.length < 8 || isLoading}
                                className="flex-1 bg-mainGreen text-white py-4 rounded-full hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                draggable={false}
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
                                        Илгээж байна...
                                    </>
                                ) : (
                                    'Үргэлжлүүлэх'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* reCAPTCHA container (hidden) */}
                    <div id="recaptcha-container" style={{ display: 'none' }}></div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
