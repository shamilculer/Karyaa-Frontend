'use client';

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFormContext } from "react-hook-form";

import { getAllVendorOptions } from "@/app/actions/vendors";
import Image from "next/image";

// Setting a reasonable limit for the combobox dropdown
const SEARCH_LIMIT = 50;

export const VendorSelectField = ({ 
    name = "vendor", 
    placeholder = "Search and select a vendor...",
    valueKey = "slug", // Can be "slug" or "_id"
    required = false,
    initialVendor = null // NEW: Pass the initial vendor object if available
}) => {
    const { setValue, watch } = useFormContext();
    const selectedValue = watch(name); // Get current value from form
    
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [options, setOptions] = React.useState(initialVendor ? [initialVendor] : []);
    const [isLoading, setIsLoading] = React.useState(false);
    const [initialVendorData, setInitialVendorData] = React.useState(initialVendor);

    // Update initialVendorData when initialVendor prop changes
    React.useEffect(() => {
        if (initialVendor && initialVendor[valueKey]) {
            setInitialVendorData(initialVendor);
            setOptions(prev => {
                const exists = prev.some(v => v[valueKey] === initialVendor[valueKey]);
                return exists ? prev : [initialVendor, ...prev];
            });
        }
    }, [initialVendor, valueKey]);

    // Fetch initial vendor if we have a selectedValue but no vendor data
    React.useEffect(() => {
        const fetchInitialVendor = async () => {
            if (selectedValue && !initialVendorData && options.length === 0) {
                setIsLoading(true);
                try {
                    const result = await getAllVendorOptions({
                        query: "",
                        limit: SEARCH_LIMIT
                    });

                    if (result.success && result.data) {
                        const vendor = result.data.find(v => v[valueKey] === selectedValue);
                        if (vendor) {
                            setInitialVendorData(vendor);
                            setOptions(result.data);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching initial vendor:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchInitialVendor();
    }, [selectedValue, initialVendorData, options.length, valueKey]);

    // Fetch vendors based on search
    React.useEffect(() => {
        if (!open) return;

        setIsLoading(true);

        const fetchVendors = async () => {
            try {
                const result = await getAllVendorOptions({
                    query: searchValue,
                    limit: SEARCH_LIMIT
                });

                if (result.success) {
                    setOptions(result.data || []);
                } else {
                    console.error("Vendor search failed:", result.error);
                    setOptions([]);
                }
            } catch (error) {
                console.error("Error fetching vendors:", error);
                setOptions([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchVendors();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchValue, open]);

    // Find the selected vendor (check options first, then fall back to initialVendorData)
    const selectedVendor = options.find(option => option[valueKey] === selectedValue) || 
                           (initialVendorData?.[valueKey] === selectedValue ? initialVendorData : null);

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between h-12 px-3"
                        type="button"
                    >
                        {isLoading && selectedValue && !selectedVendor ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-gray-500">Loading vendor...</span>
                            </div>
                        ) : selectedVendor ? (
                            <div className="flex items-center gap-3">
                                <Image 
                                    src={selectedVendor.businessLogo} 
                                    width={40} 
                                    height={40} 
                                    alt={selectedVendor.businessName} 
                                    className="object-cover rounded-full size-10" 
                                />
                                <span className="truncate">{selectedVendor.businessName}</span>
                            </div>
                        ) : (
                            <span className="text-gray-500">{placeholder}</span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[400px] p-0 bg-white" align="start" style={{ zIndex: 9999 }}>
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search vendors..."
                            onValueChange={setSearchValue}
                            value={searchValue}
                        />

                        <CommandGroup className="max-h-60 overflow-y-auto">
                            {/* Loading State */}
                            {isLoading && (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                </div>
                            )}

                            {/* Empty State */}
                            {!isLoading && options.length === 0 && (
                                <CommandEmpty>
                                    {searchValue 
                                        ? `No vendors found matching "${searchValue}"`
                                        : "Start typing to search vendors"
                                    }
                                </CommandEmpty>
                            )}

                            {/* Clear Selection Option */}
                            {!isLoading && (
                                <CommandItem
                                    value="__clear__"
                                    onSelect={() => {
                                        setValue(name, "", { shouldValidate: true });
                                        setSearchValue("");
                                        setOpen(false);
                                    }}
                                    className="bg-gray-50 border-b"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            !selectedValue ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <span className="text-gray-600">No Specific Vendor</span>
                                </CommandItem>
                            )}

                            {/* Vendor List */}
                            {!isLoading && options.map((option) => (
                                <CommandItem
                                    key={option[valueKey]}
                                    value={option.businessName}
                                    onSelect={() => {
                                        // Set the value based on valueKey (_id or slug)
                                        setValue(name, option[valueKey], { shouldValidate: true });
                                        setSearchValue("");
                                        setOpen(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedValue === option[valueKey] ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <Image 
                                        src={option.businessLogo} 
                                        width={40} 
                                        height={40} 
                                        alt={option.businessName} 
                                        className="object-cover rounded-full size-10 mr-3" 
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{option.businessName}</span>
                                        <span className="text-xs text-gray-500">
                                            {valueKey === "slug" ? option.slug : option._id}
                                        </span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Validation Error */}
            {required && !selectedValue && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    Please select a vendor
                </p>
            )}
        </div>
    );
};