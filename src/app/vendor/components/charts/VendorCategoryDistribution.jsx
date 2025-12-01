"use client"
import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"
import { LayoutList } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { getVendorDistribution } from "@/app/actions/admin/platformAnalytics"

export const description = "Vendor Distribution by Service Category (Solid Pie Chart)"

// Define custom CSS variables for chart colors
const customChartStyles = `
    .chart-container-vendor {
        --chart-1: hsl(200, 70%, 50%); /* Photography & Video - Blue */
        --chart-2: hsl(10, 80%, 55%);  /* Catering - Reddish */
        --chart-3: hsl(40, 90%, 60%);  /* Event Venues - Yellow/Orange */
        --chart-4: hsl(300, 70%, 55%); /* Event Planning - Purplish */
        --chart-5: hsl(140, 60%, 45%); /* Entertainment - Green */
        --chart-6: hsl(270, 50%, 60%); /* Decor & Rentals - Indigo */
        --chart-7: hsl(0, 0%, 50%);    /* Others - Gray */
        --chart-8: hsl(180, 70%, 40%); /* Teal */
        --chart-9: hsl(330, 70%, 50%); /* Pink */
        --chart-10: hsl(60, 80%, 40%); /* Olive */
    }
`;

function VendorCategoryDistribution() {
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data for "1Y" or "All Time" to get a good distribution, 
                // defaulting to 6M as per controller default if not specified, 
                // but let's use a wide range or default to ensure we see enough data.
                // The controller defaults to 6M if not provided.
                const response = await getVendorDistribution("1Y")

                if (response.success && response.data) {
                    // Transform API data: { _id: "Category Name", count: 10 }
                    // To: { category: "Category Name", count: 10, fill: "var(--chart-N)" }
                    const transformedData = response.data.map((item, index) => ({
                        category: item._id,
                        count: item.count,
                        fill: `var(--chart-${(index % 10) + 1})` // Cycle through 10 colors
                    }))
                    setData(transformedData)
                } else {
                    setError("Failed to load vendor data")
                }
            } catch (err) {
                console.error("Error loading vendor distribution:", err)
                setError("An error occurred loading data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const totalVendors = React.useMemo(() => {
        return data.reduce((sum, item) => sum + item.count, 0);
    }, [data]);

    const chartConfig = React.useMemo(() => {
        return data.reduce((acc, item, index) => {
            acc[item.category.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()] = {
                label: item.category,
                color: item.fill,
            };
            return acc;
        }, {});
    }, [data]);

    if (loading) {
        return (
            <Card className="flex flex-col h-full w-full bg-white border border-gray-200 shadow-lg rounded-xl p-6 items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="flex flex-col h-full w-full bg-white border border-gray-200 shadow-lg rounded-xl p-6 items-center justify-center min-h-[400px]">
                <p className="text-red-500">{error}</p>
            </Card>
        )
    }

    if (data.length === 0) {
        return (
            <Card className="flex flex-col h-full w-full bg-white border border-gray-200 shadow-lg rounded-xl p-6 items-center justify-center min-h-[400px]">
                <p className="text-gray-500">No vendor data available</p>
            </Card>
        )
    }

    return (
        <div className="chart-container-vendor">
            <style jsx="true">
                {customChartStyles}
            </style>

            <Card className="flex flex-col h-full w-full bg-white border border-gray-200 shadow-lg rounded-xl p-0 gap-0">
                {/* TIGHTENED CARD HEADER PADDING (pb-2) */}
                <CardHeader className="flex flex-row items-start justify-between p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <LayoutList className="size-6 text-indigo-600" />
                        <div>
                            <CardTitle className="uppercase text-indigo-600 font-bold tracking-wider text-base">
                                Vendor By Categories
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500 mt-1">
                                Breakdown of {totalVendors.toLocaleString()} registered vendors.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                {/* TIGHTENED CARD CONTENT PADDING (pb-2, pt-2) */}
                <CardContent className="flex-1 pb-2 pt-2">
                    <ChartContainer
                        config={chartConfig}
                        // Set max-height to visually reduce card height
                        className="mx-auto aspect-square max-h-[300px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        hideLabel
                                        formatter={(value, name, item) => [
                                            `${value.toLocaleString()} `,
                                            item.payload.category
                                        ]}
                                    />
                                }
                            />
                            <Pie
                                data={data}
                                dataKey="count"
                                nameKey="category"
                                innerRadius={0}
                                outerRadius={140} // Increased size for a bigger chart
                                strokeWidth={3}
                                paddingAngle={2}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.fill} // Explicitly setting fill color for the cell
                                        stroke={entry.fill} // Ensures the border (stroke) matches the fill color
                                        strokeWidth={1}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>

                <CardFooter className="flex flex-col gap-2 border-t border-gray-100 p-4">
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 w-full">
                        {data.map((item) => {
                            const percentage = totalVendors > 0 ? ((item.count / totalVendors) * 100).toFixed(1) : 0;
                            return (
                                <div key={item.category} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 font-medium text-gray-700">
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.fill }}
                                        />
                                        {item.category}
                                    </div>
                                    <div className="text-right">
                                        <span className="font-semibold text-gray-900">{percentage}%</span>
                                        <span className="text-gray-500 ml-1">({item.count})</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default VendorCategoryDistribution