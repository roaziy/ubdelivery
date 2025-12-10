'use client'

import { useState } from "react";
import { FaStar, FaPhone } from "react-icons/fa6";
import { IoLocationOutline, IoTimeOutline, IoClose, IoMail } from "react-icons/io5";

interface Restaurant {
    id: number;
    name: string;
    type: string;
    hours: string;
    rating: number;
    reviews: number;
    distance: string;
    phone: string;
    email?: string;
    logo?: string;
    banner?: string;
}

interface RestaurantProfileProps {
    restaurant: Restaurant;
}

export default function RestaurantProfile({ restaurant }: RestaurantProfileProps) {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    return (
        <section className="mb-8">
            {/* Desktop Layout */}
            <div className="hidden md:block">
                <div className="relative h-[200px] md:h-[300px] bg-gray-400 rounded-2xl overflow-hidden">
                    {/* Restaurant Banner */}
                    {restaurant.banner ? (
                        <img 
                            src={restaurant.banner} 
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    ) : null}
                    {/* Restaurant Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <div className="flex items-center gap-4">
                            {restaurant.logo ? (
                                <img 
                                    src={restaurant.logo} 
                                    alt={restaurant.name}
                                    className="w-16 h-16 rounded-xl border-2 border-white object-cover bg-white"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gray-600 rounded-xl border-2 border-white"></div>
                            )}
                            <div className="text-white">
                                <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                className="w-10 h-10 bg-mainGreen rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                                onClick={() => setIsContactModalOpen(true)}
                            >
                                <FaPhone className="text-white" size={16} />
                            </button>
                            <div className="flex gap-2">
                                <div className="bg-white px-3 py-2 rounded-lg text-center">
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        <FaStar className="text-yellow-500" size={12} />
                                        <span>{restaurant.rating}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{restaurant.reviews} үнэлгээ</p>
                                </div>
                                <div className="bg-white px-3 py-2 rounded-lg text-center">
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        <IoLocationOutline size={14} />
                                        <span>{restaurant.distance}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">60 мин</p>
                                </div>
                                <div className="bg-white px-3 py-2 rounded-lg text-center">
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        <IoTimeOutline size={14} />
                                        <span>11:30</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{restaurant.hours}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
                <div className="relative h-[180px] bg-gray-400 rounded-2xl overflow-hidden mb-4">
                    {/* Restaurant Banner */}
                    {restaurant.banner ? (
                        <img 
                            src={restaurant.banner} 
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    ) : null}
                    {/* Restaurant Logo and Name */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                        {restaurant.logo ? (
                            <img 
                                src={restaurant.logo} 
                                alt={restaurant.name}
                                className="w-12 h-12 rounded-xl border-2 border-white object-cover bg-white"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="w-12 h-12 bg-gray-600 rounded-xl border-2 border-white"></div>
                        )}
                        <div className="text-white">
                            <h1 className="text-xl font-bold">{restaurant.name}</h1>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="flex justify-center gap-4 mb-4 border border-[#D8D9D7] bg-white py-4 rounded-xl">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium">
                            <FaStar className="text-yellow-500" size={12} />
                            <span>{restaurant.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">{restaurant.reviews} үнэлгээ</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium">
                            <IoLocationOutline size={14} />
                            <span>{restaurant.distance}</span>
                        </div>
                        <p className="text-xs text-gray-500">60 мин</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium">
                            <IoTimeOutline size={14} />
                            <span>11:30</span>
                        </div>
                        <p className="text-xs text-gray-500">{restaurant.hours}</p>
                    </div>
                </div>

                {/* Contact Button */}
                <button 
                    className="w-full bg-mainGreen text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    onClick={() => setIsContactModalOpen(true)}
                >
                    Холбоо барих
                </button>
            </div>

            {/* Contact Modal */}
            {isContactModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsContactModalOpen(false)}>
                    <div 
                        className="bg-white rounded-2xl p-6 w-full max-w-md relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => setIsContactModalOpen(false)}
                        >
                            <IoClose size={24} />
                        </button>
                        
                        <h2 className="text-xl font-bold mb-6 text-center">Холбоо барих</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="max-w-12 max-h-12 p-3 bg-mainGreen/10 rounded-full flex items-center justify-center">
                                    <FaPhone className="text-mainGreen" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Утасны дугаар</p>
                                    <a href={`tel:${restaurant.phone}`} className="font-medium text-lg hover:text-mainGreen transition-colors text-sm md:text-lg">
                                        {restaurant.phone}
                                    </a>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="max-w-12 max-h-12 p-3 bg-mainGreen/10 rounded-full flex items-center justify-center">
                                    <IoMail className="text-mainGreen" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Имэйл хаяг</p>
                                    <a href={`mailto:${restaurant.email || 'info@restaurant.mn'}`} className="font-medium text-sm md:text-lg hover:text-mainGreen transition-colors">
                                        {restaurant.email || 'info@ubdelivery.xyz'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
