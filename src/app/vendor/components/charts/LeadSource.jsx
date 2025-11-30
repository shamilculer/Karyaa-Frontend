"use client"
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { useState, useEffect } from "react"
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
import { getProfileViewSourceBreakdown } from "@/app/actions/vendor/analytics"

export const description = "Profile view source breakdown (donut chart) with timeframe filter"

const chartConfig = {
    leads: {
        label: "Views",
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
        label: "Direct Link",
        color: "var(--chart-4)",
    },
    other: {
        label: "Other",
        color: "var(--chart-5)",
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

const colorMap = {
    category: "var(--chart-1)",
    search: "var(--chart-2)",
    featured: "var(--chart-3)",
    direct: "var(--chart-4)",
    other: "var(--chart-5)",
};

function LeadSource() {
    const [timeframe, setTimeframe] = useState("6M")
    const [chartData, setChartData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const timeframeLabel = timeframeLabelMap[timeframe];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)

            const result = await getProfileViewSourceBreakdown(timeframe)

            if (result.success && result.data) {
                // Transform data to match chart format
                const formattedData = result.data.map(item => ({
                    source: item.label || item.source,
                    leads: item.count,
                    fill: colorMap[item.source] || "var(--chart-5)",
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

    const totalLeads = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.leads, 0)
    }, [chartData])

    return (
        <Card className="flex flex-col h-full w-full bg-white border border-gray-200 shadow-none rounded-md max-lg:!py-4">
            <CardHeader className="flex flex-row items-start justify-between pb-0 max-lg:!px-3">
                <div>
                    <CardTitle className="uppercase text-[#2F4A9D] font-medium tracking-widest text-base">
                        Profile View Sources
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
                                data={chartData}
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
                                                        Total Views
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-4 text-sm pt-4">
                {chartData.map((item) => {
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