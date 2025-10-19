import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import OverViewStats from "../components/common/OverViewStats"
import PackageToolbar from "../components/PackageToolbar"
import { SquarePen, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

const PackagesPage = () => {
    return (
        <div className="h-full dashboard-container space-y-8 mb-16">
            <OverViewStats />

            <PackageToolbar />

            <div className="w-full grid grid-cols-3 gap-8">
                <PackageCard />
                <PackageCard />
                <PackageCard />
                <PackageCard />
                <PackageCard />
                <PackageCard />
            </div>
        </div>
    )
}

const PackageCard = () => {
    return (
        <Card className="p-4 px-6 border-gray-300 shadow-none">
            <CardHeader className="flex-between p-0">
                <div className="flex-center gap-2">
                    <span className="px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 font-medium text-xs">
                        Wedding
                    </span>
                    <span className="px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 font-medium text-xs">
                        Catering
                    </span>
                </div>

                <div className="text-xs">12 SEP 205</div>
            </CardHeader>

            <CardContent className="p-0">
                <h3 className="!text-[20px] mb-2">Wedding Package</h3>
                <p className="text-sm font-medium text-gray-700 mb-2">This package includes:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-4">
                    {/* {packageData.description.slice(0, 3).map((item, index) => ( // Display max 3 items
                        <li key={index} className="truncate">{item}</li>
                    ))}
                    {packageData.description.length > 3 && (
                        <li className="list-none pl-4 text-gray-400">....</li>
                    )} */}

                    <li  className="truncate">lorem ipsum dolor sit amit</li>
                    <li  className="truncate">lorem ipsum dolor sit amit</li>
                    <li  className="truncate">lorem ipsum dolor sit amit</li>
                    <li className="list-none pl-4 text-gray-400">....</li>
                </ul>
            </CardContent>

            <CardFooter className="p-0 pt-3 border-t border-t-gray-300 flex items-center justify-end gap-4">
                <Button variant="ghost" className="px-3 h-9"><SquarePen className="w-4" /> Edit</Button>
                <Button variant="ghost" className="px-3 h-9"><Trash className="w-4" /> Delete</Button>
            </CardFooter>
        </Card>
    )
}

export default PackagesPage