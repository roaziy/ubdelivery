'use client'

import { useEffect, useState, useCallback } from 'react';

interface UserLocationMapProps {
    position: [number, number];
    onPositionChange: (position: [number, number]) => void;
    onAddressChange?: (address: string) => void;
}

export default function UserLocationMap({ position, onPositionChange, onAddressChange }: UserLocationMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [leafletModules, setLeafletModules] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [mapInstance, setMapInstance] = useState<any>(null);

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
                        useMapEvents: reactLeaflet.useMapEvents,
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

    const { MapContainer, TileLayer, Marker, useMapEvents, L } = leafletModules;

    // Custom marker icon for user location
    const createUserIcon = () => {
        return L.divIcon({
            className: '',
            html: `
                <div style="
                    position: relative;
                    width: 40px;
                    height: 40px;
                ">
                    <div style="
                        background-color: #58BA5F;
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
                        ">📍</div>
                    </div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
        });
    };

    // Reverse geocode to get address from coordinates
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=mn`
            );
            const data = await response.json();
            
            if (data && data.display_name) {
                // Extract relevant address parts
                const address = data.address;
                let formattedAddress = '';
                
                if (address) {
                    // Try to build a meaningful address
                    const parts = [];
                    if (address.road) parts.push(address.road);
                    if (address.suburb) parts.push(address.suburb);
                    if (address.city || address.town) parts.push(address.city || address.town);
                    
                    formattedAddress = parts.length > 0 ? parts.join(', ') : data.display_name;
                } else {
                    formattedAddress = data.display_name;
                }
                
                onAddressChange?.(formattedAddress);
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            onAddressChange?.(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
    };

    // Component to handle map clicks
    function LocationMarker() {
        const map = useMapEvents({
            click(e: any) {
                const { lat, lng } = e.latlng;
                onPositionChange([lat, lng]);
                reverseGeocode(lat, lng);
            },
        });

        useEffect(() => {
            setMapInstance(map);
        }, [map]);

        return <Marker position={position} icon={createUserIcon()} />;
    }

    return (
        <>
            <style jsx global>{`
                .leaflet-container {
                    background: #f5f5f5;
                    cursor: crosshair;
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
                center={position}
                zoom={15}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', borderRadius: '0' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                    minZoom={10}
                />
                <LocationMarker />
            </MapContainer>
        </>
    );
}
