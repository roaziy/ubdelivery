import HeaderHomeTopper from "@/components/home/header/headerHomeTopper"
import HeaderHomeBottom from "@/components/home/header/headerHomeBottom"
import FooterHome from "@/components/home/FoodSection/footerHome"
import RestaurantsSection from "@/components/home/restaurant/RestaurantsSection"

export default function RestaurantsPage() {
    return (
        <div className="min-h-screen bg-backgroundGreen flex flex-col">
            <HeaderHomeTopper />
            <HeaderHomeBottom />

            <main className="flex-1 pt-20 md:pt-24">
                <div className="container max-w-[1250px] mx-auto px-4">
                    <RestaurantsSection />
                </div>
            </main>

            <FooterHome />
        </div>
    )
}