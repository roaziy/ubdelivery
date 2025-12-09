'use client'

import { useEffect, useState } from 'react';
import { Restaurant } from '@/lib/types';
import { FaStar, FaRegClock } from 'react-icons/fa';
import Link from 'next/link';

// Custom marker icon using Tailwind-compatible inline styles
const createCustomIcon = (isOpen: boolean, L: any) => {
    const bgColor = isOpen ? '#10b981' : '#ef4444'; // Tailwind green-500 / red-500
    return L.divIcon({
        className: '',
        html: `
            <div style="
                position: relative;
                width: 40px;
                height: 40px;
            ">
                <div style="
                    background-color: ${bgColor};
                    width: 32px;
                    height: 32px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 3px solid white;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: 0;
                    left: 4px;
                ">
                    <div style="
                        transform: rotate(45deg);
                        font-size: 16px;
                    ">🍽️</div>
                </div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });
};

interface RestaurantMapProps {
    restaurants: Restaurant[];
}

export default function RestaurantMap({ restaurants }: RestaurantMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [leafletModules, setLeafletModules] = useState<any>(null);

    useEffect(() => {
        // Dynamically import leaflet modules only on client side
        Promise.all([
            import('react-leaflet'),
            import('leaflet'),
            // import('leaflet/dist/leaflet.css')
        ]).then(([reactLeaflet, leaflet]) => {
            setLeafletModules({
                MapContainer: reactLeaflet.MapContainer,
                TileLayer: reactLeaflet.TileLayer,
                Marker: reactLeaflet.Marker,
                Popup: reactLeaflet.Popup,
                L: leaflet.default
            });
            setIsMounted(true);
        });
    }, []);

    if (!isMounted || !leafletModules) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainGreen mx-auto mb-4"></div>
                    <p className="text-gray-600">Газрын зураг ачаалж байна...</p>
                </div>
            </div>
        );
    }

    const { MapContainer, TileLayer, Marker, Popup, L } = leafletModules;

    // Filter restaurants with coordinates
    const restaurantsWithCoords = restaurants.filter(r => r.coordinates);

    // Default center (Ulaanbaatar)
    const defaultCenter: [number, number] = [47.9187, 106.9177];
    
    // Calculate center based on restaurants
    const center: [number, number] = restaurantsWithCoords.length > 0
        ? [
            restaurantsWithCoords.reduce((sum, r) => sum + (r.coordinates?.lat || 0), 0) / restaurantsWithCoords.length,
            restaurantsWithCoords.reduce((sum, r) => sum + (r.coordinates?.lng || 0), 0) / restaurantsWithCoords.length
        ]
        : defaultCenter;

    if (restaurantsWithCoords.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <p className="text-gray-600 text-lg font-medium">Газрын зураг дээр харуулах ресторан олдсонгүй</p>
                    <p className="text-gray-500 text-sm mt-2">Байршлын мэдээлэлтэй ресторан одоогоор байхгүй байна</p>
                </div>
            </div>
        );
    }

    return (
        <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {restaurantsWithCoords.map((restaurant) => (
                <Marker
                    key={restaurant.id}
                    position={[restaurant.coordinates!.lat, restaurant.coordinates!.lng]}
                    icon={createCustomIcon(restaurant.isOpen, L)}
                >
                    <Popup className="custom-popup">
                        <Link 
                            href={`/home/restaurants/${restaurant.id}`}
                            className="block no-underline"
                        >
                            <div className="min-w-[220px] p-3 bg-white rounded-xl">
                                {restaurant.logo && (
                                    <div className="w-full h-20 mb-3 rounded-lg overflow-hidden bg-gray-100">
                                        <img 
                                            src={restaurant.logo} 
                                            alt={restaurant.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <h3 className="font-bold text-base mb-1 text-gray-900">{restaurant.name}</h3>
                                <p className="text-gray-600 text-xs mb-3">{restaurant.type}</p>
                                <div className="flex items-center justify-between text-xs mb-2">
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <FaRegClock size={12} />
                                        <span>{restaurant.hours}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-mainGreen">
                                        <FaStar size={12} />
                                        <span className="font-semibold">{restaurant.rating}</span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    {restaurant.isOpen ? (
                                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 font-medium text-xs rounded-full">
                                            Нээлттэй
                                        </span>
                                    ) : (
                                        <span className="inline-block px-2 py-1 bg-red-100 text-red-700 font-medium text-xs rounded-full">
                                            Хаалттай
                                        </span>
                                    )}
                                </div>
                                <div className="text-center bg-mainGreen text-white text-xs py-2 px-3 rounded-lg font-medium hover:bg-green-600 transition-colors">
                                    Дэлгэрэнгүй үзэх →
                                </div>
                            </div>
                        </Link>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
