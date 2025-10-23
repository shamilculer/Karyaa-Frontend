// app/components/CompareTable.jsx

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import the Server Action for client-side fetching
import { getVendorsBySlugs } from "@/app/actions/vendors";

// Import shadcn/ui table components
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Import shadcn/ui Select components
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Carousel } from '@/components/ui/carousel';
import Image from 'next/image';


// --- CONSTANTS & HELPERS ---
const MAX_COMPARISON_SLOTS = 3;

const EMPTY_SLOT = {
    _id: 'empty_id',
    slug: 'empty',
    businessName: 'Select Vendor',
    businessLogo: null,
    averageRating: null,
    reviewCount: null,
    pricingStartingFrom: null,
    address: { city: null, country: null },
    isSponsored: false,
    mainCategory: null,
    serviceAreaCoverage: null,
    gallery: [],
    tagline: null,
};

// Helper to create empty slots
const createEmptySlot = (index) => ({
    ...EMPTY_SLOT,
    _id: `empty_${index}`
});

// --- Main Client Component ---
const CompareTable = ({ initialVendors, vendorOptions }) => {
    const router = useRouter();

    // State initialization: Always maintain exactly 3 slots
    const [compareList, setCompareList] = useState(() => {
        const initialList = [];

        // Add initial vendors (up to 3)
        const validVendors = initialVendors.filter(v => v && v.slug);
        for (let i = 0; i < MAX_COMPARISON_SLOTS; i++) {
            if (i < validVendors.length) {
                initialList.push(validVendors[i]);
            } else {
                initialList.push(createEmptySlot(i));
            }
        }

        return initialList;
    });

    // Track loading state for individual slots
    const [loadingSlots, setLoadingSlots] = useState([false, false, false]);

    // Use useEffect to push the URL after the component has mounted/hydrated
    useEffect(() => {
        updateUrlWithSlugs(compareList);
    }, []); // Run once on mount

    // --- HANDLERS ---

    const updateUrlWithSlugs = useCallback((list) => {
        const slugsToKeep = list
            .filter(v => v.slug !== 'empty')
            .map(v => v.slug)
            .join(',');

        if (slugsToKeep) {
            router.push(`/compare?vendors=${slugsToKeep}`, { scroll: false });
        } else {
            router.push('/compare', { scroll: false });
        }
    }, [router]);

    // Async handler for vendor selection
    const handleVendorSelection = async (newVendorSlug, slotIndex) => {

        // Handle empty/deselect case
        if (newVendorSlug === '' || newVendorSlug === 'empty') {
            setCompareList(prevList => {
                const newList = [...prevList];
                newList[slotIndex] = createEmptySlot(slotIndex);
                updateUrlWithSlugs(newList);
                return newList;
            });
            return;
        }

        // Check for duplicates before fetching
        const isDuplicate = compareList.some((v, idx) =>
            v.slug === newVendorSlug && idx !== slotIndex && v.slug !== 'empty'
        );

        if (isDuplicate) {
            alert('This vendor is already selected in another slot.');
            return;
        }

        // Set loading state for this specific slot
        setLoadingSlots(prev => {
            const newLoading = [...prev];
            newLoading[slotIndex] = true;
            return newLoading;
        });

        try {
            // Fetch the full data for the selected vendor
            const fetchResult = await getVendorsBySlugs([newVendorSlug]);

            if (fetchResult.success && fetchResult.data && fetchResult.data.length > 0) {
                // Successfully fetched vendor data
                const newVendor = fetchResult.data[0];

                setCompareList(prevList => {
                    const newList = [...prevList];
                    newList[slotIndex] = newVendor;
                    updateUrlWithSlugs(newList);
                    return newList;
                });
            } else {
                // Fetch failed - show error and reset to empty
                alert(fetchResult.error || 'Failed to load vendor data');

                setCompareList(prevList => {
                    const newList = [...prevList];
                    newList[slotIndex] = createEmptySlot(slotIndex);
                    return newList;
                });
            }
        } catch (error) {
            console.error('Error fetching vendor:', error);
            alert('An error occurred while loading vendor data');

            setCompareList(prevList => {
                const newList = [...prevList];
                newList[slotIndex] = createEmptySlot(slotIndex);
                return newList;
            });
        } finally {
            // Always clear loading state
            setLoadingSlots(prev => {
                const newLoading = [...prev];
                newLoading[slotIndex] = false;
                return newLoading;
            });
        }
    };

    // --- RENDER ---
    return (
        <div className="comparison-table-wrapper overflow-x-auto border rounded-lg">
            <Table className="min-w-[700px] table-fixed">
                <TableHeader className="bg-gray-50">
                    <TableRow className="hover:bg-gray-50/90">
                        {/* Metrics Column: Fixed width */}
                        <TableHead className="font-bold w-[180px] text-left text-base bg-gray-100">
                            Comparison Metrics
                        </TableHead>
                        {compareList.map((vendor, index) => (
                            <TableHead key={`header-${index}`} className="w-auto text-center border-l bg-gray-100">

                                {/* Select component */}
                                <Select
                                    value={vendor.slug !== 'empty' ? vendor.slug : undefined}
                                    onValueChange={(newVendorSlug) => handleVendorSelection(newVendorSlug, index)}
                                    disabled={loadingSlots[index]}
                                >
                                    <SelectTrigger
                                        className={`w-full text-sm ${loadingSlots[index]
                                            ? 'opacity-50 cursor-wait bg-gray-100'
                                            : 'cursor-pointer hover:border-gray-400'
                                            }`}
                                    >
                                        <SelectValue
                                            placeholder={
                                                loadingSlots[index]
                                                    ? 'Loading...'
                                                    : vendor.businessName
                                            }
                                        />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {/* Option to deselect/clear the slot. Value is 'empty' */}
                                        {vendor.slug !== 'empty' && (
                                            <SelectItem value="empty" className="text-red-500">
                                                Deselect Vendor
                                            </SelectItem>
                                        )}

                                        {/* Map through all vendor options */}
                                        {vendorOptions
                                            .filter(option => {
                                                // Filter out vendors already selected in *other* slots
                                                const isAlreadySelected = compareList.some((v, idx) =>
                                                    v.slug === option.slug && idx !== index && v.slug !== 'empty'
                                                );
                                                return !isAlreadySelected;
                                            })
                                            .map(option => (
                                                <SelectItem key={option.slug} value={option.slug}>
                                                    {option.businessName}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {/* Row 1: Gallery/Cover Images */}
                    <TableRow className="h-40">
                        <TableCell className="font-medium p-4 bg-gray-50 align-top w-[180px]">Gallery/Cover Images</TableCell>
                        {compareList.map((vendor, index) => (
                            <TableCell key={`gallery-${index}`} className="p-4 border-l text-center align-top w-auto">
                                {loadingSlots[index] ? (
                                    <div className="w-full h-32 bg-gray-200 animate-pulse rounded"></div>
                                ) : vendor.slug !== 'empty' && vendor.gallery && vendor.gallery[0]?.url ? (
                                    <Carousel
                                        slidesPerView={1}
                                        withNavigation={true}
                                        navigationInside={true}
                                    >
                                        {vendor.gallery.map(img => (

                                            <Image
                                                width={300}
                                                height={300}
                                                src={img.url}
                                                alt={`Cover for ${vendor.businessName}`}
                                                className="w-full h-72 object-cover rounded mx-auto"
                                            />

                                        ))}
                                    </Carousel>
                                    // <img
                                    //     src={vendor.gallery[0].url}
                                    //     alt={`Cover for ${vendor.businessName}`}
                                    //     className="w-full h-72 object-cover rounded mx-auto"
                                    // />
                                ) : (
                                    <span className="text-sm text-gray-400">No Vendor Selected</span>
                                )}
                            </TableCell>
                        ))}
                    </TableRow>

                    {/* Row 2: Average Rating (out of 5) */}
                    <TableRow>
                        <TableCell className="font-medium p-4 bg-gray-50 w-[180px]">Average Rating (out of 5)</TableCell>
                        {compareList.map((vendor, index) => (
                            <TableCell key={`rating-${index}`} className="p-4 border-l text-center w-auto">
                                {loadingSlots[index] ? (
                                    <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mx-auto"></div>
                                ) : vendor.averageRating && vendor.slug !== 'empty' ? (
                                    <span className="font-semibold text-amber-600">
                                        {vendor.averageRating.toFixed(1)} / 5.0
                                    </span>
                                ) : '—'}
                            </TableCell>
                        ))}
                    </TableRow>

                    {/* Row 3: Starting Price */}
                    <TableRow>
                        <TableCell className="font-medium p-4 bg-gray-50 w-[180px]">Starting Price</TableCell>
                        {compareList.map((vendor, index) => (
                            <TableCell key={`price-${index}`} className="p-4 border-l text-center w-auto">
                                {loadingSlots[index] ? (
                                    <div className="h-6 bg-gray-200 animate-pulse rounded w-24 mx-auto"></div>
                                ) : vendor.pricingStartingFrom && vendor.slug !== 'empty' ? (
                                    <span className="font-semibold text-green-700">
                                        AED {vendor.pricingStartingFrom.toLocaleString()}
                                    </span>
                                ) : '—'}
                            </TableCell>
                        ))}
                    </TableRow>

                    {/* Row 4: City */}
                    <TableRow>
                        <TableCell className="font-medium p-4 bg-gray-50 w-[180px]">City</TableCell>
                        {compareList.map((vendor, index) => (
                            <TableCell key={`city-${index}`} className="p-4 border-l text-center w-auto">
                                {loadingSlots[index] ? (
                                    <div className="h-6 bg-gray-200 animate-pulse rounded w-16 mx-auto"></div>
                                ) : vendor.address?.city && vendor.slug !== 'empty' ? vendor.address.city : '—'}
                            </TableCell>
                        ))}
                    </TableRow>

                    {/* Row 5: Featured Status */}
                    <TableRow>
                        <TableCell className="font-medium p-4 bg-gray-50 w-[180px]">Featured Status</TableCell>
                        {compareList.map((vendor, index) => (
                            <TableCell key={`featured-${index}`} className="p-4 border-l text-center w-auto">
                                {loadingSlots[index] ? (
                                    <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mx-auto"></div>
                                ) : vendor.slug !== 'empty' ? (
                                    vendor.isSponsored === true ? 'Karyaa Recommended' : 'Standard'
                                ) : '—'}
                            </TableCell>
                        ))}
                    </TableRow>

                    {/* Row 6: Main Category */}
                    <TableRow>
                        <TableCell className="font-medium p-4 bg-gray-50 w-[180px]">Main Category</TableCell>
                        {compareList.map((vendor, index) => (
                            <TableCell
                                key={`category-${index}`}
                                // Added break-words to ensure multiple categories wrap correctly
                                className="p-4 border-l text-center w-auto break-words"
                            >
                                {loadingSlots[index] ? (
                                    <div className="h-6 bg-gray-200 animate-pulse rounded w-24 mx-auto"></div>
                                ) : vendor.slug !== 'empty' && Array.isArray(vendor.mainCategory) && vendor.mainCategory.length > 0 ? (
                                    // Maps over the array, extracts the name, and joins them with ", "
                                    vendor.mainCategory.map(category => category.name).join(', ')
                                ) : '—'}
                            </TableCell>
                        ))}
                    </TableRow>

                    {/* Row 7: Service Coverage */}
                    <TableRow>
                        <TableCell className="font-medium p-4 bg-gray-50 w-[180px]">Service Coverage</TableCell>
                        {compareList.map((vendor, index) => (
                            <TableCell key={`coverage-${index}`} className="p-4 border-l text-center w-auto overflow-hidden">
                                {loadingSlots[index] ? (
                                    <div className="h-6 bg-gray-200 animate-pulse rounded w-32 mx-auto"></div>
                                ) : vendor.serviceAreaCoverage && vendor.slug !== 'empty'
                                    ? vendor.serviceAreaCoverage
                                    : '—'}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

export default CompareTable;