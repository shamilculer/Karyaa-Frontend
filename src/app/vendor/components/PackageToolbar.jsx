'use client';

import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PackaeToolbar = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="flex-between gap-4 w-full">
            <div className="w-2/3 relative">
                <Search className="absolute top-1/2 -translate-y-1/2 left-2 md:left-3 text-gray-400 w-4 h-4 md:w-7 md:h-7" />
                <Input
                    id="search"
                    placeholder="Search reviews by name or content"
                    className="border border-gray-300 bg-white rounded-lg placeholder:text-primary/50 placeholder:font-medium placeholder:text-base h-10 md:h-12 pl-8 md:pl-10 !py-0 md:!text-base max-md:placeholder:text-xs"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-4">
                <Button className="max-md:!px-3 max-md:py-1 max-md:h-auto" asChild>
                    <Link href="/vendor/packages/new"><Plus className="w-4" /> Create</Link>
                </Button>
            </div>
        </div>
    );
};

export default PackaeToolbar;