"use client"
import React, { useState, useMemo } from "react"
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

export const description = "Profile Visits vs Enquiries (Bar Chart with Timeframe Filter)"

const fullChartData = [
    { month: "January", visits: 1200, enquiries: 85 },
    { month: "February", visits: 950, enquiries: 70 },
    { month: "March", visits: 1400, enquiries: 110 },
    { month: "April", visits: 800, enquiries: 55 },
    { month: "May", visits: 1600, enquiries: 125 },
    { month: "June", visits: 1300, enquiries: 95 },
]

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
    const [timeframe, setTimeframe] = useState("6m")

    const chartData = useMemo(() => {
        if (timeframe === "3m") {
            return fullChartData.slice(-3)
        }
        return fullChartData
    }, [timeframe])

    const months = chartData.map(d => d.month)
    const cardDescription = months.length > 0
        ? `${months[0]} – ${months[months.length - 1]}`
        : "No data available"

    return (
        <Card className="w-full h-full bg-white border border-gray-200 shadow-none rounded-md">
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="uppercase text-sidebar-foreground font-normal tracking-widest">
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
                        <SelectItem value="3m">Last 3 Months</SelectItem>
                        <SelectItem value="6m">Last 6 Months</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="visits" fill="#2563EB" radius={4} />
                        <Bar dataKey="enquiries" fill="#10B981" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex gap-6 text-sm">
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
                    Showing profile visits vs enquiries for the last {timeframe === "3m" ? "3" : "6"} months.
                </div>
            </CardFooter>
        </Card>
    )
}

export default VisitAndEnquiries
