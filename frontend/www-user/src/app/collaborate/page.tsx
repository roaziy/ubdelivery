"use client"

import { useState } from "react";
import Header from "@/components/LandingPage/header/header";
import Footer from "@/components/LandingPage/footer/footer";
import { useNotifications } from "@/components/ui/Notification";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Collaborate() {
  const notify = useNotifications();
  const [registrationType, setRegistrationType] = useState<"restaurant" | "driver">("restaurant");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    phoneNumber: "",
    email: "",
    address: "",
    coordinates: "",
    additionalInfo: "",
    firstName: "",
    lastName: "",
    vehicleType: "",
    vehicleNumber: "",
    licenseNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      if (registrationType === "restaurant") {
        // Validate required fields
        if (!formData.businessName || !formData.phoneNumber) {
          notify.error('Алдаа', 'Нэр болон утасны дугаар заавал бөглөнө үү');
          setIsSubmitting(false);
          return;
        }

        formDataToSend.append('name', formData.businessName);
        formDataToSend.append('phone', formData.phoneNumber);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('message', formData.additionalInfo);
        
        // Parse coordinates if provided
        if (formData.coordinates) {
          formDataToSend.append('coordinates', formData.coordinates);
        }
      } else {
        // Validate required fields for driver
        if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
          notify.error('Алдаа', 'Нэр, овог болон утасны дугаар заавал бөглөнө үү');
          setIsSubmitting(false);
          return;
        }

        const fullName = `${formData.lastName} ${formData.firstName}`.trim();
        formDataToSend.append('name', fullName);
        formDataToSend.append('phone', formData.phoneNumber);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('message', formData.additionalInfo);
        formDataToSend.append('vehicleType', formData.vehicleType);
        formDataToSend.append('vehicleNumber', formData.vehicleNumber);
        formDataToSend.append('licenseNumber', formData.licenseNumber);
        
        if (profileImageFile) {
          formDataToSend.append('documents', profileImageFile);
        }
      }

      const endpoint = registrationType === "restaurant" 
        ? '/applications/restaurant' 
        : '/applications/driver';

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        notify.success(
          'Амжилттай илгээгдлээ!', 
          'Таны хүсэлт амжилттай илгээгдлээ. Бид тантай удахгүй холбогдоно.'
        );
        
        // Reset form
        setFormData({
          businessName: "",
          phoneNumber: "",
          email: "",
          address: "",
          coordinates: "",
          additionalInfo: "",
          firstName: "",
          lastName: "",
          vehicleType: "",
          vehicleNumber: "",
          licenseNumber: "",
        });
        setProfileImage(null);
        setProfileImageFile(null);
      } else {
        notify.error('Алдаа', data.message || 'Хүсэлт илгээхэд алдаа гарлаа');
      }
    } catch {
      notify.error('Алдаа', 'Сервертэй холбогдоход алдаа гарлаа');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp") {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          notify.error('Алдаа', 'Файлын хэмжээ 5MB-аас хэтрэхгүй байх ёстой');
          return;
        }
        
        setProfileImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        notify.error('Алдаа', 'Зөвхөн PNG, JPEG эсвэл WebP формат зөвшөөрөгдөнө');
      }
    }
  };

  return (
    <div className="bg-white font-sans flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left mt-36">
            Хүргэлтийн жолооч болон
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-8">
            Мерчантын бүртгэл
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-8 mt-8">
            <button
              type="button"
              onClick={() => setRegistrationType("restaurant")}
              className={`flex-1 py-3 px-6 rounded-[12px] font-medium transition-colors ${
                registrationType === "restaurant"
                  ? "bg-mainGreen text-white"
                  : "bg-white text-mainGreen border border-mainGreen hover:bg-gray-50"
              }`}
            >
              Хоолны газар, ресторан
            </button>
            <button
              type="button"
              onClick={() => setRegistrationType("driver")}
              className={`flex-1 py-3 px-6 rounded-[12px] font-medium transition-colors ${
                registrationType === "driver"
                  ? "bg-mainGreen text-white"
                  : "bg-white text-mainGreen border border-mainGreen hover:bg-gray-50"
              }`}
            >
              Хүргэлтийн ажилтан
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 mt-18">
            {registrationType === "restaurant" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-center mb-2">
                    Байгууллагын нэр <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Ресторан нэр"
                    required
                    className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-center mb-2">
                      Утасны дугаар <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="70117011"
                      required
                      maxLength={8}
                      className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-center mb-2">
                      Цахим шуудан
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@example.mn"
                      className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-center mb-2">
                    Албан ёсны хаяг
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="СХД-ийн 3-р хороо..."
                    className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-center mb-2">
                    Google Maps координат
                  </label>
                  <input
                    type="text"
                    name="coordinates"
                    value={formData.coordinates}
                    onChange={handleChange}
                    placeholder="47.918, 106.917"
                    className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Google Maps дээр байршилаа сонгоод coordinate-ийг хуулна уу
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-center mb-2">
                    Нэмэлт мэдээлэл
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    placeholder="Ресторантай холбоотой нэмэлт мэдээлэл..."
                    rows={4}
                    className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen resize-none"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-center mb-2">
                      Овог <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Овог"
                      required
                      className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-center mb-2">
                      Нэр <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Нэр"
                      required
                      className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-center mb-2">
                      Утасны дугаар <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="70117011"
                      required
                      maxLength={8}
                      className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-center mb-2">
                      Цахим шуудан
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@example.mn"
                      className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-center mb-2">
                      Тээврийн хэрэгслийн төрөл
                    </label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen bg-white"
                    >
                      <option value="">Сонгох</option>
                      <option value="motorcycle">Мотоцикл</option>
                      <option value="car">Автомашин</option>
                      <option value="bicycle">Дугуй</option>
                      <option value="scooter">Скутер</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-center mb-2">
                      Улсын дугаар
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      placeholder="0000 УБА"
                      className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-center mb-2">
                      Жолооны үнэмлэх №
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="А00000000"
                      className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-center mb-2">
                    Нэмэлт мэдээлэл
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    placeholder="Хүргэлтийн туршлага, ур чадвар..."
                    rows={4}
                    className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen resize-none"
                  />
                </div>

                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-center mb-2">
                    Жолооны үнэмлэхний зураг
                  </label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profileImage"
                  />
                  <label
                    htmlFor="profileImage"
                    className="w-[200px] h-[125px] flex flex-col items-center justify-center border-2 border-dashed border-[#D8D9D7] rounded-[12px] text-center text-gray-400 text-xs cursor-pointer hover:bg-gray-50 hover:border-mainGreen transition-colors overflow-hidden"
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span>PNG, JPEG эсвэл WebP</span>
                        <span className="text-[10px] mt-1">Хамгийн ихдээ 5MB</span>
                      </>
                    )}
                  </label>
                  {profileImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfileImage(null);
                        setProfileImageFile(null);
                      }}
                      className="mt-2 text-sm text-red-500 hover:text-red-700"
                    >
                      Зураг устгах
                    </button>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-mainGreen text-white py-4 mb-36 rounded-[12px] font-medium 
                transition-colors flex items-center justify-center gap-2
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-600'}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" cy="12" r="10" 
                      stroke="currentColor" strokeWidth="4" fill="none"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Илгээж байна...
                </>
              ) : (
                'Хүсэлт илгээх'
              )}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
