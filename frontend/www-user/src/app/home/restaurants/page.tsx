import HeaderHomeTopper from "@/components/home/header/headerHomeTopper"
import HeaderHomeBottom from "@/components/home/header/headerHomeBottom"
import FooterHome from "@/components/home/footerHome"


export default function RestaurantsPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <HeaderHomeTopper />
            <HeaderHomeBottom />
            <FooterHome />
        </div>
    )
}