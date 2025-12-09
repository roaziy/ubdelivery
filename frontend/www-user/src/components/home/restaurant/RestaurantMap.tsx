'use client'

import { useEffect, useState, useCallback } from 'react';
import { Restaurant } from '@/lib/types';
import { FaStar, FaRegClock } from 'react-icons/fa';
import Link from 'next/link';

// Custom marker icon using Tailwind-compatible inline styles
const createCustomIcon = (isOpen: boolean, L: any) => {
    const bgColor = isOpen ? '#10b981' : '#ef4444';
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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;

        const loadLeaflet = async () => {
            try {
                // Load CSS file
                if (typeof window !== 'undefined' && !document.querySelector('link[href*="leaflet.css"]')) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
                    link.crossOrigin = '';
                    document.head.appendChild(link);
                }

                const [reactLeaflet, leaflet] = await Promise.all([
                    import('react-leaflet'),
                    import('leaflet')
                ]);

                if (!isCancelled) {
                    setLeafletModules({
                        MapContainer: reactLeaflet.MapContainer,
                        TileLayer: reactLeaflet.TileLayer,
                        Marker: reactLeaflet.Marker,
                        Popup: reactLeaflet.Popup,
                        L: leaflet.default
                    });
                    setIsMounted(true);
                }
            } catch (err) {
                if (!isCancelled) {
                    console.error('Error loading Leaflet:', err);
                    setError('Газрын зураг ачаалахад алдаа гарлаа');
                }
            }
        };

        loadLeaflet();

        return () => {
            isCancelled = true;
        };
    }, []);

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
                <div className="text-center p-8">
                    <p className="text-red-600 text-lg font-medium mb-2">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-mainGreen text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Дахин оролдох
                    </button>
                </div>
            </div>
        );
    }

    if (!isMounted || !leafletModules) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
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
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
                <div className="text-center">
                    <p className="text-gray-600 text-lg font-medium">Газрын зураг дээр харуулах ресторан олдсонгүй</p>
                    <p className="text-gray-500 text-sm mt-2">Байршлын мэдээлэлтэй ресторан одоогоор байхгүй байна</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style jsx global>{`
                .leaflet-container {
                    background: #f5f5f5;
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    padding: 0;
                    overflow: hidden;
                }
                .leaflet-popup-content {
                    margin: 0;
                }
                .leaflet-popup-tip {
                    display: none;
                }
            `}</style>
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                    minZoom={10}
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
        </>
    );
}
