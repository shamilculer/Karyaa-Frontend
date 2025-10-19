"use client"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useState } from "react" 
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
import { ChevronDown } from "lucide-react"

export const description = "Profile Views Over Time Area Chart with Full Timeframe Filter"

// --- DUMMY DATA ---
// NOTE: For 24h/1 Week, the 'unit' on the XAxis would be hours/days, 
// but for simplicity in this React example, we'll simulate the data size 
// and label it with the appropriate date unit (e.g., 'Day 1', 'Week 1', 'Month 1').

// Dummy data for different granularity (real data would be fetched)
const data24h = Array.from({ length: 8 }, (_, i) => ({ time: `${i * 3}:00`, profileViews: Math.floor(Math.random() * 50) + 10 })); // 8 data points, 3 hours apart
const data1Week = Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i + 1}`, profileViews: Math.floor(Math.random() * 200) + 50 })); // 7 data points, daily
const data1Month = Array.from({ length: 4 }, (_, i) => ({ time: `Week ${i + 1}`, profileViews: Math.floor(Math.random() * 500) + 100 })); // 4 data points, weekly
const data3Month = [
    { time: "Jul", profileViews: 400 },
    { time: "Aug", profileViews: 650 },
    { time: "Sep", profileViews: 520 },
];
const data6Month = [
    { time: "Apr", profileViews: 480 },
    { time: "May", profileViews: 550 },
    { time: "Jun", profileViews: 400 },
    ...data3Month
];
const dataLastYear = [
    { time: "Jan", profileViews: 300 },
    { time: "Feb", profileViews: 350 },
    { time: "Mar", profileViews: 420 },
    ...data6Month,
    { time: "Oct", profileViews: 780 },
    { time: "Nov", profileViews: 610 },
    { time: "Dec", profileViews: 850 },
];
// --- END DUMMY DATA ---

const chartConfig = {
    profileViews: {
        label: "Profile Views",
        color: "hsl(227, 54%, 39%)", // Royal Blue
    },
}

// Function to simulate data filtering based on timeframe
const filterData = (timeframe) => {
    switch (timeframe) {
        case "24H":
            return data24h;
        case "1W":
            return data1Week;
        case "1M":
            return data1Month;
        case "3M":
            return data3Month;
        case "6M":
            return data6Month;
        case "1Y":
            return dataLastYear;
        default:
            return data6Month; // Default to 6 months
    }
}


function ProfileViewsOverTime() {
    const [timeframe, setTimeframe] = useState("6M")
    const currentChartData = filterData(timeframe)

    // Calculate performance indicator based on filtered data
    const firstPeriodViews = currentChartData[0]?.profileViews || 0;
    const lastPeriodViews = currentChartData[currentChartData.length - 1]?.profileViews || 0;
    const viewChange = lastPeriodViews - firstPeriodViews;
    const percentageChange = firstPeriodViews > 0 
        ? ((viewChange / firstPeriodViews) * 100).toFixed(1) 
        : "N/A";
    const isPositiveTrend = viewChange >= 0;
    const totalViews = currentChartData.reduce((acc, item) => acc + item.profileViews, 0);

    // Map for displaying friendly labels
    const timeframeLabelMap = { 
        "24H": "Last 24 Hours", 
        "1W": "Last 1 Week", 
        "1M": "Last 1 Month", 
        "3M": "Last 3 Months", 
        "6M": "Last 6 Months", 
        "1Y": "Last Year" 
    };
    const timeframeLabel = timeframeLabelMap[timeframe];


    return (
        <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md">
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="uppercase text-[#2F4A9D] font-medium tracking-widest text-base">
                        Profile Views Over Time
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                        Showing total profile visits for the {timeframeLabel}
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
                >
                    <AreaChart
                        accessibilityLayer
                        data={currentChartData} // Use filtered data
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <defs>
                            <linearGradient id="fillProfileViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-profileViews)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-profileViews)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="time" // Now using 'time' for all units (hour, day, week, month)
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            // Simplified formatter for the purpose of this example
                            tickFormatter={(value) => value} 
                        />
                        <ChartTooltip
                            cursor={{ stroke: 'var(--color-profileViews)', strokeDasharray: '2 2' }}
                            content={
                                <ChartTooltipContent 
                                    indicator="line" 
                                    nameKey="profileViews"
                                />
                            }
                        />
                        <Area
                            dataKey="profileViews"
                            type="natural"
                            fill="url(#fillProfileViews)"
                            fillOpacity={0.4}
                            stroke="var(--color-profileViews)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    {isPositiveTrend ? "Up" : "Down"} by {percentageChange}% this period 
                    <TrendingUp className={`h-4 w-4 ${isPositiveTrend ? "text-green-500" : "text-red-500"} ${!isPositiveTrend ? 'rotate-180' : ''}`} />
                </div>
                <div className="leading-none text-muted-foreground">
                    Total views in the {timeframeLabel}: {totalViews.toLocaleString()}
                </div>
            </CardFooter>
        </Card>
    )
}

export default ProfileViewsOverTime