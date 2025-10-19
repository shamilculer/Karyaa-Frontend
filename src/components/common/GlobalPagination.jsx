"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination"; // Ensure this path is correct

/**
 * GlobalPagination component for any paginated resource.
 * It reads the current page from the URL and constructs the navigation UI.
 * @param {number} totalPages - The total number of pages available.
 * @param {number} currentPage - The currently active page number.
 * @param {string} pageQueryKey - The name of the query parameter used for the page (default: 'page').
 */
export function GlobalPagination({ totalPages, currentPage, pageQueryKey = 'page' }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    // Function to navigate to a new page
    const goToPage = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        
        // Create a new URLSearchParams object based on the current search params
        const params = new URLSearchParams(searchParams.toString());
        
        // Use the dynamic pageQueryKey
        params.set(pageQueryKey, pageNumber.toString());

        // Update the URL (e.g., /blogs?page=2)
        router.push(`?${params.toString()}`, { scroll: true });
    };

    // Helper to generate a visible range of page numbers (e.g., 1, 2, 3, ..., 10)
    const renderPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5; // Total max page buttons to display
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // Adjust start if we've clipped the end
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push('ellipsis-start');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push('ellipsis-end');
            pages.push(totalPages);
        }

        return pages.filter((value, index, self) => 
            // Ensure unique number values
            typeof value === 'number' ? self.indexOf(value) === index : true
        ).map((item, index) => (
            <PaginationItem key={index}>
                {item === 'ellipsis-start' || item === 'ellipsis-end' ? (
                    <PaginationEllipsis />
                ) : (
                    <PaginationLink 
                        isActive={item === currentPage}
                        onClick={() => typeof item === 'number' && goToPage(item)}
                    >
                        {item}
                    </PaginationLink>
                )}
            </PaginationItem>
        ));
    };

    return (
        <Pagination className="mt-12">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious 
                        onClick={() => goToPage(currentPage - 1)}
                        aria-disabled={currentPage === 1}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>
                
                {renderPageNumbers()}

                <PaginationItem>
                    <PaginationNext 
                        onClick={() => goToPage(currentPage + 1)}
                        aria-disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}