import HeaderHomeTopper from "@/components/home/header/headerHomeTopper"
import HeaderHomeBottom from "@/components/home/header/headerHomeBottom"
import FooterHome from "@/components/home/footerHome"
import CartSection from "@/components/home/cart/ReturnCartSection"

export default function CartPage() {
    return (
        <div className="min-h-screen bg-backgroundGreen flex flex-col">
            <HeaderHomeTopper />
            <HeaderHomeBottom />

            <main className="flex-1 pt-20 md:pt-24 pb-8">
                <div className="container max-w-[700px] mx-auto px-4">
                    <CartSection />
                </div>
            </main>

            <FooterHome />
        </div>
    )
}
