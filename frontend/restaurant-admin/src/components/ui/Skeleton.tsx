'use client'

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div 
            className={`animate-pulse bg-gray-200 rounded ${className}`} 
        />
    );
}

// Card Skeleton
export function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-16" />
        </div>
    );
}

// Stats Card Skeleton
export function StatCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <Skeleton className="h-4 w-28 mb-3" />
            <Skeleton className="h-9 w-40 mb-3" />
            <Skeleton className="h-4 w-16" />
        </div>
    );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <tr className="border-b border-gray-100">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="py-3 px-4">
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                </td>
            ))}
        </tr>
    );
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 5 }: { 
    rows?: number; 
    columns?: number 
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-200">
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} className="text-left py-3 px-4">
                                <Skeleton className="h-4 w-20" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <TableRowSkeleton key={i} columns={columns} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Food Card Skeleton
export function FoodCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <Skeleton className="h-36 w-full rounded-none" />
            <div className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <Skeleton className="h-5 w-24 mb-3" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-16 rounded-full" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                </div>
            </div>
        </div>
    );
}

// Order Card Skeleton
export function OrderCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex justify-between mb-3">
                <div>
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="text-right">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-4 w-40" />
                </div>
            </div>
            <div className="my-3 space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="flex gap-3">
                <Skeleton className="h-10 flex-1 rounded-full" />
                <Skeleton className="h-10 flex-1 rounded-full" />
            </div>
        </div>
    );
}

// In Progress Order Card Skeleton
export function InProgressCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
            </div>
            <div className="mb-3 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-full mb-3" />
            <Skeleton className="h-9 w-full rounded-full" />
        </div>
    );
}

// Review Card Skeleton
export function ReviewCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="mb-3">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-9 w-36 rounded-full" />
            </div>
        </div>
    );
}

// Form Input Skeleton
export function InputSkeleton() {
    return (
        <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-12 w-full rounded-xl" />
        </div>
    );
}

// Page Loading Skeleton
export function PageLoadingSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-mainGreen border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500">Уншиж байна...</p>
            </div>
        </div>
    );
}

// Best Selling Food Card Skeleton
export function BestSellingCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <Skeleton className="h-32 w-full rounded-none" />
            <div className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}

// Aliases for convenience
export const SkeletonCard = CardSkeleton;
export const SkeletonStatCard = StatCardSkeleton;
export const SkeletonTable = TableSkeleton;
export const SkeletonOrderCard = OrderCardSkeleton;
export const SkeletonFoodCard = FoodCardSkeleton;
export const SkeletonReviewCard = ReviewCardSkeleton;
export const SkeletonInput = InputSkeleton;
