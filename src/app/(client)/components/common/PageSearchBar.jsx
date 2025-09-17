import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"


const PageSearchBar = () => {
  return (
    <div className="flex items-end lg:gap-10 w-full max-lg:flex-wrap">
      {/* Search Input */}
      <div className="w-4/6 lg:w-3/5 pr-2.5 lg:pr-0">
        <Label htmlFor="search" className="text-primary mb-2 lg:mb-3.5 max-lg:text-sm">Search</Label>
        <Input
          id="search"
          placeholder="Type here..."
          className="border-0 border-b border-primary rounded-none placeholder:text-primary/50 placeholder:font-medium placeholder:text-base"
        />
      </div>

      {/* Location Select */}
      <div className="w-2/6 lg:w-1/4 pl-2.5 lg:pl-0">
        <Label htmlFor="location" className="text-primary mb-3.5 max-sm:hidden">Location</Label>
        <Select>
          <SelectTrigger
            id="location"
            className="w-full border-0 border-b border-primary rounded-none  text-primary/50 font-medium"
          >
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dubai">Dubai</SelectItem>
            <SelectItem value="abu-dhabi">Abu Dhabi</SelectItem>
            <SelectItem value="sharjah">Sharjah</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Button */}
      <Button className="w-full lg:w-1/6 mt-5 lg:mt-0">
        Search Your Vendor
      </Button>
    </div>
  )
}

export default PageSearchBar
