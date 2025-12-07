"use client"

import { useState } from "react";
import Header from "@/components/LandingPage/header/header";
import Footer from "@/components/LandingPage/footer/footer";

export default function Collaborate() {
  const [registrationType, setRegistrationType] = useState<"restaurant" | "driver">("restaurant");
  const [profileImage, setProfileImage] = useState<string | null>(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission
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

            <button
              type="submit"
              className="w-full bg-mainGreen text-white py-4 mb-36 rounded-[12px] font-medium hover:bg-green-600 transition-colors"
            >
              Хүсэлт илгээх
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}