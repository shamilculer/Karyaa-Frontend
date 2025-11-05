"use client"
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { useState } from "react" // Import useState hook
import { ChevronDown } from "lucide-react" // For the dropdown icon
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

export const description = "Lead source breakdown (donut chart) with timeframe filter"

const chartConfig = {
    leads: {
        label: "Leads",
    },
    category: {
        label: "Category Page",
        color: "var(--chart-1)",
    },
    search: {
        label: "Search Results",
        color: "var(--chart-2)",
    },
    featured: {
        label: "Featured Vendors",
        color: "var(--chart-3)",
    },
    direct: {
        label: "Direct Link/Traffic", // Renamed for clarity
        color: "var(--chart-4)",
    },
}

// Function to simulate dummy data for different timeframes
const getLeadData = (factor) => {
    // Base data (e.g., for 1 Month, factor = 1)
    const baseLeads = {
        category: 40, 
        search: 60, 
        featured: 25, 
        direct: 15
    };
    
    // Scale the data by the factor and round it
    const scaledData = {
        category: Math.round(baseLeads.category * factor),
        search: Math.round(baseLeads.search * factor),
        featured: Math.round(baseLeads.featured * factor),
        direct: Math.round(baseLeads.direct * factor),
    };

    return [
        { source: "Category", leads: scaledData.category, fill: "var(--chart-1)" },
        { source: "Search", leads: scaledData.search, fill: "var(--chart-2)" },
        { source: "Featured", leads: scaledData.featured, fill: "var(--chart-3)" },
        { source: "Direct", leads: scaledData.direct, fill: "var(--chart-4)" },
    ];
};

// Function to simulate data filtering based on timeframe
const filterData = (timeframe) => {
    switch (timeframe) {
        case "24H": // Very small amount of leads
            return getLeadData(0.1); 
        case "1W": // About 1/4 of a month
            return getLeadData(0.25);
        case "1M": // Base leads
            return getLeadData(1);
        case "3M": 
            return getLeadData(2.5);
        case "6M": // Default
            return getLeadData(5); 
        case "1Y": // Full year data
            return getLeadData(10); 
        default:
            return getLeadData(5);
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


function LeadSource() {
    const [timeframe, setTimeframe] = useState("6M")
    const currentChartData = filterData(timeframe)
    const timeframeLabel = timeframeLabelMap[timeframe];

    const totalLeads = React.useMemo(() => {
        return currentChartData.reduce((acc, curr) => acc + curr.leads, 0)
    }, [currentChartData])

    return (
        <Card className="flex flex-col h-full w-full bg-white border border-gray-200 shadow-none rounded-md max-lg:!py-4">
            <CardHeader className="flex flex-row items-start justify-between pb-0 max-lg:!px-3">
                <div>
                    <CardTitle className="uppercase text-[#2F4A9D] font-medium tracking-widest text-base">
                        Lead Sources
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                        Showing breakdown for the {timeframeLabel}
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
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[450px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={currentChartData} // Use filtered data
                            dataKey="leads"
                            nameKey="source"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalLeads.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-sm"
                                                >
                                                    Total Leads
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-4 text-sm pt-4">
                {currentChartData.map((item) => {
                    const percentage = totalLeads > 0 ? ((item.leads / totalLeads) * 100).toFixed(1) : 0;
                    return (
                        <div key={item.source} className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full max-lg:!text-sm"
                                style={{ backgroundColor: `${item.fill}` }}
                            />
                            <span className="max-lg:!text-sm">
                                {item.source}: **{percentage}%** ({item.leads})
                            </span>
                        </div>
                    );
                })}
            </CardFooter>
        </Card>
    )
}

export default LeadSource