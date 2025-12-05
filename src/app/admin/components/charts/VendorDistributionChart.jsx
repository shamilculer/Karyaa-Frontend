"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useState, useEffect } from "react"
import { ChevronDown, LayoutGrid } from "lucide-react"

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
import { getVendorDistribution } from "@/app/actions/admin/platformAnalytics"

const timeframeLabelMap = {
    "24H": "Last 24 Hours",
    "1W": "Last 1 Week",
    "1M": "Last 1 Month",
    "3M": "Last 3 Months",
    "6M": "Last 6 Months",
    "1Y": "Last Year"
};

const chartConfig = {
    vendors: {
        label: "Vendors",
        color: "hsl(262, 83%, 58%)", // Purple
    },
}

function VendorDistributionChart() {
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
                const response = await getVendorDistribution(timeframe)

                if (response.success && response.data) {
                    // Transform the data for the chart
                    const transformedData = response.data.map(item => ({
                        category: item._id,
                        vendors: item.count
                    }))

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

    const totalVendors = React.useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.vendors, 0)
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
        <Card className="flex flex-col h-full w-full bg-white border border-gray-200 shadow-none rounded-md">
            <CardHeader className="flex flex-row items-start justify-between pb-0">
                <div className="flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-purple-600" />
                    <div>
                        <CardTitle className="uppercase text-purple-600 font-medium tracking-widest text-base">
                            Vendor Distribution by Category
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                            Total {totalVendors} vendors registered in the {timeframeLabel}
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
            <CardContent className="flex-1 pt-6">
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
                            dataKey="category"
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
                            domain={[0, (dataMax) => dataMax * 1.15]}
                        />
                        <ChartTooltip
                            cursor={{ fill: "hsl(210 40% 96.1%)" }}
                            content={
                                <ChartTooltipContent
                                    nameKey="category"
                                    hideLabel
                                    indicator="dot"
                                />
                            }
                        />
                        <Bar
                            dataKey="vendors"
                            fill="var(--color-vendors)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default VendorDistributionChart
