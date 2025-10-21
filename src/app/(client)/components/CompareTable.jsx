"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useMemo } from "react" // useEffect import removed
import { Combobox } from "@/components/ui/combo-box" 
import Image from "next/image"
import { Carousel } from "@/components/ui/carousel"
import { useRouter } from "next/navigation"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Define a placeholder object for empty comparison slots
const EMPTY_SLOT = { empty: true, businessName: "Select Vendor", slug: null };
const MAX_COMPARISON_SLOTS = 3;

const CompareTable = ({ initialVendors, vendorOptions }) => {
    const router = useRouter();
    
    // State to hold the vendors being compared (max 3 slots)
    // FIX: State initialization is performed only once here, resolving the "Cannot update a component ('Router')" error.
    const [compareList, setCompareList] = useState(() => {
        const list = initialVendors.slice(0, MAX_COMPARISON_SLOTS);
        while (list.length < MAX_COMPARISON_SLOTS) {
            list.push(EMPTY_SLOT);
        }
        return list;
    });

    // The synchronization useEffect that caused stability issues has been removed.

    // Base options list (all vendors)
    const allComboboxOptions = useMemo(() => 
        vendorOptions.map(v => ({ 
            value: v.slug, 
            label: v.businessName,
        }))
    , [vendorOptions]);

    // Helper to generate the new URL query string
    const generateUrlQuery = (list) => {
        const activeSlugs = list
            .filter(v => !v.empty && v.slug)
            .map(v => v.slug)
            .join(',');
            
        return activeSlugs ? `?vendors=${activeSlugs}` : '';
    };

    // Function to update the URL based on the current list
    const updateUrl = (updatedList) => {
        const query = generateUrlQuery(updatedList);
        router.replace(`/compare${query}`, { scroll: false });
    };

    // Function to handle a selection from any Combobox
    const handleVendorSelection = (newSlug, index) => {
        if (!newSlug) return;

        // Fallback: If the selected vendor isn't in the full initial data, use the basic option data
        const newVendor = initialVendors.find(v => v.slug === newSlug) || 
                          vendorOptions.find(v => v.slug === newSlug); 

        if (!newVendor) return; 

        setCompareList(prevList => {
            const newList = [...prevList];
            
            // Note: The combobox filtering below makes this check mostly redundant, but kept as a safeguard.
            const isAlreadyAdded = newList.some((v, i) => i !== index && v.slug === newSlug);
            if (isAlreadyAdded) {
                return prevList; 
            }

            // Replace the item at the specific index
            newList[index] = newVendor;
            
            updateUrl(newList);
            return newList;
        });
    };
    
    // Function to handle removing a vendor
    const handleRemoveVendor = (index) => {
        setCompareList(prevList => {
            const newList = [...prevList];
            // Replace the vendor with an empty slot
            newList[index] = EMPTY_SLOT;
            
            // Reorder the list so empty slots are always at the end
            const reorderedList = newList.filter(v => !v.empty).concat(newList.filter(v => v.empty));
            
            updateUrl(reorderedList);
            return reorderedList;
        });
    };

    // Helper to render the table cells for comparison attributes
    const renderComparisonRow = (attributeKey, label, formatter = (val) => val) => (
        <TableRow key={attributeKey}>
            <TableHead className="w-[30%] font-semibold text-gray-900 border border-gray-400 p-4">{label}</TableHead>
            {compareList.map((vendor, index) => (
                <TableCell key={index} className="text-center border border-gray-400 p-4">
                    {vendor.empty ? (
                        <span className="text-muted-foreground">—</span>
                    ) : (
                        // Check for the special case of mainCategory (populated with objects)
                        attributeKey === 'mainCategory' && Array.isArray(vendor.mainCategory) ? 
                            // Display the name of the first category
                            formatter(vendor.mainCategory[0]?.name)
                        :
                        // Handle nested properties like address.city
                        attributeKey.includes('.') ? 
                            formatter(vendor[attributeKey.split('.')[0]]?.[attributeKey.split('.')[1]])
                            : formatter(vendor[attributeKey])
                    )}
                </TableCell>
            ))}
        </TableRow>
    );

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <Table className="min-w-[1000px] border-collapse border border-gray-400">
                    {/* TABLE HEADER (Vendor Selection) */}
                    <TableHeader>
                        <TableRow className="h-20 bg-gray-50">
                            <TableHead className="w-[30%] font-bold text-xl text-gray-900 border border-gray-400 p-8">
                                Comparison Metrics
                            </TableHead>
                            {/* Map over the comparison list to render the 3 slots */}
                            {compareList.map((vendor, index) => {
                                // FEATURE 2: Filter options dynamically
                                // Get slugs of all vendors currently in OTHER slots
                                const otherVendorSlugs = compareList
                                    .filter((v, i) => i !== index && !v.empty)
                                    .map(v => v.slug);

                                // Filter all available options
                                const filteredOptions = allComboboxOptions.filter(option => 
                                    // 1. Always include the vendor currently selected in this slot
                                    option.value === vendor.slug || 
                                    // 2. Exclude any vendor already selected in other slots
                                    !otherVendorSlugs.includes(option.value)
                                );
                                // END FILTERING LOGIC

                                return (
                                <TableHead key={index} className="text-center relative border border-gray-400 p-4">
                                    <div className="flex flex-col items-center gap-2">
                                        
                                        {/* Remove Button */}
                                        {!vendor.empty && (
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-red-500"
                                                onClick={() => handleRemoveVendor(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}

                                        {/* Combobox for Selection */}
                                        <Combobox
                                            data={filteredOptions} // <-- Pass the dynamically filtered list
                                            value={vendor.empty ? "" : vendor.slug} 
                                            onValueChange={(newSlug) => handleVendorSelection(newSlug, index)}
                                            placeholder={vendor.empty ? "Select Vendor" : vendor.businessName}
                                            searchPlaceholder="Search vendors..."
                                            emptyMessage="Vendor not found."
                                            className="w-full max-w-[280px]"
                                        />
                                    </div>
                                </TableHead>
                            )})}
                        </TableRow>
                    </TableHeader>

                    {/* TABLE BODY (Comparison Data) */}
                    <TableBody>
                        {/* Row 1: Vendor Image/Carousel */}
                        <TableRow>
                            <TableHead className="w-[30%] font-bold text-gray-900 border border-gray-400 p-8">
                                Gallery/Cover Images
                            </TableHead>
                            {compareList.map((vendor, index) => (
                                <TableCell key={index} className="border border-gray-400">
                                    {vendor.empty ? (
                                        <div className="flex-center w-full h-48 text-muted-foreground p-5">
                                            No Vendor Selected
                                        </div>
                                    ) : (
                                        <div className="flex-center w-full p-5 h-48">
                                            <Carousel
                                                spaceBetween={0}
                                                loop
                                                slidesPerView={1}
                                                navigationInside
                                                withPagination={false}
                                                navigationStyles="size-7 p-0 opacity-50"
                                                className="w-full h-full max-w-[300px]"
                                            >
                                                {/* Check for vendor.gallery and ensure it's an array */}
                                                {Array.isArray(vendor.gallery) && vendor.gallery.slice(0, 3).map((img, idx) => (
                                                    <Image
                                                        key={idx}
                                                        height={240}
                                                        width={300}
                                                        // Ensure the image object has a 'url' property
                                                        src={img.url}
                                                        alt={`${vendor.businessName} cover ${idx + 1}`}
                                                        className="w-full h-full object-cover rounded-xl"
                                                    />
                                                ))}
                                            </Carousel>
                                        </div>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Row 2: Business Name (Link) */}
                        <TableRow>
                            <TableHead className="w-[30%] font-bold text-gray-900 border border-gray-400 p-4 bg-gray-50">Business Name</TableHead>
                            {compareList.map((vendor, index) => (
                                <TableCell key={index} className="text-center border border-gray-400 p-4 bg-gray-50">
                                    {vendor.empty ? (
                                        <span className="text-muted-foreground">—</span>
                                    ) : (
                                        <Link href={`/vendors/${vendor.slug}`} className="text-primary font-semibold hover:underline">
                                            {vendor.businessName}
                                        </Link>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Comparison Rows */}
                        {renderComparisonRow('averageRating', 'Average Rating (out of 5)')}
                        {renderComparisonRow('pricingStartingFrom', 'Starting Price', (price) => price ? `AED ${price}` : 'N/A')}
                        {renderComparisonRow('address.city', 'City')}
                        {renderComparisonRow('isSponsored', 'Featured Status', (isSponsored) => isSponsored ? 'Yes' : 'No')}
                        {renderComparisonRow('mainCategory', 'Main Category')}
                        {renderComparisonRow('serviceAreaCoverage', 'Service Coverage')}
                        {renderComparisonRow('tagline', 'Tagline')} 

                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default CompareTable