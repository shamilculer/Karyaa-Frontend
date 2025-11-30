"use client"
import React, { useState, useEffect, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getViewsVsEnquiries } from "@/app/actions/vendor/analytics"

export const description = "Profile Visits vs Enquiries (Bar Chart with Timeframe Filter)"

const chartConfig = {
    visits: {
        label: "Profile Visits",
        color: "#2563EB", // Blue
    },
    enquiries: {
        label: "Enquiries",
        color: "#10B981", // Green
    },
}

function VisitAndEnquiries() {
    const [timeframe, setTimeframe] = useState("1m")
    const [chartData, setChartData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)

            // Map UI timeframe to API timeframe
            let apiTimeframe = "6M";
            if (timeframe === "1m") apiTimeframe = "1M";
            else if (timeframe === "3m") apiTimeframe = "3M";

            const result = await getViewsVsEnquiries(apiTimeframe)

            if (result.success && result.data) {
                // Transform data to match chart format
                const formattedData = result.data.map(item => ({
                    month: item.period,
                    visits: item.views,
                    enquiries: item.enquiries,
                }))
                setChartData(formattedData)
            } else {
                setError(result.message || "Failed to load data")
                setChartData([])
            }

            setLoading(false)
        }

        fetchData()
    }, [timeframe])

    const months = chartData.map(d => d.month)
    const cardDescription = months.length > 0
        ? `${months[0]} – ${months[months.length - 1]}`
        : "No data available"

    return (
        <Card className="w-full h-full bg-white border border-gray-200 shadow-none rounded-md max-lg:!py-4">
            <CardHeader className="flex flex-row items-start justify-between max-lg:!px-3">
                <div>
                    <CardTitle className="uppercase text-sidebar-foreground font-normal tracking-widest max-lg:!text-base">
                        Profile Visits vs Enquiries
                    </CardTitle>
                    <CardDescription className="text-xs">
                        {cardDescription}
                    </CardDescription>
                </div>
                {/* Timeframe Filter Dropdown */}
                <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="h-8 w-[130px] text-xs">
                        <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1m">Last 1 Month</SelectItem>
                        <SelectItem value="3m">Last 3 Months</SelectItem>
                        <SelectItem value="6m">Last 6 Months</SelectItem>
                    </SelectContent>
                </Select>
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
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 10)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dashed" />}
                            />
                            <Bar dataKey="visits" fill="#2563EB" radius={4} />
                            <Bar dataKey="enquiries" fill="#10B981" radius={4} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex max-lg:flex-col max-lg:items-start gap-3 lg:gap-6 text-sm">
                {/* Legends */}
                <div className="flex items-center gap-2">
                    <span
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: chartConfig.visits.color }}
                    ></span>
                    <span>{chartConfig.visits.label}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: chartConfig.enquiries.color }}
                    ></span>
                    <span>{chartConfig.enquiries.label}</span>
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing profile visits vs enquiries for the last {timeframe === "1m" ? "1" : timeframe === "3m" ? "3" : "6"} months.
                </div>
            </CardFooter>
        </Card>
    )
}

export default VisitAndEnquiries
