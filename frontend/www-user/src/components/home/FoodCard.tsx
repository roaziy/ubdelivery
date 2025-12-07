export default function FoodCard() {
const foodItems = [
    { id: 1, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, rating: 32 },
    { id: 2, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, rating: 32 },
    { id: 3, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, rating: 32 },
    { id: 4, name: "Хүн аймар гоё пицза, Хүн аймар гоё пицза", restaurant: "Pizzahut mongolia", price: 35000, rating: 32 },
];

    return (
        <>
            {foodItems.map((item) => (
                <div 
                    key={item.id} 
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                    <div className="relative h-32 md:h-36 bg-gray-400">
                        <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                            ⭐ {item.rating}
                        </div>
                    </div>
                    <div className="p-3">
                        <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.name}</h3>
                        <p className="text-mainGreen text-xs mb-2">{item.restaurant}</p>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">₮{item.price.toLocaleString()}</span>
                            <button className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:border-mainGreen transition-colors">
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}