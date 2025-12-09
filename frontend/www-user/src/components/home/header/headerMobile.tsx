'use client'

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { IoPersonCircle } from "react-icons/io5";
import { useState } from "react";
import dynamic from 'next/dynamic';

const LocationPickerModal = dynamic(() => import('../restaurant/LocationPickerModal'), {
    ssr: false,
});

export default function HeaderMobile() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('Улаанбаатар');
    const [locationCoordinates, setLocationCoordinates] = useState<{ lat: number; lng: number } | null>(null);

    return (
        <div className="md:hidden">
            <div className="container mx-auto px-4 py-3 select-none">
                <div className="flex justify-between items-center">
                    <Link href="/home" draggable={false}>
                        <Image 
                            src="/LandingPage/logo.svg" 
                            alt="UB Delivery Logo" 
                            width={140} 
                            height={22} 
                            className="w-[140px] h-auto"
                            draggable={false}
                        />
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsLocationModalOpen(true)}
                            className="flex items-center gap-2 text-gray-600 hover:text-mainGreen transition-colors p-[6px] rounded-full hover:bg-green-50 border border-mainGreen"
                        >
                            <IoLocationSharp className="text-mainGreen" size={20} />
                        </button>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-mainGreen"
                            aria-label="Menu"
                        >
                            <IoMenu size={28} />
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <nav className="flex flex-col gap-6 pt-4 pb-2 text-sm border-t border-gray-200 mt-3">
                        <Link 
                            href="/home" 
                            draggable={false}
                            onClick={() => setIsMenuOpen(false)}
                            className={`transition-all ${pathname === '/home' ? 'text-mainGreen' : 'text-gray-900 hover:text-[#8c8c8c]'}`}
                        >
                            Нүүр
                        </Link>
                        <Link 
                            href="/home/restaurants" 
                            draggable={false}
                            onClick={() => setIsMenuOpen(false)}
                            className={`transition-all ${pathname === '/home/restaurants' ? 'text-mainGreen' : 'text-gray-900 hover:text-[#8c8c8c]'}`}
                        >
                            Ресторанууд
                        </Link>
                        <Link 
                            href="/home/foods" 
                            draggable={false}
                            onClick={() => setIsMenuOpen(false)}
                            className={`transition-all ${pathname === '/home/foods' ? 'text-mainGreen' : 'text-gray-900 hover:text-[#8c8c8c]'}`}
                        >
                            Бүх хоол
                        </Link>
                        <Link 
                            href="/home/cart" 
                            draggable={false}
                            onClick={() => setIsMenuOpen(false)}
                            className={`transition-all ${pathname === '/home/cart' ? 'text-mainGreen' : 'text-gray-900 hover:text-[#8c8c8c]'}`}
                        >
                            Сагс
                        </Link>
                        <Link 
                            href="/home/settings" 
                            draggable={false}
                            onClick={() => setIsMenuOpen(false)}
                            className={`transition-all ${pathname === '/home/settings' ? 'text-mainGreen' : 'text-gray-900 hover:text-[#8c8c8c]'}`}
                        >
                            Тохиргоо
                        </Link>
                    </nav>
                )}
            </div>

            {/* Location Picker Modal */}
            <LocationPickerModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                selectedLocation={selectedLocation}
                onLocationSelect={(address, coordinates) => {
                    setSelectedLocation(address);
                    if (coordinates) {
                        setLocationCoordinates(coordinates);
                        // Store coordinates in sessionStorage for backend API calls
                        sessionStorage.setItem('userLocation', JSON.stringify({
                            address,
                            coordinates
                        }));
                        console.log('Location selected:', { address, coordinates });
                    }
                }}
            />
        </div>
    );
}