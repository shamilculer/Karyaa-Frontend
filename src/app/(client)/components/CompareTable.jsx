"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { useState } from "react"
import { vendors } from "@/utils"
import { Combobox } from "@/components/ui/combo-box"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Carousel } from "@/components/ui/carousel"


const CompareTable = () => {

    // Example 2: Countries
    const [countryValue, setCountryValue] = useState("")
    const countries = [
        { value: "us", label: "United States" },
        { value: "uk", label: "United Kingdom" },
        { value: "ca", label: "Canada" },
        { value: "au", label: "Australia" },
        { value: "de", label: "Germany" },
        { value: "fr", label: "France" },
        { value: "in", label: "India" },
    ]

    return (
        <div className="w-full">
            {/* <div className="w-full flex items-end gap-8 mb-24">
                <div className="w-[28%]">
                    <label className="text-sm font-medium block mb-3">Select Vendor to Compare</label>
                    <Combobox
                        data={countries}
                        value={countryValue}
                        onValueChange={setCountryValue}
                        placeholder="Choose your country..."
                        searchPlaceholder="Search countries..."
                        emptyMessage="Country not found."
                        className="w-full"
                        popoverClassName="w-[300px]"
                    />
                    {countryValue && (
                        <p className="text-sm text-gray-600">
                            Selected: {countries.find(c => c.value === countryValue)?.label}
                        </p>
                    )}
                </div>
                <div className="w-[28%]">
                    <label className="text-sm font-medium block mb-3">Select Vendor to Compare</label>
                    <Combobox
                        data={countries}
                        value={countryValue}
                        onValueChange={setCountryValue}
                        placeholder="Choose your country..."
                        searchPlaceholder="Search countries..."
                        emptyMessage="Country not found."
                        className="w-full"
                        popoverClassName="w-[300px]"
                    />
                    {countryValue && (
                        <p className="text-sm text-gray-600">
                            Selected: {countries.find(c => c.value === countryValue)?.label}
                        </p>
                    )}
                </div>
                <div className="w-[28%]">
                    <label className="text-sm font-medium block mb-3">Select Vendor to Compare</label>
                    <Combobox
                        data={countries}
                        value={countryValue}
                        onValueChange={setCountryValue}
                        placeholder="Choose your country..."
                        searchPlaceholder="Search countries..."
                        emptyMessage="Country not found."
                        className="w-full"
                        popoverClassName="w-[300px]"
                    />
                    {countryValue && (
                        <p className="text-sm text-gray-600">
                            Selected: {countries.find(c => c.value === countryValue)?.label}
                        </p>
                    )}
                </div>

                <Button className="w-[16%]">Compare</Button>
            </div> */}
            <div className="overflow-x-auto container">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow className="h-20">
                            <TableHead className="w-[30%] font-semibold text-xl text-gray-900 border border-gray-400 p-8">
                                Compare vendors
                            </TableHead>
                            {vendors.slice(0, 3).map((vendor) => (
                                <TableHead key={vendor.name} className="text-center relative border border-gray-400 p-8">
                                    <Combobox
                                        data={countries}
                                        value={countryValue}
                                        onValueChange={setCountryValue}
                                        placeholder="Choose your country..."
                                        searchPlaceholder="Search countries..."
                                        emptyMessage="Country not found."
                                        className="w-full"
                                        popoverClassName="w-[300px]"
                                    />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableHead className="w-[30%] font-semibold text-gray-900 border border-gray-400 p-8">
                                Compare vendors
                            </TableHead>
                            <TableCell className="border border-gray-400">
                                <div className="flex-center w-full p-5">
                                    <Carousel
                                        spaceBetween={0}
                                        loop
                                        slidesPerView={1}
                                        navigationInside
                                        withPagination={false}
                                        navigationStyles="size-7 p-0 opacity-50"
                                        className="size-50"
                                    >
                                        {vendors[1].coverImages.map((img, idx) => (
                                            <Image
                                                key={idx}
                                                height={240}
                                                width={100}
                                                src={img}
                                                alt={`${vendors[1].name} cover ${idx + 1}`}
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        ))}
                                    </Carousel>
                                </div>
                            </TableCell>
                            <TableCell className="border border-gray-400">
                                <div className="flex-center w-full p-5">
                                    <Carousel
                                        spaceBetween={0}
                                        loop
                                        slidesPerView={1}
                                        navigationInside
                                        withPagination={false}
                                        navigationStyles="size-7 p-0 opacity-50"
                                        className="size-50"
                                    >
                                        {vendors[1].coverImages.map((img, idx) => (
                                            <Image
                                                key={idx}
                                                height={240}
                                                width={100}
                                                src={img}
                                                alt={`${vendors[1].name} cover ${idx + 1}`}
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        ))}
                                    </Carousel>
                                </div>
                            </TableCell>
                            <TableCell className="border border-gray-400">
                                <div className="flex-center w-full p-5">
                                    <Carousel
                                        spaceBetween={0}
                                        loop
                                        slidesPerView={1}
                                        navigationInside
                                        withPagination={false}
                                        navigationStyles="size-7 p-0 opacity-50"
                                        className="size-50"
                                    >
                                        {vendors[1].coverImages.map((img, idx) => (
                                            <Image
                                                key={idx}
                                                height={240}
                                                width={100}
                                                src={img}
                                                alt={`${vendors[1].name} cover ${idx + 1}`}
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        ))}
                                    </Carousel>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}


export default CompareTable