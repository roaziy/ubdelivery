'use client'

import { useState } from "react";

interface Step2HoursProps {
    is24Hours: boolean | null;
    openTime: string;
    closeTime: string;
    onIs24HoursChange: (value: boolean) => void;
    onOpenTimeChange: (value: string) => void;
    onCloseTimeChange: (value: string) => void;
    onNext: () => void;
}

export default function Step2Hours({ 
    is24Hours, 
    openTime, 
    closeTime, 
    onIs24HoursChange, 
    onOpenTimeChange, 
    onCloseTimeChange, 
    onNext 
}: Step2HoursProps) {
    
    const canProceed = is24Hours === true || (is24Hours === false && openTime && closeTime);

    return (
        <div className="flex flex-col min-h-[500px]">
            <div className="flex-1 flex flex-col items-center justify-center max-w-[300px] mx-auto w-full">
                {/* Question */}
                <p className="text-center font-medium mb-6">
                    Танай ресторан 24 цаг ажилдаг уу?
                </p>

                {/* Yes/No Buttons */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => onIs24HoursChange(true)}
                        className={`px-8 py-3 rounded-full font-medium transition-colors
                            ${is24Hours === true 
                                ? 'bg-mainGreen text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }
                        `}
                    >
                        Тийм
                    </button>
                    <button
                        onClick={() => onIs24HoursChange(false)}
                        className={`px-8 py-3 rounded-full font-medium transition-colors
                            ${is24Hours === false 
                                ? 'bg-mainGreen text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }
                        `}
                    >
                        Үгүй
                    </button>
                </div>

                {/* Time Inputs - only show if not 24 hours */}
                {is24Hours === false && (
                    <div className="w-full space-y-4">
                        {/* Opening Time */}
                        <div>
                            <label className="block text-center text-sm font-medium mb-2">
                                Нээх цаг
                            </label>
                            <input
                                type="time"
                                value={openTime}
                                onChange={(e) => onOpenTimeChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-full text-center outline-none focus:border-mainGreen transition-colors"
                            />
                        </div>

                        {/* Closing Time */}
                        <div>
                            <label className="block text-center text-sm font-medium mb-2">
                                Буух цаг
                            </label>
                            <input
                                type="time"
                                value={closeTime}
                                onChange={(e) => onCloseTimeChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-full text-center outline-none focus:border-mainGreen transition-colors"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Next Button */}
            <div className="flex justify-center mt-8">
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
            </div>
        </div>
    );
}
