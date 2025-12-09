'use client'

import { useState, useEffect } from "react";
import { Deal } from "@/lib/types";
import { DealService } from "@/lib/api";
import { mockDeals, simulateDelay } from "@/lib/mockData";
import { DealCardSkeleton } from "@/components/ui/Skeleton";
import { useNotifications } from "@/components/ui/Notification";
import DealDetailModal from "./DealDetailModal";

export default function TodaysDeal() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const notify = useNotifications();

    useEffect(() => {
        const fetchDeals = async () => {
            setLoading(true);
            try {
                const response = await DealService.getActive();
                if (response.success && response.data) {
                    setDeals(response.data);
                } else {
                    await simulateDelay(800);
                    setDeals(mockDeals as Deal[]);
                }
            } catch (error) {
                console.error('Failed to fetch deals:', error);
                await simulateDelay(800);
                setDeals(mockDeals as Deal[]);
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    const handleDealClick = (deal: Deal) => {
        setSelectedDeal(deal);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDeal(null);
    };

    const handleOrderDeal = (deal: Deal) => {
        // Add deal to cart logic
        notify.success('Сагсанд нэмэгдлээ', `${deal.title} сагсанд нэмэгдлээ`);
        handleCloseModal();
    };

    if (loading) {
        return (
            <>
                {[...Array(3)].map((_, i) => (
                    <DealCardSkeleton key={i} />
                ))}
            </>
        );
    }

    return (
        <>
            {deals.map((deal) => (
                <div 
                    key={deal.id} 
                    onClick={() => handleDealClick(deal)}
                    className="bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl p-4 md:p-6 text-white flex items-center justify-between cursor-pointer hover:from-gray-700 hover:to-gray-600 transition-all"
                >
                    <div>
                        <h3 className="font-semibold text-base md:text-lg mb-1">{deal.title}</h3>
                        <p className="text-sm text-gray-200">{deal.subtitle}</p>
                        {deal.validUntil && (
                            <p className="text-xs text-gray-300 mt-1">{deal.validUntil}</p>
                        )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-medium bg-neutral-400/30 backdrop-blur-3xl px-2 py-0.5 rounded-full">{deal.discount}</span>
                        <div className="text-right">
                            {deal.originalPrice && deal.discountedPrice && (
                                <div className="text-xs">
                                    <span className="line-through text-gray-300">₮{deal.originalPrice.toLocaleString()}</span>
                                    <span className="ml-2 font-bold text-white">₮{deal.discountedPrice.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOrderDeal(deal);
                            }}
                            className="bg-mainGreen text-white text-xs px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                        >
                            Захиалах
                        </button>
                    </div>
                </div>
            ))}

            {/* Deal Detail Modal */}
            <DealDetailModal 
                deal={selectedDeal}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}