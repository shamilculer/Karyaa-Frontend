"use client"
import React, { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChevronDown } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { getEnquiriesByLocation } from "@/app/actions/vendor/analytics"

export const description = "Enquiries by Location Bar Chart with Timeframe Filter"

const chartConfig = {
    count: {
        label: "Enquiries",
        color: "#10b981",
    },
}

const timeframeLabelMap = {
    "24H": "Last 24 Hours",
    "1W": "Last 1 Week",
    "1M": "Last 1 Month",
    "3M": "Last 3 Months",
    "6M": "Last 6 Months",
    "1Y": "Last Year"
};

function InquiriesByLocation() {
    const [timeframe, setTimeframe] = useState("1M")
    const [chartData, setChartData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const timeframeLabel = timeframeLabelMap[timeframe];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)

            const result = await getEnquiriesByLocation(timeframe)

            if (result.success && result.data) {
                // Color palette for bars (10 colors for top 10 locations)
                const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4", "#6366f1", "#f97316", "#14b8a6", "#84cc16"];

                // Transform data to match chart format with capitalization and colors
                const formattedData = result.data.map((item, index) => {
                    // Capitalize and clean location
                    const location = item.location || "Not Specified";
                    const capitalizedLocation = location
                        .split(/[-_\s]+/) // Split by hyphens, underscores, or spaces
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(" ");

                    return {
                        location: capitalizedLocation,
                        count: item.count,
                        fill: colors[index % colors.length], // Assign color based on index
                    };
                });
                setChartData(formattedData)
            } else {
                setError(result.message || "Failed to load data")
                setChartData([])
            }

            setLoading(false)
        }

        fetchData()
    }, [timeframe])

    const totalEnquiries = chartData.reduce((acc, item) => acc + item.count, 0)

    return (
        <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md max-lg:!py-4">
            <CardHeader className="flex flex-row items-start justify-between max-lg:!px-3">
                <div>
                    <CardTitle className="uppercase text-[#2F4A9D] font-medium tracking-widest text-base">
                        Enquiries by Location
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                        Top 10 locations for the {timeframeLabel}
                    </CardDescription>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-8 text-xs font-normal"
                        >
                            {timeframe}
                            <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setTimeframe("24H")}>24h</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("1W")}>1 Week</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("1M")}>1 Month</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("3M")}>3 Months</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("6M")}>6 Months</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("1Y")}>Last Year</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <p className="text-sm text-gray-500">Loading...</p>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <p className="text-sm text-gray-500">No data available for this period</p>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig}>
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="vertical"
                            margin={{ left: 20 }}
                        >
                            <CartesianGrid horizontal={false} />
                            <YAxis
                                dataKey="location"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                width={100}
                            />
                            <XAxis type="number" hide />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="count"
                                radius={5}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground max-lg:!text-xs">
                    Total enquiries from top locations: {totalEnquiries.toLocaleString()}
                </div>
            </CardFooter>
        </Card>
    )
}

export default InquiriesByLocation
