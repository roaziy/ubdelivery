'use client'

import { useState } from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalResults?: number;
    showingResults?: number;
}

export default function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange,
    totalResults,
    showingResults 
}: PaginationProps) {
    const maxVisiblePages = 3;
    
    const getVisiblePages = () => {
        const pages: number[] = [];
        let start = Math.max(1, currentPage - 1);
        const end = Math.min(totalPages, start + maxVisiblePages - 1);
        
        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    return (
        <div className="flex items-center justify-between mt-8">
            {/* Results info */}
            {totalResults !== undefined && showingResults !== undefined && (
                <p className="text-sm text-gray-500">
                    Showing {showingResults} of {totalResults} results
                </p>
            )}
            
            {/* Pagination controls */}
            <div className={`flex items-center gap-2 ${totalResults === undefined ? 'mx-auto' : ''}`}>
                <button 
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm text-gray-500 hover:text-mainBlack disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    &lt; Previous
                </button>
                
                {getVisiblePages().map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-8 h-8 rounded-full text-sm transition-colors ${
                            currentPage === page 
                                ? 'bg-mainGreen text-white font-medium' 
                                : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        {page}
                    </button>
                ))}
                
                {totalPages > maxVisiblePages && currentPage < totalPages - 1 && (
                    <span className="text-gray-400">...</span>
                )}
                
                <button 
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm text-gray-500 hover:text-mainBlack disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next &gt;
                </button>
            </div>
        </div>
    );
}
