"use client"
import React, { useState, useEffect } from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import { getProfileViewsOverTime } from "@/app/actions/vendor/analytics"

export const description = "Profile Views Over Time Area Chart with Timeframe Filter"

const chartConfig = {
    views: {
        label: "Profile Views",
        color: "hsl(142, 76%, 36%)", // Green
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

function ProfileViewsOverTime() {
    const [timeframe, setTimeframe] = useState("6M")
    const [chartData, setChartData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const timeframeLabel = timeframeLabelMap[timeframe];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)

            const result = await getProfileViewsOverTime(timeframe)

            if (result.success && result.data) {
                // Transform data to match chart format
                const formattedData = result.data.map(item => ({
                    time: item.period,
                    views: item.views,
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

    // Calculate performance indicator
    const firstPeriodViews = chartData[0]?.views || 0;
    const lastPeriodViews = chartData[chartData.length - 1]?.views || 0;
    const viewChange = lastPeriodViews - firstPeriodViews;
    const percentageChange = firstPeriodViews > 0
        ? ((viewChange / firstPeriodViews) * 100).toFixed(1)
        : "N/A";
    const isPositiveTrend = viewChange >= 0;
    const totalViews = chartData.reduce((acc, item) => acc + item.views, 0);

    return (
        <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md max-lg:!py-4">
            <CardHeader className="flex flex-row items-start justify-between max-lg:!px-3">
                <div>
                    <CardTitle className="uppercase text-[#2F4A9D] font-medium tracking-widest text-base">
                        Profile Views Over Time
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                        Showing total profile views for the {timeframeLabel}
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
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{ left: 12, right: 12 }}
                        >
                            <defs>
                                <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0.1} />
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
                                tickFormatter={(value) => value.slice(0, 10)}
                            />
                            <ChartTooltip
                                cursor={{ stroke: 'var(--color-views)', strokeDasharray: '2 2' }}
                                content={<ChartTooltipContent indicator="line" nameKey="views" />}
                            />
                            <Area
                                dataKey="views"
                                type="natural"
                                fill="url(#fillViews)"
                                fillOpacity={0.4}
                                stroke="var(--color-views)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none max-lg:!text-xs">
                    {percentageChange !== "N/A" && (
                        <>
                            {isPositiveTrend ? "Up" : "Down"} by {Math.abs(percentageChange)}% this period
                            <TrendingUp className={`h-4 w-4 ${isPositiveTrend ? "text-green-500" : "text-red-500"} ${!isPositiveTrend ? 'rotate-180' : ''}`} />
                        </>
                    )}
                </div>
                <div className="leading-none text-muted-foreground max-lg:!text-xs">
                    Total profile views in the {timeframeLabel}: {totalViews.toLocaleString()}
                </div>
            </CardFooter>
        </Card>
    )
}

export default ProfileViewsOverTime