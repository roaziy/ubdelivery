'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

interface CommercialPost {
    id: string;
    image_url: string;
    title?: string;
    link?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function HeroBanner() {
    const [banners, setBanners] = useState<CommercialPost[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/banners?active=true`);
                const data = await response.json();
                if (data.success && data.data && data.data.length > 0) {
                    setBanners(data.data);
                } else {
                    // Fallback to default banners if API fails
                    setBanners([
                        {
                            id: '1',
                            image_url: '/LandingPage/iphone.png',
                            title: 'Хямдралтай хоол',
                            link: '/home/foods'
                        }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch banners:', error);
                // Fallback to default banner
                setBanners([
                    {
                        id: '1',
                        image_url: '/LandingPage/iphone.png',
                        title: 'UB Delivery',
                        link: '/home'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length === 0) return;
        
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % banners.length);
                setFade(true);
            }, 300); // Fade out duration
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [banners.length]);

    if (loading) {
        return (
            <section className="mb-8">
                <div className="w-full h-[200px] md:h-[420px] bg-gray-300 rounded-2xl animate-pulse"></div>
            </section>
        );
    }

    if (banners.length === 0) {
        return null;
    }

    const currentPost = banners[currentIndex];

    return (
        <section className="mb-8">
            <div className="relative w-full h-[200px] md:h-[420px] rounded-2xl overflow-hidden group">
                {/* Commercial Post Image */}
                <div 
                    className={`absolute inset-0 transition-opacity duration-500 ${
                        fade ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {currentPost.image_url ? (
                        <Image
                            src={currentPost.image_url}
                            alt={currentPost.title || 'Commercial'}
                            fill
                            className="object-cover"
                            priority={currentIndex === 0}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-mainGreen to-green-600 flex items-center justify-center">
                            <div className="text-white text-center">
                                <h2 className="text-2xl md:text-4xl font-bold mb-2">
                                    {currentPost.title || 'UB Delivery'}
                                </h2>
                                <p className="text-sm md:text-lg opacity-90">
                                    Хамгийн хурдан хоол хүргэлт
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setFade(false);
                                setTimeout(() => {
                                    setCurrentIndex(index);
                                    setFade(true);
                                }, 300);
                            }}
                            className={`w-2 h-2 rounded-full transition-all ${
                                index === currentIndex
                                    ? 'bg-white w-6'
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Clickable Link */}
                {currentPost.link && (
                    <a
                        href={currentPost.link}
                        className="absolute inset-0 z-10"
                        aria-label={currentPost.title}
                    />
                )}
            </div>
        </section>
    );
}
