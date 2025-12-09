'use client'

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNotifications } from "@/components/ui/Notification";

interface SettingsFormData {
    logoImage: File | null;
    bannerImage: File | null;
    restaurantName: string;
    cuisineType: string;
    coordinates: string;
    phone: string;
    email: string;
    isActive: boolean;
    openTime: string;
    closeTime: string;
}

export default function SettingsPage() {
    const notifications = useNotifications();
    const [formData, setFormData] = useState<SettingsFormData>({
        logoImage: null,
        bannerImage: null,
        restaurantName: "Pizzahut Mongolia",
        cuisineType: "",
        coordinates: "47°55'04.4\"N 106°55'11.7\"E",
        phone: "95049990",
        email: "contact@ubdelivery.xyz",
        isActive: false,
        openTime: "09:00",
        closeTime: "23:00",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        notifications.success("Амжилттай хадгаллаа", "Тохиргооны мэдээлэл шинэчлэгдлээ");
    };

    return (
        <DashboardLayout>
            <div className="max-w-[900px]">
                <form onSubmit={handleSubmit}>
                    {/* Restaurant Profile Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-mainBlack mb-6">Рестораны профайл</h2>
                        
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            {/* Image Uploads */}
                            <div className="grid grid-cols-2 gap-8 mb-6">
                                {/* Logo Upload */}
                                <div className="text-center">
                                    <div className="w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center mb-3 hover:border-mainGreen cursor-pointer transition-colors">
                                        <div className="text-center text-gray-400 text-xs px-2">
                                            <p>Рестораны <span className="font-bold text-mainBlack">512x512px</span> png, jpg</p>
                                            <p>хэмжээтэй <span className="font-bold text-mainGreen">Logo</span> зураг оруулах</p>
                                        </div>
                                    </div>
                                    <button type="button" className="px-6 py-2 bg-[#8c8c8c] text-white rounded-full text-sm">
                                        Сонгох
                                    </button>
                                </div>

                                {/* Banner Upload */}
                                <div className="text-center">
                                    <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center mb-3 hover:border-mainGreen cursor-pointer transition-colors">
                                        <div className="text-center text-gray-400 text-xs px-2">
                                            <p>Рестораны <span className="font-bold text-mainBlack">1280x340px</span> png, jpg</p>
                                            <p>хэмжээтэй <span className="font-bold text-mainGreen">Banner</span> зураг оруулах</p>
                                        </div>
                                    </div>
                                    <button type="button" className="px-6 py-2 bg-[#8c8c8c] text-white rounded-full text-sm">
                                        Сонгох
                                    </button>
                                </div>
                            </div>

                            {/* Restaurant Name & Cuisine */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Рестораны нэр</label>
                                    <input
                                        type="text"
                                        value={formData.restaurantName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, restaurantName: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-mainGreen"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Хоолны газрын төрөл</label>
                                    <select
                                        value={formData.cuisineType}
                                        onChange={(e) => setFormData(prev => ({ ...prev, cuisineType: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-mainGreen"
                                    >
                                        <option value="">Сонгох</option>
                                        <option value="pizza">Пицца</option>
                                        <option value="burger">Бургер</option>
                                        <option value="asian">Азийн хоол</option>
                                        <option value="mongolian">Монгол хоол</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Address & Contact Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-mainBlack mb-6">Хаяг, холбоо барих мэдээлэл</h2>
                        
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            {/* Coordinates */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Google Maps дээрх coordinate</label>
                                <input
                                    type="text"
                                    value={formData.coordinates}
                                    onChange={(e) => setFormData(prev => ({ ...prev, coordinates: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-mainGreen"
                                />
                            </div>

                            {/* Map Placeholder */}
                            <div className="h-48 bg-gray-200 rounded-xl mb-6"></div>

                            {/* Phone & Email */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Рестораны утасны дугаар</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-mainGreen"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email хаяг</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-mainGreen"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Status & Hours Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-mainBlack mb-6">Статус, нээх & хаах цаг</h2>
                        
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <div className="flex items-start justify-between">
                                {/* Active Toggle */}
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${
                                            formData.isActive ? 'bg-mainGreen' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span 
                                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                                formData.isActive ? 'right-1' : 'left-1'
                                            }`} 
                                        />
                                    </button>
                                    <span className="text-sm">
                                        Рестораны ажиллах боломжгүй ( 
                                        <span className={formData.isActive ? 'text-mainGreen' : 'text-red-500'}>
                                            {formData.isActive ? 'active' : 'inactive'}
                                        </span>
                                         )
                                    </span>
                                </div>

                                {/* Hours */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-right">Нээх цаг</label>
                                        <input
                                            type="time"
                                            value={formData.openTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, openTime: e.target.value }))}
                                            className="w-48 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-mainGreen text-center"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-right">Буух цаг</label>
                                        <input
                                            type="time"
                                            value={formData.closeTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, closeTime: e.target.value }))}
                                            className="w-48 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-mainGreen text-center"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-mainGreen text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                            Тохиргоо хадгалах
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
