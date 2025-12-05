'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { getVendorsBySlugs } from "@/app/actions/public/vendors";
import { getVendorGalleryItems } from '@/app/actions/shared/gallery';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { VendorSelectField } from '@/components/common/VendorSelectField';
import { Carousel } from '@/components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';

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
    subCategory: null,
    tagline: null,
    isRecommended: false,
};

// Helper to create empty slots
const createEmptySlot = (index) => ({
    ...EMPTY_SLOT,
    _id: `empty_${index}`
});

// --- Main Client Component ---
const CompareTable = ({ initialVendors }) => {
    const router = useRouter();

    // Initialize form with react-hook-form
    const methods = useForm({
        defaultValues: {
            vendor0: initialVendors[0]?.slug || '',
            vendor1: initialVendors[1]?.slug || '',
            vendor2: initialVendors[2]?.slug || '',
        }
    });

    // State initialization: Always maintain exactly 3 slots
    const [compareList, setCompareList] = useState(() => {
        const initialList = [];
        const validVendors = initialVendors.filter(v => v && v.slug);
        for (let i = 0; i < MAX_COMPARISON_SLOTS; i++) {
            if (i < validVendors.length) {
                initialList.push({ ...EMPTY_SLOT, ...validVendors[i] });
            } else {
                initialList.push(createEmptySlot(i));
            }
        }
        return initialList;
    });

    // Track loading state for individual slots
    const [loadingSlots, setLoadingSlots] = useState([false, false, false]);

    // Track gallery items for each vendor
    const [galleryItems, setGalleryItems] = useState([[], [], []]);
    const [loadingGallery, setLoadingGallery] = useState([false, false, false]);

    // Fetch gallery items when vendor changes
    useEffect(() => {
        const fetchAllGalleries = async () => {
            const galleryPromises = compareList.map(async (vendor, index) => {
                if (vendor.slug === 'empty' || !vendor._id) {
                    return { index, items: [] };
                }

                setLoadingGallery(prev => {
                    const newLoading = [...prev];
                    newLoading[index] = true;
                    return newLoading;
                });

                try {
                    const result = await getVendorGalleryItems(vendor._id);

                    return {
                        index,
                        items: result.items.slice(0, 10) || []
                    };
                } catch (error) {
                    console.error(`Error fetching gallery for vendor ${vendor._id}:`, error);
                    return { index, items: [] };
                } finally {
                    setLoadingGallery(prev => {
                        const newLoading = [...prev];
                        newLoading[index] = false;
                        return newLoading;
                    });
                }
            });

            const results = await Promise.all(galleryPromises);

            setGalleryItems(prev => {
                const newGallery = [...prev];
                results.forEach(({ index, items }) => {
                    newGallery[index] = items;
                });
                return newGallery;
            });
        };

        fetchAllGalleries();
    }, [compareList]);

    // Update URL when compareList changes
    useEffect(() => {
        updateUrlWithSlugs(compareList);
    }, [compareList]);

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

    // Watch form values for changes
    useEffect(() => {
        const subscription = methods.watch((value, { name }) => {
            if (name && name.startsWith('vendor')) {
                const slotIndex = parseInt(name.replace('vendor', ''));
                const newVendorSlug = value[name];
                handleVendorSelection(newVendorSlug, slotIndex);
            }
        });
        return () => subscription.unsubscribe();
    }, [methods.watch, methods]);

    // Async handler for vendor selection
    const handleVendorSelection = async (newVendorSlug, slotIndex) => {
        // Handle empty/deselect case
        if (!newVendorSlug || newVendorSlug === '' || newVendorSlug === 'empty') {
            setCompareList(prevList => {
                const newList = [...prevList];
                newList[slotIndex] = createEmptySlot(slotIndex);
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
            // Reset the form field to previous value
            methods.setValue(`vendor${slotIndex}`, compareList[slotIndex].slug === 'empty' ? '' : compareList[slotIndex].slug);
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
                const newVendor = fetchResult.data[0];
                setCompareList(prevList => {
                    const newList = [...prevList];
                    // Merge new data with EMPTY_SLOT defaults to ensure all fields exist
                    newList[slotIndex] = { ...EMPTY_SLOT, ...newVendor };
                    return newList;
                });
            } else {
                alert(fetchResult.error || 'Failed to load vendor data');
                setCompareList(prevList => {
                    const newList = [...prevList];
                    newList[slotIndex] = createEmptySlot(slotIndex);
                    return newList;
                });
                methods.setValue(`vendor${slotIndex}`, '');
            }
        } catch (error) {
            console.error('Error fetching vendor:', error);
            alert('An error occurred while loading vendor data');
            setCompareList(prevList => {
                const newList = [...prevList];
                newList[slotIndex] = createEmptySlot(slotIndex);
                return newList;
            });
            methods.setValue(`vendor${slotIndex}`, '');
        } finally {
            setLoadingSlots(prev => {
                const newLoading = [...prev];
                newLoading[slotIndex] = false;
                return newLoading;
            });
        }
    };

    // --- RENDER ---
    return (
        <FormProvider {...methods}>
            <div className="comparison-table-wrapper overflow-x-auto rounded-lg">
                <Table className="min-w-[1080px] table-fixed">
                    <TableHeader className="bg-gray-50">
                        <TableRow className="hover:bg-gray-50/90">
                            <TableHead className="font-bold w-[180px] text-left text-base bg-gray-100">
                                Comparison Metrics
                            </TableHead>
                            {compareList.map((vendor, index) => (
                                <TableHead
                                    key={`header-${index}`}
                                    className="min-w-[230px] text-center border-l border-l-gray-300 bg-gray-100 p-4"
                                >
                                    <VendorSelectField
                                        name={`vendor${index}`}
                                        placeholder="Search Vendor"
                                        valueKey="slug"
                                        required={false}
                                        initialVendor={vendor.slug !== 'empty' ? vendor : null}
                                    />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        {/* NEW ROW: Vendor Name */}
                        <TableRow className="bg-gray-50/50">
                            <TableCell className="font-bold p-4 w-[180px]">Vendor Name</TableCell>
                            {compareList.map((vendor, index) => (
                                <TableCell
                                    key={`name-${index}`}
                                    className="p-4 border-l border-l-gray-300 text-center min-w-[230px] break-words"
                                >
                                    {loadingSlots[index] ? (
                                        <div className="h-6 bg-gray-200 animate-pulse rounded w-2/3 mx-auto"></div>
                                    ) : vendor.slug !== 'empty' ? (
                                        <span className="font-semibold text-gray-800 text-base">
                                            {vendor.businessName}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">
                                            —
                                        </span>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Row: Gallery/Cover Images */}
                        <TableRow className="h-40">
                            <TableCell className="font-medium p-4 bg-gray-50 align-top w-[180px]">Gallery/Cover Images</TableCell>
                            {compareList.map((vendor, index) => (
                                <TableCell
                                    key={`gallery-${index}`}
                                    className="p-4 border-l border-l-gray-300 text-center align-top min-w-[230px]"
                                >
                                    {loadingSlots[index] || loadingGallery[index] ? (
                                        <div className="w-full h-32 bg-gray-200 animate-pulse rounded"></div>
                                    ) : vendor.slug !== 'empty' && galleryItems[index] && galleryItems[index].length > 0 ? (
                                        <Carousel
                                            slidesPerView={1}
                                            withNavigation={true}
                                            navigationInside={true}
                                        >
                                            {galleryItems[index].map((item, imgIndex) => (
                                                <Image
                                                    key={item._id || imgIndex}
                                                    width={300}
                                                    height={300}
                                                    src={item.url}
                                                    alt={item.title || `Gallery image for ${vendor.businessName}`}
                                                    className="w-full h-[230px] xl:h-72 object-cover rounded mx-auto min-w-[230px]"
                                                />
                                            ))}
                                        </Carousel>
                                    ) : vendor.slug !== 'empty' ? (
                                        <span className="text-sm text-gray-400">No Gallery Images</span>
                                    ) : (
                                        <span className="text-sm text-gray-400">No Vendor Selected</span>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Row: Average Rating */}
                        <TableRow>
                            <TableCell className="font-medium p-4 bg-gray-50 w-[180px]">Average Rating</TableCell>
                            {compareList.map((vendor, index) => (
                                <TableCell
                                    key={`rating-${index}`}
                                    className="p-4 border-l border-l-gray-300 text-center min-w-[230px] break-words"
                                >
                                    {loadingSlots[index] ? (
                                        <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mx-auto"></div>
                                    ) : vendor.averageRating && vendor.slug !== 'empty' ? (
                                        <span className="font-semibold text-green-600">
                                            {vendor.averageRating.toFixed(1)} / 5.0
                                        </span>
                                    ) : '—'}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Row: Starting Price */}
                        <TableRow>
                            <TableCell className="font-medium p-4 bg-gray-50 w-[180px]">Starting Price</TableCell>
                            {compareList.map((vendor, index) => (
                                <TableCell
                                    key={`price-${index}`}
                                    className="p-4 border-l border-l-gray-300 text-center min-w-[230px] break-words"
                                >
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

                        {/* Row: City */}
                        <TableRow>
                            <TableCell className="font-medium p-4 bg-gray-50 w-[180px]">City</TableCell>
                            {compareList.map((vendor, index) => (
                                <TableCell
                                    key={`city-${index}`}
                                    className="p-4 border-l border-l-gray-300 text-center min-w-[230px] break-words"
                                >
                                    {loadingSlots[index] ? (
                                        <div className="h-6 bg-gray-200 animate-pulse rounded w-16 mx-auto"></div>
                                    ) : vendor.address?.city && vendor.slug !== 'empty' ? vendor.address.city : '—'}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Row: Featured Status */}
                        <TableRow>
                            <TableCell className="font-medium p-4 bg-gray-50 w-[180px]">Occasions Served</TableCell>
                            {compareList.map((vendor, index) => (
                                <TableCell
                                    key={`occasions-${index}`}
                                    className="p-4 border-l border-l-gray-300 text-center min-w-[230px] break-words"
                                >
                                    {loadingSlots[index] ? (
                                        <div className="h-6 bg-gray-200 animate-pulse rounded w-24 mx-auto"></div>
                                    ) : vendor.slug !== "empty" &&
                                        Array.isArray(vendor.occasionsServed) &&
                                        vendor.occasionsServed.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {vendor.occasionsServed.slice(0, 8).map((occasion, occIndex) => (
                                                <span
                                                    key={occIndex}
                                                    className="px-2 py-1 text-xs border border-gray-300 rounded bg-transparent"
                                                >
                                                    {occasion
                                                        .replace(/-/g, " ")
                                                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                                                </span>
                                            ))}

                                            {vendor.occasionsServed.length > 8 && (
                                                <span className="px-2 py-1 text-xs border border-gray-300 rounded bg-transparent text-gray-600">
                                                    +{vendor.occasionsServed.length - 8} more
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span>—</span>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Row: Main Category */}
                        <TableRow>
                            <TableCell className="font-medium p-4 bg-gray-50 w-[180px]">Category</TableCell>
                            {compareList.map((vendor, index) => (
                                <TableCell
                                    key={`category-${index}`}
                                    className="p-4 border-l border-l-gray-300 text-center min-w-[230px] break-words"
                                >
                                    {loadingSlots[index] ? (
                                        <div className="h-6 bg-gray-200 animate-pulse rounded w-24 mx-auto"></div>
                                    ) : vendor.slug !== 'empty' && Array.isArray(vendor.mainCategory) && vendor.mainCategory.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {vendor.mainCategory.slice(0, 8).map((category, catIndex) => (
                                                <span
                                                    key={catIndex}
                                                    className="px-2 py-1 text-xs border border-gray-300 rounded bg-transparent"
                                                >
                                                    {category.name}
                                                </span>
                                            ))}
                                            {vendor.mainCategory.length > 8 && (
                                                <span className="px-2 py-1 text-xs border border-gray-300 rounded bg-transparent text-gray-600">
                                                    +{vendor.mainCategory.length - 8} more
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span>—</span>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Row: Subcategories */}
                        <TableRow>
                            <TableCell className="font-medium p-4 bg-gray-50 w-[180px]">Subcategories</TableCell>
                            {compareList.map((vendor, index) => (
                                <TableCell
                                    key={`subcategory-${index}`}
                                    className="p-4 border-l border-l-gray-300 text-center min-w-[230px] break-words"
                                >
                                    {loadingSlots[index] ? (
                                        <div className="h-6 bg-gray-200 animate-pulse rounded w-32 mx-auto"></div>
                                    ) : vendor.slug !== 'empty' && Array.isArray(vendor.subCategories) && vendor.subCategories.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {vendor.subCategories.slice(0, 8).map((sub, subIndex) => (
                                                <span
                                                    key={subIndex}
                                                    className="px-2 py-1 text-xs border border-gray-300 rounded bg-transparent"
                                                >
                                                    {sub.name}
                                                </span>
                                            ))}
                                            {vendor.subCategories.length > 8 && (
                                                <span className="px-2 py-1 text-xs border border-gray-300 rounded bg-transparent text-gray-600">
                                                    +{vendor.subCategories.length - 8} more
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span>—</span>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Row: View Vendor Button */}
                        <TableRow>
                            <TableCell className="font-medium p-4 bg-gray-50 w-[180px]">View Vendor</TableCell>
                            {compareList.map((vendor, index) => (
                                <TableCell
                                    key={`view-${index}`}
                                    className="p-4 border-l border-l-gray-300 text-center min-w-[230px]"
                                >
                                    {loadingSlots[index] ? (
                                        <div className="h-10 bg-gray-200 animate-pulse rounded w-32 mx-auto"></div>
                                    ) : vendor.slug !== 'empty' ? (
                                        <Link href={`/vendors/${vendor.slug}`}>
                                            <Button variant="default" className="w-full max-w-[200px]">
                                                View Vendor
                                            </Button>
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-gray-400">—</span>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </FormProvider>
    );
};

export default CompareTable;
