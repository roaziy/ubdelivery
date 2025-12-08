'use client'

import { FaStar, FaPhone } from "react-icons/fa6";
import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";

interface Restaurant {
    id: number;
    name: string;
    type: string;
    hours: string;
    rating: number;
    reviews: number;
    distance: string;
    phone: string;
}

interface RestaurantProfileProps {
    restaurant: Restaurant;
}

export default function RestaurantProfile({ restaurant }: RestaurantProfileProps) {
    return (
        <section className="mb-8">
            {/* Desktop Layout */}
            <div className="hidden md:block">
                <div className="relative h-[200px] bg-gray-400 rounded-2xl overflow-hidden">
                    {/* Restaurant Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-600 rounded-xl border-2 border-white"></div>
                            <div className="text-white">
                                <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="w-10 h-10 bg-mainGreen rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
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
                    {/* Restaurant Logo and Name */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-600 rounded-xl border-2 border-white"></div>
                        <div className="text-white">
                            <h1 className="text-xl font-bold">{restaurant.name}</h1>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="flex justify-center gap-4 mb-4">
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
                <button className="w-full bg-mainGreen text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                    Холбоо барих
                </button>
            </div>
        </section>
    );
}
