'use client'

import { ReactNode } from 'react';

// Base skeleton component with animation
export function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div 
            className={`animate-pulse bg-gray-200 rounded ${className}`}
        />
    );
}

// Food card skeleton
export function FoodCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <Skeleton className="h-32 md:h-36 rounded-none" />
            <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-3" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-8 w-8 rounded" />
                </div>
            </div>
        </div>
    );
}

// Restaurant card skeleton
export function RestaurantCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="relative">
                <Skeleton className="h-24 md:h-28 rounded-t-xl rounded-b-none" />
                <div className="absolute -bottom-2 left-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                </div>
            </div>
            <div className="pt-4 pb-4 px-4">
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-3" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-12" />
                </div>
            </div>
        </div>
    );
}

// Deal card skeleton
export function DealCardSkeleton() {
    return (
        <div className="bg-gray-200 rounded-xl p-4 md:p-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2 bg-gray-300" />
                    <Skeleton className="h-4 w-24 bg-gray-300" />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Skeleton className="h-6 w-16 rounded-full bg-gray-300" />
                    <Skeleton className="h-8 w-20 rounded-full bg-gray-300" />
                </div>
            </div>
        </div>
    );
}

// Order card skeleton
export function OrderCardSkeleton() {
    return (
        <div className="border-b border-gray-100 pb-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            </div>
            <div className="flex gap-3 mt-4">
                <Skeleton className="flex-1 h-12 rounded-xl" />
                <Skeleton className="flex-1 h-12 rounded-xl" />
            </div>
        </div>
    );
}

// Cart item skeleton
export function CartItemSkeleton() {
    return (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-6 h-6" />
                <Skeleton className="w-8 h-8 rounded-full" />
            </div>
        </div>
    );
}

// Category skeleton (single item)
export function CategorySkeleton() {
    return (
        <Skeleton className="h-10 w-24 rounded-full" />
    );
}

// Category filter skeleton
export function CategoryFilterSkeleton() {
    return (
        <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
            {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
        </div>
    );
}

// Search bar skeleton
export function SearchBarSkeleton() {
    return (
        <div className="flex justify-center mb-8">
            <Skeleton className="h-12 w-full max-w-[500px] rounded-full" />
        </div>
    );
}

// Settings form skeleton
export function SettingsFormSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-12 w-full rounded-full" />
            </div>
            <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-12 w-full rounded-full" />
            </div>
            <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-12 w-full rounded-full" />
            </div>
            <div className="pt-4">
                <Skeleton className="h-12 w-full rounded-full" />
            </div>
        </div>
    );
}

// Hero banner skeleton
export function HeroBannerSkeleton() {
    return (
        <Skeleton className="w-full h-48 md:h-64 rounded-2xl mb-8" />
    );
}

// Full page loading skeleton
export function PageLoadingSkeleton({ children }: { children?: ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-backgroundGreen">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-mainGreen border-t-transparent rounded-full animate-spin" />
                {children || <p className="text-gray-500 text-sm">Уншиж байна...</p>}
            </div>
        </div>
    );
}

// Inline loading spinner
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };
    
    return (
        <div className={`${sizeClasses[size]} border-mainGreen border-t-transparent rounded-full animate-spin`} />
    );
}

// Grid skeleton wrapper
export function FoodGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(count)].map((_, i) => (
                <FoodCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function RestaurantGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(count)].map((_, i) => (
                <RestaurantCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function DealGridSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(count)].map((_, i) => (
                <DealCardSkeleton key={i} />
            ))}
        </div>
    );
}
