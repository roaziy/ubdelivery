"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoLocationSharp } from "react-icons/io5";

export default function LocationSearchInput() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError("");
    
    if (!navigator.geolocation) {
      setError("Таны хөтөч байршил тодорхойлохыг дэмждэггүй байна");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=mn`
          );
          const data = await response.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          setLocation(address);
        } catch {
          setLocation(`${latitude}, ${longitude}`);
        }
        setIsLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Байршил авах зөвшөөрөл олгоогүй байна");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Байршил тодорхойлох боломжгүй байна");
            break;
          case err.TIMEOUT:
            setError("Байршил авах хугацаа дууссан");
            break;
          default:
            setError("Байршил авахад алдаа гарлаа");
        }
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearch = () => {
    if (!location.trim()) {
      setError("Хаягаа оруулна уу");
      return;
    }
    // Store location in localStorage for later use
    localStorage.setItem("deliveryLocation", location);
    router.push("/login");
  };

  return (
    <div>
      <div className="flex items-center bg-white border-1 border-gray-300 rounded-full py-[2px] overflow-hidden max-w-md">
        <button 
          onClick={getCurrentLocation}
          className="flex items-center pl-4 pr-2 hover:opacity-70 transition-opacity"
          title="Одоогийн байршлыг авах"
          disabled={isLoading}
        >
          <IoLocationSharp className={`${isLoading ? 'text-mainGreen animate-pulse' : 'text-[#848484]'}`} size={20} />
        </button>
        <input 
          type="text" 
          onClick={getCurrentLocation}
          placeholder="Хүргэлт хийх хаяг" 
          className="flex-1 py-3 px-2 outline-none text-sm select-none"
          draggable={false}
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setError("");
          }}
        />
        <button 
          onClick={handleSearch}
          className="bg-mainGreen text-white px-6 py-2 mr-2 rounded-full hover:bg-green-600 transition-colors font-medium text-sm select-none" 
          draggable={false}
        >
          Хайх
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2 ml-4">{error}</p>
      )}
    </div>
  );
}
