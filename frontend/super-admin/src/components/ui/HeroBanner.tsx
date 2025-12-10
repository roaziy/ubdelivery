'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

interface CommercialPost {
    id: string;
    image: string;
    title?: string;
    link?: string;
}

// Commercial posts for admin dashboard
const commercialPosts: CommercialPost[] = [
    {
        id: '1',
        image: '/Logotype.svg', // Replace with actual commercial images
        title: 'Платформын мэдээлэл',
        link: '/dashboard'
    },
    {
        id: '2',
        image: '/Logotype.svg',
        title: 'Шинэ захиалгууд',
        link: '/orders'
    },
    {
        id: '3',
        image: '/Logotype.svg',
        title: 'Санхүүгийн тайлан',
        link: '/finance'
    }
];

export default function HeroBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % commercialPosts.length);
                setFade(true);
            }, 300); // Fade out duration
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const currentPost = commercialPosts[currentIndex];

    return (
        <section className="mb-6">
            <div className="relative w-full h-[180px] md:h-[300px] rounded-2xl overflow-hidden group bg-gradient-to-r from-mainGreen to-green-600">
                {/* Commercial Post Content */}
                <div 
                    className={`absolute inset-0 transition-opacity duration-500 flex items-center justify-center ${
                        fade ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {currentPost.image ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={currentPost.image}
                                alt={currentPost.title || 'Commercial'}
                                fill
                                className="object-contain p-8"
                                priority={currentIndex === 0}
                            />
                        </div>
                    ) : (
                        <div className="text-white text-center px-8">
                            <h2 className="text-2xl md:text-4xl font-bold mb-2">
                                {currentPost.title || 'UB Delivery Admin'}
                            </h2>
                            <p className="text-sm md:text-lg opacity-90">
                                Платформын удирдлага
                            </p>
                        </div>
                    )}
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {commercialPosts.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setFade(false);
                                setTimeout(() => {
                                    setCurrentIndex(index);
                                    setFade(true);
                                }, 300);
                            }}
                            className={`h-2 rounded-full transition-all ${
                                index === currentIndex
                                    ? 'bg-white w-6'
                                    : 'bg-white/50 hover:bg-white/75 w-2'
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

