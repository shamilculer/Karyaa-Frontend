'use client';

import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";

const PackaeToolbar = ({ searchTerm, onSearchChange, filterRating, onFilterChange }) => {
    return (
        <div className="flex-between gap-4 w-full">
            <div className="w-2/3 relative">
                <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 !w-7" />
                <Input
                    id="search"
                    placeholder="Search reviews by name or content"
                    className="border border-gray-300 bg-white rounded-lg placeholder:text-primary/50 placeholder:font-medium placeholder:text-base h-12 pl-10 !py-0 !text-base"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-4">
                <Select onValueChange={onFilterChange}>
                    <SelectTrigger className="w-[180px] bg-[#F2F4FF] rounded-lg border-0 !h-12 px-4 text-indigo-800 font-medium hover:bg-[#e4e6ff] transition-colors">
                        <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="wedding">Wedding Packages</SelectItem>
                        <SelectItem value="corporate">Corporate Events</SelectItem>
                        <SelectItem value="birthday">Birthday Parties</SelectItem>
                        <SelectItem value="private">Private Gatherings</SelectItem>
                        <SelectItem value="custom">Custom Events</SelectItem>
                    </SelectContent>
                </Select>

                <Button><Plus className="w-4" /> Create</Button>
            </div>
        </div>
    );
};

export default PackaeToolbar;