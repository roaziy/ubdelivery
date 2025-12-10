'use client'

import { useState, useEffect, useCallback, useRef } from "react";
import { useSettings } from "@/lib/hooks";
import { restaurantService } from "@/lib/services";
import { useNotifications } from "@/components/ui/Notification";
import { Skeleton } from "@/components/ui/Skeleton";

interface SettingsFormData {
  logoImage: File | null;
  bannerImage: File | null;
  logoPreview: string;
  bannerPreview: string;
  restaurantName: string;
  cuisineType: string;
  coordinates: string;
  phone: string;
  email: string;
  isActive: boolean;
  openTime: string;
  closeTime: string;
}

const initialFormData: SettingsFormData = {
  logoImage: null,
  bannerImage: null,
  logoPreview: "",
  bannerPreview: "",
  restaurantName: "",
  cuisineType: "",
  coordinates: "",
  phone: "",
  email: "",
  isActive: false,
  openTime: "09:00",
  closeTime: "23:00",
};

export default function SettingsContent() {
  const notifications = useNotifications();
  const { settings, loading, error, refetch } = useSettings();
  const [formData, setFormData] = useState<SettingsFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Populate form with fetched settings
  useEffect(() => {
    if (settings) {
      setFormData(prev => ({
        ...prev,
        restaurantName: settings.restaurantName || "",
        cuisineType: settings.cuisineType || "",
        coordinates: settings.coordinates || "",
        phone: settings.phone || "",
        email: settings.email || "",
        isActive: settings.isActive || false,
        openTime: settings.openTime || "09:00",
        closeTime: settings.closeTime || "23:00",
        logoPreview: settings.logoUrl || "",
        bannerPreview: settings.bannerUrl || "",
      }));
    }
  }, [settings]);

  const handleInputChange = useCallback((
    field: keyof SettingsFormData,
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleImageSelect = useCallback((
    type: 'logo' | 'banner',
    file: File
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'logo') {
        setFormData(prev => ({
          ...prev,
          logoImage: file,
          logoPreview: e.target?.result as string,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          bannerImage: file,
          bannerPreview: e.target?.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await restaurantService.updateSettings({
        restaurantName: formData.restaurantName,
        cuisineType: formData.cuisineType,
        coordinates: formData.coordinates,
        phone: formData.phone,
        email: formData.email,
        isActive: formData.isActive,
        openTime: formData.openTime,
        closeTime: formData.closeTime,
      });

      // Upload images if selected
      if (formData.logoImage) {
        await restaurantService.uploadLogo(formData.logoImage);
      }
      if (formData.bannerImage) {
        await restaurantService.uploadBanner(formData.bannerImage);
      }

      notifications.success(
        "Амжилттай хадгаллаа",
        "Тохиргооны мэдээлэл шинэчлэгдлээ"
      );
      refetch();
    } catch (err) {
      notifications.error(
        "Алдаа гарлаа",
        err instanceof Error ? err.message : "Тохиргоо хадгалахад алдаа гарлаа"
      );
    } finally {
      setIsSaving(false);
    }
  }, [formData, notifications, refetch]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-[900px]">
        {/* Section 1 skeleton */}
        <section className="mb-8">
          <Skeleton className="h-7 w-48 mb-6" />
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="grid grid-cols-2 gap-8 mb-6">
              <Skeleton className="h-32 w-32 mx-auto rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </div>
        </section>

        {/* Section 2 skeleton */}
        <section className="mb-8">
          <Skeleton className="h-7 w-64 mb-6" />
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <Skeleton className="h-14 w-full mb-6 rounded-xl" />
            <Skeleton className="h-48 w-full mb-6 rounded-xl" />
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </div>
        </section>

        {/* Section 3 skeleton */}
        <section className="mb-8">
          <Skeleton className="h-7 w-56 mb-6" />
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-64" />
              <div className="space-y-4">
                <Skeleton className="h-14 w-48" />
                <Skeleton className="h-14 w-48" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-red-500 mb-4 text-lg">
          Алдаа гарлаа: {error}
        </div>
        <button 
          onClick={refetch}
          className="px-6 py-3 bg-mainGreen text-white rounded-xl 
            hover:bg-green-600 transition-colors"
        >
          Дахин оролдох
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[900px]">
      <form onSubmit={handleSubmit}>
        {/* Restaurant Profile Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-mainBlack mb-6">
            Рестораны профайл
          </h2>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            {/* Image Uploads */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              {/* Logo Upload */}
              <div className="text-center">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageSelect('logo', file);
                  }}
                />
                <div 
                  onClick={() => logoInputRef.current?.click()}
                  className="w-32 h-32 mx-auto border-2 border-dashed 
                    border-gray-300 rounded-xl flex items-center 
                    justify-center mb-3 hover:border-mainGreen 
                    cursor-pointer transition-colors overflow-hidden"
                >
                  {formData.logoPreview ? (
                    <img 
                      src={formData.logoPreview} 
                      alt="Logo" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400 text-xs px-2">
                      <p>
                        Рестораны{" "}
                        <span className="font-bold text-mainBlack">
                          512x512px
                        </span>{" "}
                        png, jpg
                      </p>
                      <p>
                        хэмжээтэй{" "}
                        <span className="font-bold text-mainGreen">Logo</span>{" "}
                        зураг оруулах
                      </p>
                    </div>
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => logoInputRef.current?.click()}
                  className="px-6 py-2 bg-[#8c8c8c] text-white 
                    rounded-full text-sm hover:bg-gray-600 transition-colors"
                >
                  Сонгох
                </button>
              </div>

              {/* Banner Upload */}
              <div className="text-center">
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageSelect('banner', file);
                  }}
                />
                <div 
                  onClick={() => bannerInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed 
                    border-gray-300 rounded-xl flex items-center 
                    justify-center mb-3 hover:border-mainGreen 
                    cursor-pointer transition-colors overflow-hidden"
                >
                  {formData.bannerPreview ? (
                    <img 
                      src={formData.bannerPreview} 
                      alt="Banner" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400 text-xs px-2">
                      <p>
                        Рестораны{" "}
                        <span className="font-bold text-mainBlack">
                          1280x340px
                        </span>{" "}
                        png, jpg
                      </p>
                      <p>
                        хэмжээтэй{" "}
                        <span className="font-bold text-mainGreen">Banner</span>{" "}
                        зураг оруулах
                      </p>
                    </div>
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => bannerInputRef.current?.click()}
                  className="px-6 py-2 bg-[#8c8c8c] text-white 
                    rounded-full text-sm hover:bg-gray-600 transition-colors"
                >
                  Сонгох
                </button>
              </div>
            </div>

            {/* Restaurant Name & Cuisine */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Рестораны нэр
                </label>
                <input
                  type="text"
                  value={formData.restaurantName}
                  onChange={(e) => handleInputChange(
                    'restaurantName', 
                    e.target.value
                  )}
                  className="w-full px-4 py-3 border border-gray-200 
                    rounded-xl text-sm outline-none focus:border-mainGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Хоолны газрын төрөл
                </label>
                <select
                  value={formData.cuisineType}
                  onChange={(e) => handleInputChange(
                    'cuisineType', 
                    e.target.value
                  )}
                  className="w-full px-4 py-3 border border-gray-200 
                    rounded-xl text-sm outline-none focus:border-mainGreen"
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
          <h2 className="text-xl font-bold text-mainBlack mb-6">
            Хаяг, холбоо барих мэдээлэл
          </h2>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            {/* Coordinates */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Google Maps дээрх coordinate
              </label>
              <input
                type="text"
                value={formData.coordinates}
                onChange={(e) => handleInputChange(
                  'coordinates', 
                  e.target.value
                )}
                className="w-full px-4 py-3 border border-gray-200 
                  rounded-xl text-sm outline-none focus:border-mainGreen"
              />
            </div>

            {/* Map Placeholder */}
            <div className="h-48 bg-gray-200 rounded-xl mb-6 
              flex items-center justify-center text-gray-400">
              Газрын зураг
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Рестораны утасны дугаар
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 
                    rounded-xl text-sm outline-none focus:border-mainGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email хаяг
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 
                    rounded-xl text-sm outline-none focus:border-mainGreen"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Status & Hours Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-mainBlack mb-6">
            Статус, нээх & хаах цаг
          </h2>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange(
                    'isActive', 
                    !formData.isActive
                  )}
                  className={`w-12 h-6 rounded-full transition-colors 
                    relative ${
                      formData.isActive ? 'bg-mainGreen' : 'bg-gray-300'
                    }`}
                >
                  <span 
                    className={`absolute top-1 w-4 h-4 bg-white 
                      rounded-full transition-transform ${
                        formData.isActive ? 'right-1' : 'left-1'
                      }`} 
                  />
                </button>
                <span className="text-sm">
                  Рестораны ажиллах боломжгүй ( 
                  <span className={
                    formData.isActive ? 'text-mainGreen' : 'text-red-500'
                  }>
                    {formData.isActive ? 'active' : 'inactive'}
                  </span>
                   )
                </span>
              </div>

              {/* Hours */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-right">
                    Нээх цаг
                  </label>
                  <input
                    type="time"
                    value={formData.openTime}
                    onChange={(e) => handleInputChange(
                      'openTime', 
                      e.target.value
                    )}
                    className="w-48 px-4 py-3 border border-gray-200 
                      rounded-xl text-sm outline-none 
                      focus:border-mainGreen text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-right">
                    Буух цаг
                  </label>
                  <input
                    type="time"
                    value={formData.closeTime}
                    onChange={(e) => handleInputChange(
                      'closeTime', 
                      e.target.value
                    )}
                    className="w-48 px-4 py-3 border border-gray-200 
                      rounded-xl text-sm outline-none 
                      focus:border-mainGreen text-center"
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
            disabled={isSaving}
            className="px-8 py-3 bg-mainGreen text-white rounded-full 
              text-sm font-medium hover:bg-green-600 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2"
          >
            {isSaving && (
              <span className="w-4 h-4 border-2 border-white 
                border-t-transparent rounded-full animate-spin" />
            )}
            {isSaving ? 'Хадгалж байна...' : 'Тохиргоо хадгалах'}
          </button>
        </div>
      </form>
    </div>
  );
}
