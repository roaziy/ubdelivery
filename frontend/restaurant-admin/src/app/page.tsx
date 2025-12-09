import Image from "next/image";
import LoginForm from "@/components/login/LoginForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Image 
            src="/logos/logo.svg" 
            alt="UB Delivery Admin Panel" 
            width={200} 
            height={50}
            className="mx-auto mb-1 select-none"
            draggable={false}
          />
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold mb-8 select-none" draggable={false}>Нэвтрэх</h1>

        {/* Login Form */}
        <LoginForm />
      </main>
    </div>
  );
}
