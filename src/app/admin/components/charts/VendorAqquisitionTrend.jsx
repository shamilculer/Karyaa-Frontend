"use client"

import * as React from "react"
import { TrendingUp, Users, ChevronDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts" 
import { useState } from "react"

// --- CORRECT SHADCN/UI IMPORTS ---
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


// --- DUMMY DATA for Vendors ---
// Data is structured as { time: string, vendors: number }
const data24h = Array.from({ length: 8 }, (_, i) => ({ time: `${i * 3}:00`, vendors: Math.floor(Math.random() * 5) + 1 })); 
const data1Week = Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i + 1}`, vendors: Math.floor(Math.random() * 10) + 2 })); 
const data1Month = Array.from({ length: 4 }, (_, i) => ({ time: `Week ${i + 1}`, vendors: Math.floor(Math.random() * 25) + 5 })); 
const data3Month = [
    { time: "Jul", vendors: 45 },
    { time: "Aug", vendors: 62 },
    { time: "Sep", vendors: 38 },
];
const data6Month = [
    { time: "Apr", vendors: 30 },
    { time: "May", vendors: 50 },
    { time: "Jun", vendors: 40 },
    ...data3Month
];
const dataLastYear = [
    { time: "Jan", vendors: 35 },
    { time: "Feb", vendors: 40 },
    { time: "Mar", vendors: 32 },
    ...data6Month,
    { time: "Oct", vendors: 70 },
    { time: "Nov", vendors: 55 },
    { time: "Dec", vendors: 80 },
];

const chartConfig = {
    vendors: {
        label: "New Vendors",
        // Using a custom CSS variable for a distinct growth color
        color: "hsl(150, 60%, 40%)", 
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


const VendorAcquisitionOverTime = () => {
    const [timeframe, setTimeframe] = useState("6M")
    const currentChartData = filterData(timeframe)
    const timeframeLabel = timeframeLabelMap[timeframe];
    
    // --- Performance Calculation ---
    const firstPeriodVendors = currentChartData[0]?.vendors || 0;
    const lastPeriodVendors = currentChartData[currentChartData.length - 1]?.vendors || 0;
    const vendorChange = lastPeriodVendors - firstPeriodVendors;
    const percentageChange = firstPeriodVendors > 0 
        ? ((vendorChange / firstPeriodVendors) * 100).toFixed(1) 
        : "N/A";
    const isPositiveTrend = vendorChange >= 0;
    const totalVendors = currentChartData.reduce((acc, item) => acc + item.vendors, 0);


    return (
        <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md">
            <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-700" />
                    <div>
                        <CardTitle className="uppercase text-green-700 font-medium tracking-widest text-base">
                            Vendor Acquisition Trend
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                            Showing new vendor registrations for the {timeframeLabel}
                        </CardDescription>
                    </div>
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
                        <DropdownMenuItem onSelect={() => setTimeframe("24H")}> 24h </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("1W")}> 1 Week </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("1M")}> 1 Month </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("3M")}> 3 Months </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("6M")}> 6 Months </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("1Y")}> Last Year </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </CardHeader>
            <CardContent>
                <ChartContainer 
                    config={chartConfig}
                    className="aspect-[9/4]"
                >
                    <AreaChart
                        accessibilityLayer
                        data={currentChartData}
                        margin={{ left: 12, right: 12 }}
                    >
                        <defs>
                            <linearGradient id="fillVendors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-vendors)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-vendors)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid 
                            vertical={false} 
                            horizontal={true} 
                            stroke="#E0E0E0"
                            strokeDasharray="3 3" 
                        /> 
                        
                        <YAxis hide={true} domain={['dataMin', 'dataMax']} />

                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.length > 4 ? value.slice(0, 3) : value} 
                            className="text-xs text-muted-foreground"
                        />
                        <ChartTooltip
                            cursor={{ stroke: 'var(--color-vendors)', strokeDasharray: '2 2' }}
                            content={
                                <ChartTooltipContent 
                                    indicator="line" 
                                    nameKey="vendors"
                                />
                            }
                        />
                        <Area
                            dataKey="vendors"
                            type="natural"
                            fill="url(#fillVendors)"
                            fillOpacity={0.4}
                            stroke="var(--color-vendors)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    {/* Display the trend calculation */}
                    {isPositiveTrend ? "Up" : "Down"} by {percentageChange}% vs. previous period 
                    <TrendingUp 
                        className={`h-4 w-4 transition-transform duration-300 ${isPositiveTrend ? "text-green-500" : "text-red-500"} ${!isPositiveTrend ? 'rotate-180' : ''}`} 
                    />
                </div>
                <div className="leading-none text-muted-foreground">
                    Total new vendors registered in the {timeframeLabel}: {totalVendors.toLocaleString()}
                </div>
            </CardFooter>
        </Card>
    )
}

export default VendorAcquisitionOverTime