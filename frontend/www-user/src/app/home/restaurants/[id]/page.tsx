import HeaderHomeTopper from "@/components/home/header/headerHomeTopper";
import HeaderHomeBottom from "@/components/home/header/headerHomeBottom";
import FooterHome from "@/components/home/FoodSection/footerHome";
import RestaurantProfile from "@/components/home/restaurant/RestaurantProfile";
import RestaurantFoodSection from "@/components/home/restaurant/RestaurantFoodSection";

// Sample restaurant data - in production this would come from a database
const restaurantsData: Record<string, {
    id: number;
    name: string;
    type: string;
    hours: string;
    rating: number;
    reviews: number;
    distance: string;
    phone: string;
    email: string;
}> = {
    "1": { id: 1, name: "The Modern Nomads", type: "Монгол уламжлалт хоол", hours: "21:30 цаг хүртэл", rating: 1.4, reviews: 1, distance: "0.20 км", phone: "+976 9999 9999", email: "info@modernnomads.mn" },
    "2": { id: 2, name: "The Modern Nomads", type: "Монгол уламжлалт хоол", hours: "21:30 цаг хүртэл", rating: 1.4, reviews: 1, distance: "0.20 км", phone: "+976 9999 9999", email: "info@modernnomads.mn" },
    "3": { id: 3, name: "The Modern Nomads", type: "Монгол уламжлалт хоол", hours: "21:30 цаг хүртэл", rating: 1.4, reviews: 1, distance: "0.20 км", phone: "+976 9999 9999", email: "info@modernnomads.mn" },
    "4": { id: 4, name: "The Modern Nomads", type: "Монгол уламжлалт хоол", hours: "21:30 цаг хүртэл", rating: 1.4, reviews: 1, distance: "0.20 км", phone: "+976 9999 9999", email: "info@modernnomads.mn" },
};

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function RestaurantDetailPage({ params }: PageProps) {
    const { id } = await params;
    const restaurant = restaurantsData[id] || restaurantsData["1"];

    return (
        <div className="min-h-screen bg-backgroundGreen flex flex-col">
            <HeaderHomeTopper />
            <HeaderHomeBottom />

            <main className="flex-1 pt-20 md:pt-24">
                <div className="container max-w-[1250px] mx-auto px-4">
                    {/* Restaurant Profile */}
                    <RestaurantProfile restaurant={restaurant} />

                    {/* Restaurant Foods */}
                    <RestaurantFoodSection restaurantName={restaurant.name} />
                </div>
            </main>

            <FooterHome />
        </div>
    );
}
