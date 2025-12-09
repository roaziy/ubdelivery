'use client'

import { FaCheck } from "react-icons/fa6";

interface Step4SuccessProps {
    onComplete: () => void;
}

export default function Step4Success({ onComplete }: Step4SuccessProps) {
    return (
        <div className="flex flex-col min-h-[500px]">
            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Success Icon */}
                <div className="w-16 h-16 bg-mainGreen rounded-full flex items-center justify-center mb-6">
                    <FaCheck className="text-white" size={32} />
                </div>

                {/* Success Message */}
                <p className="text-center font-medium">
                    Компани / Рестораны профайл<br />
                    амжилттай баталгаажлаа.
                </p>
            </div>

            {/* Complete Button */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={onComplete}
                    className="px-8 py-3 bg-mainGreen text-white rounded-full font-medium hover:bg-green-600 transition-colors"
                >
                    Үргэлжүүлэх
                </button>
            </div>
        </div>
    );
}
