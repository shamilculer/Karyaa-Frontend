"use client"

import { useState, useMemo } from "react" // Import useState and useMemo
import OverViewStats from "../components/common/OverviewStatsAdmin"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Import Input component
import { Eye, SquarePen, Trash, Search, Plus } from "lucide-react" // Import Search icon

import { categories } from "@/utils"
import Link from "next/link"
import Image from "next/image"

const CategoryManagementPage = () => {
    const [searchQuery, setSearchQuery] = useState("")

    // Memoize the filtering logic
    const filteredCategories = useMemo(() => {
        if (!searchQuery) {
            return categories
        }
        const lowerCaseQuery = searchQuery.toLowerCase()
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(lowerCaseQuery) ||
            cat.slug.toLowerCase().includes(lowerCaseQuery)
            // You can add more fields to search here, like subcategory tags
        )
    }, [searchQuery])

    return (
        <div className="h-full dashboard-container space-y-8">
            <OverViewStats />

            <div className="w-full space-y-6 mb-12">
                {/* Search Bar and Action Button */}
                <div className="flex justify-between items-center gap-4">
                    <div className="relative w-1/3 min-w-[300px]">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4 h-4" />
                        <Input
                            placeholder="Search categories by name or slug..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border-gray-300 h-11 pl-10"
                        />
                    </div>
                    
                    <Button asChild>
                         <Link href="/admin/categories/new" className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add New Category
                        </Link>
                    </Button>
                </div>

                {/* Categories Grid */}
                <div className="w-full grid grid-cols-4 gap-8">
                    {filteredCategories.map((cat) => (
                        <CategoryCard key={cat.slug} category={cat} />
                    ))}

                    {filteredCategories.length === 0 && (
                        <div className="col-span-4 text-center py-10 text-lg text-gray-500">
                            No categories found matching "{searchQuery}".
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

const CategoryCard = ({ category }) => {
    return (
        <Card className="p-4 px-0 border-gray-300 shadow-none">

            <CardContent className="p-0 px-3">
                <div className="w-full h-56 relative">
                    {/* Assuming the images are in the public directory or properly aliased */}
                    <Image fill className="object-cover rounded-2xl" alt={category.name} src={category.img} />
                </div>
                <div className="px-2 mt-3">
                    <h3 className="!text-[20px] mb-2">{category.name}</h3>
                    <p className="text-sm font-medium text-gray-700 mb-2">subcategories:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-4">
                        <li className="truncate">lorem ipsum dolor sit amit</li>
                        <li className="truncate">lorem ipsum dolor sit amit</li>
                        <li className="truncate">lorem ipsum dolor sit amit</li>
                        <li className="list-none pl-4 text-gray-400">....</li>
                    </ul>
                </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-t-gray-300 flex items-center justify-end gap-4">
                <Button variant="ghost" className="p-0 size-auto text-blue-600 hover:text-blue-700" asChild>
                    <Link href={`/categories/${category.slug}`} className="flex items-center gap-1">
                        <Eye className="w-4" /> View
                    </Link>
                </Button>
                <Button variant="ghost" className="p-0 size-auto text-green-600 hover:text-green-700 flex items-center gap-1">
                    <SquarePen className="w-4" /> Edit
                </Button>
                <Button variant="ghost" className="p-0 size-auto text-red-600 hover:text-red-700 flex items-center gap-1">
                    <Trash className="w-4" /> Delete
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CategoryManagementPage