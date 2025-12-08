'use client'

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import Footer from "../../components/LandingPage/footer/footer";

import { FaPhoneAlt } from "react-icons/fa";

export default function LoginPage() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length >= 8) {
            // Store phone number in session/localStorage for verification page
            sessionStorage.setItem('phoneNumber', phoneNumber);
            router.push('/login/verify');
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
                            <div className="flex items-center border border-gray-300 rounded-full px-4 py-4">
                                <span className="text-gray-500 mr-2"><FaPhoneAlt size={13}/></span>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    placeholder="Та утасны дугаараа оруулна уу"
                                    className="flex-1 outline-none text-sm bg-transparent"
                                    maxLength={8}
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
                                type="submit"
                                disabled={phoneNumber.length < 8}
                                className="flex-1 bg-mainGreen text-white py-4 rounded-full hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                draggable={false}
                            >
                                Үргэлжлүүлэх
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
