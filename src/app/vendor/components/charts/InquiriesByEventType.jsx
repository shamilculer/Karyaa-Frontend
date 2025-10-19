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


export const description = "Inquiries by Event Type Bar Chart with Timeframe Filter"

// --- DUMMY DATA ---
// Function to simulate dummy data for different timeframes
const getInquiryData = (factor) => {
    // Base data (e.g., for 1 Month, factor = 1)
    const baseInquiries = [
        { type: "Weddings", inquiries: 15 * factor },
        { type: "Corporate", inquiries: 25 * factor },
        { type: "Birthdays", inquiries: 30 * factor },
        { type: "Private Parties", inquiries: 20 * factor },
        { type: "Other", inquiries: 10 * factor },
    ];
    
    // Ensure all values are rounded integers
    return baseInquiries.map(item => ({
        ...item,
        inquiries: Math.round(item.inquiries)
    }));
};

// Function to simulate data filtering based on timeframe
const filterData = (timeframe) => {
    switch (timeframe) {
        case "24H":
            return getInquiryData(0.05); // Very small amount of inquiries
        case "1W":
            return getInquiryData(0.15);
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


function InquiriesByEventType() {
    const [timeframe, setTimeframe] = useState("6M")
    const currentChartData = filterData(timeframe)
    const timeframeLabel = timeframeLabelMap[timeframe];

    const totalInquiries = React.useMemo(() => {
        return currentChartData.reduce((acc, curr) => acc + curr.inquiries, 0)
    }, [currentChartData])


    return (
        <Card className="flex flex-col h-full w-full bg-white border border-gray-200 shadow-none rounded-md">
            <CardHeader className="flex flex-row items-start justify-between pb-0">
                <div>
                    <CardTitle className="uppercase text-[#2F4A9D] font-medium tracking-widest text-base">
                        Inquiries by Event Type
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                        Total {totalInquiries} inquiries received in the {timeframeLabel}
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
                    className="aspect-video max-h-[300px]"
                >
                    <BarChart
                        accessibilityLayer
                        data={currentChartData}
                        margin={{
                            left: -10,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="type"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            className="text-xs"
                        />
                         <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            className="text-xs"
                        />
                        <ChartTooltip
                            cursor={{ fill: "hsl(210 40% 96.1%)" }} // Light gray background for hover
                            content={
                                <ChartTooltipContent
                                    nameKey="type"
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

export default InquiriesByEventType