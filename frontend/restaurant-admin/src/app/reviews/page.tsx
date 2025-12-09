'use client'

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ReviewCard, { Review } from "@/components/reviews/ReviewCard";
import Pagination from "@/components/ui/Pagination";
import { IoSearch } from "react-icons/io5";
import { MdCalendarToday } from "react-icons/md";

// Mock data
const mockReviews: Review[] = [
    {
        id: "1",
        orderId: "#3078",
        customerName: "Батаа Батцэцэг",
        date: "2025-10-31, 10:25:32",
        rating: 4.5,
        reviewText: "Үдийн хоолонд халуун ногоотой тахианы махан аяга захиалсан бөгөөд үнэхээр гайхалтай байсан - ирэхэд халуун хэвээрээ байсан бөгөөд будаа нь төгс хөвсгөр байсан. Жолооч хоёр минутын зайтай байхад мессеж бичиж, миний асуусанчлан үүдэнд үлдээсэн. Сав баглаа боодол нь найдвартай (гоожоогүй!), үнийн хувьд порц нь хангалттай байсан. Бага зэрэг гомдол: кимчи жаахан норсон байсан ч ерөнхийдөө 5/5 байсан - дахин захиална."
    },
    {
        id: "2",
        orderId: "#3078",
        customerName: "Батаа Батцэцэг",
        date: "2025-10-31, 10:25:32",
        rating: 4.5,
        reviewText: "Өнгөрсөн шөнө цагаан хоолны бүргэрын хослолыг авлаа - маш амттай! Шарсан төмс нь шаржигнуур хэвээр байсан бөгөөд бүргэр нь гайхалтай утаатай амттай байв. Хүргэлт төлөвлөснөөс 10 минутын өмнө ирсэн бөгөөд жолооч нь үнэхээр зөлгэ байсан. Ганцхан сул тал нь: тэд миний хүссэн нэмэлт кетчупыг мартсан ч тийм ч том асуудал биш. Сүүлийн үед миний мэдэрсэн хамгийн сайхан хүргэлтийн туршлагуудын нэг нь гарцаагүй."
    },
    {
        id: "3",
        orderId: "#3078",
        customerName: "Батаа Батцэцэг",
        date: "2025-10-31, 10:25:32",
        rating: 4.5,
        reviewText: "Үдийн хоолонд халуун ногоотой тахианы махан аяга захиалсан бөгөөд үнэхээр гайхалтай байсан - ирэхэд халуун хэвээрээ байсан бөгөөд будаа нь төгс хөвсгөр байсан. Жолооч хоёр минутын зайтай байхад мессеж бичиж, миний асуусанчлан үүдэнд үлдээсэн."
    },
    {
        id: "4",
        orderId: "#3078",
        customerName: "Батаа Батцэцэг",
        date: "2025-10-31, 10:25:32",
        rating: 4.5,
        reviewText: "Өнгөрсөн шөнө цагаан хоолны бүргэрын хослолыг авлаа - маш амттай! Шарсан төмс нь шаржигнуур хэвээр байсан бөгөөд бүргэр нь гайхалтай утаатай амттай байв."
    },
];

export default function ReviewsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredReviews = mockReviews.filter(review => 
        review.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-mainBlack">Хэрэглэгчдийн сэтгэгдлүүд</h1>
                
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Order ID - аар хайх"
                            className="w-[250px] pl-11 pr-4 py-3 border bg-white border-gray-200 rounded-xl text-sm outline-none focus:border-mainGreen transition-colors"
                        />
                    </div>

                    {/* Date Filter */}
                    <button className="p-3 border bg-white border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <MdCalendarToday size={18} />
                    </button>
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-2 gap-6">
                {filteredReviews.map(review => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        onViewDetails={() => console.log("View details:", review.orderId)}
                    />
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={setCurrentPage}
            />
        </DashboardLayout>
    );
}
