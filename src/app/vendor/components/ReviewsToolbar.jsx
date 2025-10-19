'use client';

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const ReviewsToolbar = ({ searchTerm, onSearchChange, filterRating, onFilterChange }) => {
    return (
        <div className="flex-between gap-4 w-full">
            <div className="w-1/2 relative">
                <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 !w-7" />
                <Input
                    id="search"
                    placeholder="Search reviews by name or content"
                    className="border border-gray-300 bg-white rounded-lg placeholder:text-primary/50 placeholder:font-medium placeholder:text-base h-12 pl-10 !py-0 !text-base"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <Select value={filterRating} onValueChange={onFilterChange}>
                <SelectTrigger className="w-[180px] bg-[#F2F4FF] rounded-4xl border-0 !h-12 px-4">
                    <SelectValue placeholder="Filter by Rating" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default ReviewsToolbar;