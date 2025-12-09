'use client'

import { useState, useRef } from "react";
import Image from "next/image";

interface Step1ImagesProps {
    profileImage: string | null;
    bannerImage: string | null;
    onProfileChange: (image: string | null) => void;
    onBannerChange: (image: string | null) => void;
    onNext: () => void;
}

export default function Step1Images({ 
    profileImage, 
    bannerImage, 
    onProfileChange, 
    onBannerChange, 
    onNext 
}: Step1ImagesProps) {
    const profileInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const [showBanner, setShowBanner] = useState(false);

    const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onProfileChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onBannerChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const canProceed = profileImage && bannerImage;

    return (
        <div className="flex flex-col min-h-[500px]">
            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Show profile upload or banner upload based on state */}
                {!showBanner ? (
                    /* Profile Image Upload */
                    <div 
                        onClick={() => profileInputRef.current?.click()}
                        className="w-[280px] h-[280px] md:w-[340px] md:h-[340px] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-mainGreen transition-colors overflow-hidden"
                    >
                        {profileImage ? (
                            <div className="relative w-full h-full">
                                <Image 
                                    src={profileImage} 
                                    alt="Profile" 
                                    fill 
                                    className="object-cover"
                                />
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onProfileChange(null);
                                    }}
                                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-500/80 text-white text-sm rounded-full hover:bg-gray-600 transition-colors"
                                >
                                    Дахин оруулах
                                </button>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 text-sm">
                                <p><span className="font-bold">340 x 340</span> хэмжээтэй ресторан</p>
                                <p><span className="font-bold">profile</span> зураг байршуулах</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Banner Image Upload */
                    <div 
                        onClick={() => bannerInputRef.current?.click()}
                        className="w-full max-w-[1000px] h-[200px] md:h-[280px] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-mainGreen transition-colors overflow-hidden"
                    >
                        {bannerImage ? (
                            <div className="relative w-full h-full">
                                <Image 
                                    src={bannerImage} 
                                    alt="Banner" 
                                    fill 
                                    className="object-cover"
                                />
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onBannerChange(null);
                                    }}
                                    className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 text-gray-700 text-sm rounded-full hover:bg-white transition-colors"
                                >
                                    Дахин оруулах
                                </button>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 text-sm">
                                <p><span className="font-bold">1280 x 340</span> хэмжээтэй ресторан <span className="font-bold">banner</span> зураг байршуулах</p>
                            </div>
                        )}
                    </div>
                )}

                <input 
                    ref={profileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfileUpload}
                    className="hidden"
                />
                <input 
                    ref={bannerInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleBannerUpload}
                    className="hidden"
                />
            </div>

            {/* Next Button */}
            <div className="flex justify-end mt-8">
                {!showBanner ? (
                    <button
                        onClick={() => setShowBanner(true)}
                        disabled={!profileImage}
                        className={`px-8 py-3 rounded-full font-medium transition-colors
                            ${profileImage 
                                ? 'bg-mainGreen text-white hover:bg-green-600' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }
                        `}
                    >
                        Үргэлжүүлэх
                    </button>
                ) : (
                    <button
                        onClick={onNext}
                        disabled={!canProceed}
                        className={`px-8 py-3 rounded-full font-medium transition-colors
                            ${canProceed 
                                ? 'bg-mainGreen text-white hover:bg-green-600' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }
                        `}
                    >
                        Үргэлжүүлэх
                    </button>
                )}
            </div>
        </div>
    );
}
