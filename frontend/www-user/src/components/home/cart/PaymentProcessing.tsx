'use client'

export default function PaymentProcessing() {
    return (
        <div className="flex flex-col items-center justify-center py-20 h-[500px]">
            {/* Loading Spinner */}
            <div className="w-16 h-16 border-4 border-mainGreen border-t-transparent rounded-full animate-spin mb-8"></div>
            <p className="text-center text-gray-700">
                Таны захиалгын төлбөрийг гаргаж<br />
                байна... Та түр хүлээнэ үү?
            </p>
        </div>
    );
}
