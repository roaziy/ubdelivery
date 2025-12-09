import FooterHome from "@/components/home/footerHome";
import HeaderHomeTopper from "@/components/home/header/headerHomeTopper";
import HeaderHomeBottom from "@/components/home/header/headerHomeBottom";

import HeroBanner from "@/components/home/HeroBanner";
import FoodCategoryFilter from "@/components/home/FoodSection/FoodCategoryFilter";
import FoodSection from "@/components/home/FoodSection/FoodSection";
import TodaysDeal from "@/components/home/TodaysDeal/TodaysDeal";
import RestaurantCard from "@/components/home/restaurant/RestaurantCard";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-backgroundGreen flex flex-col">
            {/* Desktop Header */}
            <HeaderHomeTopper />
            {/* Mobile Header Placeholder */}
            <HeaderHomeBottom />

            {/* Main Content */}
            <main className="flex-1 pt-20 md:pt-24">
                <div className="container max-w-[1250px] mx-auto px-4">
                    {/* Hero Banner */}
                    <HeroBanner />

                    {/* Food Categories */}
                    <section className="mb-8">
                        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">Хоолны ангилалууд</h2>
                        <FoodCategoryFilter />
                    </section>

                    {/* Food Items Grid */}
                    <FoodSection />

                    {/* Today's Deals */}
                    <section className="mt-4 mb-16">
                        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">Өнөөдрийн хямдрал</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <TodaysDeal />
                        </div>
                    </section>

                    {/* Featured Restaurants */}
                    <section className="mb-8">
                        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">Онцлох ресторанууд</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <RestaurantCard />
                        </div>
                        <div className="flex justify-center mt-6">
                            <a 
                                href="/home/restaurants"
                                className="px-6 py-2 border border-mainGreen text-mainGreen rounded-full text-sm hover:bg-mainGreen hover:text-white transition-colors mb-16"
                            >
                                Бүгдийг харах
                            </a>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <FooterHome />
        </div>
    );
}
