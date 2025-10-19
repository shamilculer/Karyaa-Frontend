import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

const VendorSorter = () => {

    return (
        <Select>
            <SelectTrigger
                id="sort"
                className="bg-[#F2F4FF] border rounded-4xl border-gray-300 text-primary hover:bg-gray-300 px-4 font-semibold "
            >
                <ArrowUpDown />
                <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="rating-high">Highest Rated</SelectItem>
                <SelectItem value="rating-low">Lowest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
        </Select>
    )
}

export default VendorSorter;