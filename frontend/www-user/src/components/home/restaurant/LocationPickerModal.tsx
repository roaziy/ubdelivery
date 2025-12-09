'use client'

import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import dynamic from 'next/dynamic';

const UserLocationMap = dynamic(() => import('./UserLocationMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainGreen mx-auto mb-4"></div>
                <p className="text-gray-600">Газрын зураг ачаалж байна...</p>
            </div>
        </div>
    ),
});

interface LocationData {
    address: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}

interface LocationPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedLocation?: string;
    onLocationSelect?: (location: string, coordinates?: { lat: number; lng: number }) => void;
}

export default function LocationPickerModal({ 
    isOpen, 
    onClose, 
    selectedLocation,
    onLocationSelect 
}: LocationPickerModalProps) {
    const [selectedAddress, setSelectedAddress] = useState(selectedLocation || '38-р байр');
    const [userPosition, setUserPosition] = useState<[number, number]>([47.9187, 106.9177]);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAddressChange = (address: string) => {
        setSelectedAddress(address);
        setIsLoadingAddress(false);
    };

    const handlePositionChange = (position: [number, number]) => {
        setUserPosition(position);
        setIsLoadingAddress(true);
    };

    const handleConfirm = () => {
        onLocationSelect?.(selectedAddress, {
            lat: userPosition[0],
            lng: userPosition[1]
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md mt-4 md:mt-20 max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <IoClose size={24} className="text-gray-700" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900">Байршил оруулах</h2>
                    <div className="w-6"></div>
                </div>

                {/* Map Section */}
                <div className="flex-1 overflow-hidden">
                    <div className="h-[400px] w-full">
                        <UserLocationMap 
                            position={userPosition}
                            onPositionChange={handlePositionChange}
                            onAddressChange={handleAddressChange}
                        />
                    </div>
                </div>

                {/* Address Section */}
                <div className="p-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Хүргүүлэх хаяг</h3>
                    <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg mb-4 cursor-pointer hover:border-mainGreen transition-colors">
                        <div className="w-8 h-8 bg-mainGreen bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                            {isLoadingAddress ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-mainGreen border-t-transparent"></div>
                            ) : (
                                <svg className="w-5 h-5 text-mainGreen" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={selectedAddress}
                                onChange={(e) => setSelectedAddress(e.target.value)}
                                className="w-full text-sm font-medium text-gray-900 outline-none"
                                placeholder="Хаягаа оруулна уу"
                            />
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <button
                        onClick={handleConfirm}
                        className="w-full bg-mainGreen text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                        Баталгаажуулах
                    </button>
                </div>
            </div>
        </div>
    );
}
