const deals = [
    { id: 1, title: "Нэгийн үнээр хоёрыг", subtitle: "Энэхүү хүн аймар гоё", discount: "20% off" },
    { id: 2, title: "Нэгийн үнээр хоёрыг", subtitle: "Энэхүү хүн аймар гоё", discount: "20% off" },
    { id: 3, title: "Нэгийн үнээр хоёрыг", subtitle: "Энэхүү хүн аймар гоё", discount: "20% off" },
];

export default function TodaysDeal() {
    return (
        <>
            {deals.map((deal) => (
                <div 
                    key={deal.id} 
                    className="bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl p-4 md:p-6 text-white flex items-center justify-between"
                >
                    <div>
                        <h3 className="font-semibold text-base md:text-lg mb-1">{deal.title}</h3>
                        <p className="text-sm text-gray-200">{deal.subtitle}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-medium">{deal.discount}</span>
                        <button className="bg-mainGreen text-white text-xs px-4 py-2 rounded-full hover:bg-green-600 transition-colors">
                            Захиалах
                        </button>
                    </div>
                </div>
            ))}
        </>
    )
}