'use client'

import { Driver } from "@/types/order";
import { IoChevronBack } from "react-icons/io5";

interface DriverSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (driverId: number) => void;
    drivers: Driver[];
}

export default function DriverSelectionModal({ isOpen, onClose, onSelect, drivers }: DriverSelectionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <button 
                        onClick={onClose} 
                        className="flex items-center gap-2 text-sm bg-[#8c8c8c] text-white px-3 py-1 rounded-full mb-4 hover:bg-gray-700 transition-colors"
                    >
                        <IoChevronBack size={14} />
                        Буцах
                    </button>

                    <h2 className="text-xl font-bold text-center mb-6">Яг одоо идэвхтэй хүргэлтийн ажилтанууд</h2>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {drivers.map(driver => (
                            <div key={driver.id} className="border border-gray-200 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                    <div>
                                        <p className="font-medium text-sm">{driver.name}</p>
                                        <p className="text-xs text-mainGreen">{driver.distance}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">Яг одоо: {driver.location}</p>
                                
                                {/* Map placeholder */}
                                <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
                                
                                <div className="space-y-2">
                                    <button className="w-full py-2 border border-mainGreen text-mainGreen rounded-full text-sm font-medium hover:bg-green-50 transition-colors">
                                        Холбоо барих
                                    </button>
                                    <button 
                                        onClick={() => onSelect(driver.id)}
                                        className="w-full py-2 bg-mainGreen text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                                    >
                                        Хүргэлтийн хүсэлт илгээх
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center gap-2">
                        <button className="px-3 py-1 text-sm text-gray-500">&lt; Previous</button>
                        <button className="w-8 h-8 rounded-full bg-mainGreen text-white text-sm">1</button>
                        <button className="w-8 h-8 rounded-full text-gray-500 text-sm hover:bg-gray-100">2</button>
                        <button className="w-8 h-8 rounded-full text-gray-500 text-sm hover:bg-gray-100">3</button>
                        <span className="text-gray-400">...</span>
                        <button className="px-3 py-1 text-sm text-gray-500">Next &gt;</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
