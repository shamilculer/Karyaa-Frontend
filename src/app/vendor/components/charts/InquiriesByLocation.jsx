"use client"
import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { useState } from "react" 
import { ChevronDown } from "lucide-react" 
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
// Hypothetical UI components for the dropdown
import { Button } from "@/components/ui/button" 
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu" 


export const description = "Inquiries by Location Horizontal Bar Chart with Timeframe Filter"

// --- DUMMY DATA & FILTER LOGIC ---
const DUBAI_AREAS = [
    "Dubai Marina", "Downtown Dubai", "Jumeirah Lake Towers (JLT)", 
    "Business Bay", "Palm Jumeirah", "Al Barsha", "Jumeirah",
    "International City", "Silicon Oasis", "Other"
];

// Function to simulate dummy data for different timeframes
const getInquiryData = (factor) => {
    // Base data (e.g., for 1 Month, factor = 1) - Data is sorted by popularity
    const baseInquiries = [15, 12, 10, 9, 8, 6, 5, 4, 3, 2].map(inq => inq * factor);
    
    const data = DUBAI_AREAS.map((area, index) => ({
        location: area,
        inquiries: Math.round(baseInquiries[index] || 0)
    }));
    
    // Sort the data to ensure the chart always shows the top locations first
    return data.sort((a, b) => b.inquiries - a.inquiries);
};

// Function to simulate data filtering based on timeframe
const filterData = (timeframe) => {
    switch (timeframe) {
        case "24H":
            return getInquiryData(0.05).slice(0, 5); // Show only top 5 for 24h
        case "1W":
            return getInquiryData(0.15).slice(0, 7); // Show only top 7 for 1W
        case "1M":
            return getInquiryData(1);
        case "3M":
            return getInquiryData(3);
        case "6M":
            return getInquiryData(6); // Default
        case "1Y":
            return getInquiryData(12);
        default:
            return getInquiryData(6);
    }
}

// Map for displaying friendly labels
const timeframeLabelMap = { 
    "24H": "Last 24 Hours", 
    "1W": "Last 1 Week", 
    "1M": "Last 1 Month", 
    "3M": "Last 3 Months", 
    "6M": "Last 6 Months", 
    "1Y": "Last Year" 
};


const chartConfig = {
    inquiries: {
        label: "Inquiries",
        color: "hsl(227, 54%, 39%)", // Royal Blue
    },
}


function InquiriesByLocation() {
    const [timeframe, setTimeframe] = useState("6M")
    const currentChartData = filterData(timeframe)
    const timeframeLabel = timeframeLabelMap[timeframe];

    const totalInquiries = React.useMemo(() => {
        return currentChartData.reduce((acc, curr) => acc + curr.inquiries, 0)
    }, [currentChartData])


    return (
        <Card className="flex flex-col h-full w-full bg-white border border-gray-200 shadow-none rounded-md max-lg:py-3">
            <CardHeader className="flex flex-row items-start justify-between pb-0 max-lg:px-3">
                <div>
                    <CardTitle className="uppercase text-[#2F4A9D] font-medium tracking-widest text-base">
                        Inquiries by Location
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                        Top lead generating areas in the {timeframeLabel} (Total: {totalInquiries.toLocaleString()})
                    </CardDescription>
                </div>

                {/* Dropdown Menu for Timeframe Filter */}
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
                        <DropdownMenuItem onSelect={() => setTimeframe("24H")}>
                            24h
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("1W")}>
                            1 Week
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("1M")}>
                            1 Month
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("3M")}>
                            3 Months
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("6M")}>
                            6 Months
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("1Y")}>
                            Last Year
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
                <ChartContainer 
                    config={chartConfig}
                    // Adjusted height to better fit horizontal bars
                >
                    <BarChart
                        accessibilityLayer
                        data={currentChartData}
                        layout="vertical" // KEY CHANGE: Makes the chart horizontal
                        margin={{
                            left: 0,
                            right: 20,
                            top: 10,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                        <XAxis
                            type="number" // X-axis is now numerical (inquiry count)
                            tickLine={false}
                            axisLine={false}
                            className="text-xs"
                            padding={{ left: 10, right: 10 }}
                        />
                         <YAxis
                            dataKey="location" // Y-axis is now categorical (location name)
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            className="text-xs"
                            width={120} // Give space for long location names
                        />
                        <ChartTooltip
                            cursor={{ fill: "hsl(210 40% 96.1%)" }}
                            content={
                                <ChartTooltipContent
                                    nameKey="location"
                                    hideLabel
                                    indicator="dot"
                                />
                            }
                        />
                        <Bar 
                            dataKey="inquiries" 
                            fill="var(--color-inquiries)" 
                            radius={4} 
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default InquiriesByLocation