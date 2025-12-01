"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useState, useEffect } from "react"
import { ChevronDown, Activity } from "lucide-react"

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
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { getEngagementMetrics } from "@/app/actions/admin/platformAnalytics"

const timeframeLabelMap = {
    "24H": "Last 24 Hours",
    "1W": "Last 1 Week",
    "1M": "Last 1 Month",
    "3M": "Last 3 Months",
    "6M": "Last 6 Months",
    "1Y": "Last Year"
};

const chartConfig = {
    count: {
        label: "Count",
        color: "hsl(38, 92%, 50%)", // Orange
    },
}

function EngagementMetricsChart() {
    const [timeframe, setTimeframe] = useState("1M")
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const timeframeLabel = timeframeLabelMap[timeframe];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getEngagementMetrics(timeframe)

                if (response.success && response.data) {
                    // Transform the data for the chart
                    const transformedData = [
                        { metric: "Leads", count: response.data.leads },
                        { metric: "Reviews", count: response.data.reviews },
                        { metric: "Tickets", count: response.data.tickets },
                        { metric: "Blog Views", count: response.data.blogViews },
                    ]

                    setData(transformedData)
                } else {
                    setError(response.message || "Failed to fetch data")
                }
            } catch (err) {
                setError(err.message || "An error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [timeframe])

    const totalEngagements = React.useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.count, 0)
    }, [data])

    if (loading) {
        return (
            <Card className="flex flex-col h-full w-full bg-white border border-gray-200 shadow-none rounded-md">
                <CardContent className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading...</p>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="flex flex-col h-full w-full bg-white border border-gray-200 shadow-none rounded-md">
                <CardContent className="flex items-center justify-center h-64">
                    <p className="text-red-500">Error: {error}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col h-full w-full bg-white border border-gray-200 content-between shadow-none rounded-md">
            <CardHeader className="flex flex-row items-start justify-between pb-0">
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-orange-600" />
                    <div>
                        <CardTitle className="uppercase text-orange-600 font-medium tracking-widest text-base">
                            Platform Engagement Metrics
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                            Total {totalEngagements.toLocaleString()} engagements in the {timeframeLabel}
                        </CardDescription>
                    </div>
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
            <CardContent className="pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-video max-h-[350px]"
                >
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: -10,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid
                            vertical={true}
                            horizontal={true}
                            stroke="#d6d6d6ff"
                            strokeDasharray="3 3"
                        />
                        <XAxis
                            dataKey="metric"
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
                            cursor={{ fill: "hsl(210 40% 96.1%)" }}
                            content={
                                <ChartTooltipContent
                                    nameKey="metric"
                                    hideLabel
                                    indicator="dot"
                                />
                            }
                        />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default EngagementMetricsChart
