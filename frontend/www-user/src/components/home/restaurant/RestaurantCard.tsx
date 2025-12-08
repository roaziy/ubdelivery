import Link from "next/link";
import { FaRegClock } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

const restaurants = [
    { id: 1, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 2, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 3, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
    { id: 4, name: "Modern Nomads", type: "Монгол уламжлалт хоол", hours: "09:00 - 20:00", rating: 5 },
];

export default function RestaurantCard() {
    return (
        <>
            {restaurants.map((restaurant) => (
                <Link 
                    key={restaurant.id}
                    href={`/home/restaurants/${restaurant.id}`}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer block"
                >
                    <div className="relative">
                        <div className="h-24 md:h-28 bg-gray-300 rounded-t-xl"></div>
                        <div className="absolute -bottom-2 left-4 bg-white w-12 h-12 border border-gray-200 rounded-xl"></div>
                    </div>
                    <div className="pt-4 pb-4 px-4">
                        <h3 className="font-semibold text-base mb-0 select-none">{restaurant.name}</h3>
                        <p className="text-gray-500 text-[12px] mb-1 select-none">{restaurant.type}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-1.5 select-none">
                                <FaRegClock size={14} />
                                <span>{restaurant.hours}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-mainGreen select-none">
                                <FaStar size={14} />
                                <span>{restaurant.rating}</span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </>
    )
}