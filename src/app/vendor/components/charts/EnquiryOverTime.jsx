"use client"
import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts" // YAxis is required for horizontal lines
import { useState } from "react"
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
// Hypothetical UI components for the dropdown
import { Button } from "@/components/ui/button" 
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu" 


export const description = "Enquiries Over Time Area Chart with Timeframe Filter and Gridlines"

// --- DUMMY DATA ---
const data24h = Array.from({ length: 8 }, (_, i) => ({ time: `${i * 3}:00`, enquiries: Math.floor(Math.random() * 10) + 1 })); 
const data1Week = Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i + 1}`, enquiries: Math.floor(Math.random() * 20) + 5 })); 
const data1Month = Array.from({ length: 4 }, (_, i) => ({ time: `Week ${i + 1}`, enquiries: Math.floor(Math.random() * 50) + 10 })); 
const data3Month = [
    { time: "Jul", enquiries: 120 },
    { time: "Aug", enquiries: 180 },
    { time: "Sep", enquiries: 95 },
];
const data6Month = [
    { time: "Apr", enquiries: 80 },
    { time: "May", enquiries: 150 },
    { time: "Jun", enquiries: 100 },
    ...data3Month
];
const dataLastYear = [
    { time: "Jan", enquiries: 110 },
    { time: "Feb", enquiries: 130 },
    { time: "Mar", enquiries: 90 },
    ...data6Month,
    { time: "Oct", enquiries: 220 },
    { time: "Nov", enquiries: 160 },
    { time: "Dec", enquiries: 245 },
];

const chartConfig = {
    enquiries: {
        label: "Enquiries",
        color: "hsl(227, 54%, 39%)", // Royal Blue
    },
}

const filterData = (timeframe) => {
    switch (timeframe) {
        case "24H": return data24h;
        case "1W": return data1Week;
        case "1M": return data1Month;
        case "3M": return data3Month;
        case "6M": return data6Month;
        case "1Y": return dataLastYear;
        default: return data6Month;
    }
}

const timeframeLabelMap = { 
    "24H": "Last 24 Hours", 
    "1W": "Last 1 Week", 
    "1M": "Last 1 Month", 
    "3M": "Last 3 Months", 
    "6M": "Last 6 Months", 
    "1Y": "Last Year" 
};


function EnquiryOverTime() {
    const [timeframe, setTimeframe] = useState("6M")
    const currentChartData = filterData(timeframe)
    const timeframeLabel = timeframeLabelMap[timeframe];
    
    // Calculate performance indicator based on filtered data
    const firstPeriodEnquiries = currentChartData[0]?.enquiries || 0;
    const lastPeriodEnquiries = currentChartData[currentChartData.length - 1]?.enquiries || 0;
    const enquiryChange = lastPeriodEnquiries - firstPeriodEnquiries;
    const percentageChange = firstPeriodEnquiries > 0 
        ? ((enquiryChange / firstPeriodEnquiries) * 100).toFixed(1) 
        : "N/A";
    const isPositiveTrend = enquiryChange >= 0;
    const totalEnquiries = currentChartData.reduce((acc, item) => acc + item.enquiries, 0);


    return (
        <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md">
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="uppercase text-[#2F4A9D] font-medium tracking-widest text-base">
                        Enquiries Over Time
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                        Showing total leads generated for the {timeframeLabel}
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
            <CardContent>
                <ChartContainer 
                    config={chartConfig}
                    className=""
                >
                    <AreaChart
                        accessibilityLayer
                        data={currentChartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <defs>
                            <linearGradient id="fillEnquiries" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-enquiries)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-enquiries)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>

                        {/* FIX: Explicitly set stroke and ensure horizontal is true */}
                        <CartesianGrid 
                            vertical={false} 
                            horizontal={true} 
                            stroke="#E0E0E0" // Added explicit light gray stroke color
                            strokeDasharray="3 3" 
                        /> 
                        
                        {/* YAxis is required by CartesianGrid for horizontal lines, even if hidden. */}
                        <YAxis hide={true} domain={['dataMin', 'dataMax']} />

                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)} 
                        />
                        <ChartTooltip
                            cursor={{ stroke: 'var(--color-enquiries)', strokeDasharray: '2 2' }}
                            content={
                                <ChartTooltipContent 
                                    indicator="line" 
                                    nameKey="enquiries"
                                />
                            }
                        />
                        <Area
                            dataKey="enquiries"
                            type="natural"
                            fill="url(#fillEnquiries)"
                            fillOpacity={0.4}
                            stroke="var(--color-enquiries)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    {/* Display the trend calculation */}
                    {isPositiveTrend ? "Up" : "Down"} by {percentageChange}% this period 
                    <TrendingUp className={`h-4 w-4 ${isPositiveTrend ? "text-green-500" : "text-red-500"} ${!isPositiveTrend ? 'rotate-180' : ''}`} />
                </div>
                <div className="leading-none text-muted-foreground">
                    Total inquiries received in the {timeframeLabel}: {totalEnquiries.toLocaleString()}
                </div>
            </CardFooter>
        </Card>
    )
}

export default EnquiryOverTime