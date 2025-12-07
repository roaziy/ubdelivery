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
                <div 
                    key={restaurant.id} 
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                    <div className="h-24 md:h-28 bg-gray-300"></div>
                    <div className="p-3">
                        <h3 className="font-semibold text-sm mb-1 select-none">{restaurant.name}</h3>
                        <p className="text-gray-500 text-xs mb-2 select-none">{restaurant.type}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1 select-none">
                                <FaRegClock size={12} />
                                <span>{restaurant.hours}</span>
                            </div>
                            <div className="flex items-center gap-1 text-mainGreen select-none">
                                <FaStar />
                                <span>{restaurant.rating}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}