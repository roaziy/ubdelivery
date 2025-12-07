import Header from "@/components/LandingPage/header/header";
import Footer from "@/components/LandingPage/footer/footer";

export default function terms() {
  return (
    <div className="bg-white font-sans flex flex-col min-h-screen">
      <Header />
      <main className="flex h-screen">
        <p className="mt-20 text-lg">Terms and Conditions of UB Delivery</p>
      </main>
      <Footer />
    </div>
  );
}