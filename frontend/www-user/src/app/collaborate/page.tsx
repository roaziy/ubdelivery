"use client"

import { useState } from "react";
import Header from "@/components/LandingPage/header/header";
import Footer from "@/components/LandingPage/footer/footer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface SubmitResult {
  success: boolean;
  message?: string;
}

export default function Collaborate() {
  const [registrationType, setRegistrationType] = useState<"restaurant" | "driver">("restaurant");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [formData, setFormData] = useState({
    businessName: "",
    phoneNumber: "",
    businessPhoneNumber: "",
    email: "",
    address: "",
    coordinates: "",
    additionalInfo: "",
    firstName: "",
    lastName: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const formDataToSend = new FormData();

      if (registrationType === "restaurant") {
        formDataToSend.append('name', formData.businessName);
        formDataToSend.append('phone', formData.phoneNumber);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('message', formData.additionalInfo);
      } else {
        const fullName = `${formData.lastName} ${formData.firstName}`.trim();
        formDataToSend.append('name', fullName);
        formDataToSend.append('phone', formData.phoneNumber);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('message', formData.additionalInfo);
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
        setSubmitResult({ 
          success: true, 
          message: 'Таны хүсэлт амжилттай илгээгдлээ! Бид тантай удахгүй холбогдоно.' 
        });
        // Reset form
        setFormData({
          businessName: "",
          phoneNumber: "",
          businessPhoneNumber: "",
          email: "",
          address: "",
          coordinates: "",
          additionalInfo: "",
          firstName: "",
          lastName: ""
        });
        setProfileImage(null);
        setProfileImageFile(null);
      } else {
        setSubmitResult({ 
          success: false, 
          message: data.message || 'Хүсэлт илгээхэд алдаа гарлаа' 
        });
      }
    } catch {
      setSubmitResult({ 
        success: false, 
        message: 'Сервертэй холбогдоход алдаа гарлаа' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "image/png" || file.type === "image/jpeg") {
        setProfileImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Зөвхөн PNG эсвэл JPEG формат зөвшөөрөгдөнө");
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
                    Байгууллагын нэр
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName || ""}
                    onChange={handleChange}
                    placeholder="ubdelivery.xyz"
                    className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-center  mb-2">
                      Утасны дугаар
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleChange}
                      placeholder="70117011"
                      className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-center  mb-2">
                      Цахим шуудан
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      placeholder="contact@ubdelivery.xyz"
                      className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-center  mb-2">
                    Албан ёсны хаяг
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    placeholder="СХД-ийн 3-р хороо..."
                    className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-center  mb-2">
                    Google Maps аарын coordinate
                  </label>
                  <input
                    type="text"
                    name="coordinates"
                    value={formData.coordinates || ""}
                    onChange={handleChange}
                    placeholder="47°55'04.4&quot;N 106°56'11.7&quot;E"
                    className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-center  mb-2">
                    Нэмэлт мэдээлэл
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo || ""}
                    onChange={handleChange}
                    placeholder="Нэмэлт мэдээлэл"
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
                      Таны овог
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ""}
                      onChange={handleChange}
                      placeholder="Овог"
                      className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-center mb-2">
                      Таны нэр
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ""}
                      onChange={handleChange}
                      placeholder="Нэр"
                      className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-center mb-2">
                      Утасны дугаар
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleChange}
                      placeholder="70117011"
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
                      value={formData.email || ""}
                      onChange={handleChange}
                      placeholder="contact@ubdelivery.xyz"
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
                    value={formData.additionalInfo || ""}
                    onChange={handleChange}
                    placeholder="Нэмэлт мэдээлэл"
                    rows={4}
                    className="w-full px-4 py-3 border border-[#D8D9D7] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-mainGreen resize-none"
                  />
                </div>

                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-center mb-2">
                    Профайл зураг байршуулах
                  </label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profileImage"
                  />
                  <label
                    htmlFor="profileImage"
                    className="w-[125px] h-[125px] flex flex-col items-center justify-center border border-[#D8D9D7] rounded-[12px] text-center text-gray-400 text-xs cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        512x512px PNG<br />
                        эсвэл JPEG
                      </>
                    )}
                  </label>
                </div>
              </>
            )}

            {submitResult && (
              <div className={`p-4 rounded-[12px] text-center ${
                submitResult.success 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                {submitResult.message}
              </div>
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