'use client'

import { useState, useCallback, useEffect } from "react";
import { useReviews } from "@/lib/hooks";
import ReviewCard from "./ReviewCard";
import Pagination from "@/components/ui/Pagination";
import { SkeletonReviewCard } from "@/components/ui/Skeleton";
import { IoSearch, IoRefresh } from "react-icons/io5";
import { MdCalendarToday } from "react-icons/md";

interface ReviewsContentProps {
  initialPage?: number;
}

export default function ReviewsContent({ 
  initialPage = 1 
}: ReviewsContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [dateFilter, setDateFilter] = useState<string>("");

  const { 
    reviews, 
    pagination, 
    loading, 
    error, 
    fetchReviews 
  } = useReviews();

  // Fetch reviews on mount and page change
  useEffect(() => {
    fetchReviews({ page: currentPage, limit: 10 });
  }, [fetchReviews, currentPage]);

  const handleRefresh = useCallback(() => {
    fetchReviews({ page: currentPage, limit: 10 });
  }, [fetchReviews, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  // Filter reviews client-side (for search)
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = !searchQuery || 
      review.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.userName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Skeleton loading state
  if (loading) {
    return (
      <div>
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-12 w-64 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Reviews grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonReviewCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-red-500 mb-4 text-lg">
          Алдаа гарлаа: {error}
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-6 py-3 
            bg-mainGreen text-white rounded-xl 
            hover:bg-green-600 transition-colors"
        >
          <IoRefresh size={18} />
          Дахин оролдох
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-mainBlack">
          Хэрэглэгчдийн сэтгэгдлүүд
        </h1>
        
        <div className="flex items-center gap-3">
          {/* Refresh button */}
          <button 
            onClick={handleRefresh}
            className="p-3 border bg-white border-gray-200 rounded-xl 
              hover:bg-gray-50 transition-colors"
            title="Шинэчлэх"
          >
            <IoRefresh size={18} />
          </button>

          {/* Search */}
          <div className="relative">
            <IoSearch 
              className="absolute left-4 top-1/2 -translate-y-1/2 
                text-gray-400" 
              size={18} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Order ID - аар хайх"
              className="w-[250px] pl-11 pr-4 py-3 
                border bg-white border-gray-200 rounded-xl 
                text-sm outline-none focus:border-mainGreen 
                transition-colors"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="opacity-0 absolute inset-0 w-full h-full 
                cursor-pointer"
            />
            <button 
              className="p-3 border bg-white border-gray-200 rounded-xl 
                hover:bg-gray-50 transition-colors"
            >
              <MdCalendarToday size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filteredReviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-gray-400 mb-2 text-lg">
            Сэтгэгдэл олдсонгүй
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="text-mainGreen hover:underline"
            >
              Хайлтыг цэвэрлэх
            </button>
          )}
        </div>
      )}

      {/* Reviews Grid */}
      {filteredReviews.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                onViewDetails={() => {
                  // TODO: Open order details modal or navigate
                  console.log("View details:", review.orderId);
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages || 5}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
