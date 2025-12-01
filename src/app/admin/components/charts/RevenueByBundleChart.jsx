"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useState, useEffect } from "react"
import { ChevronDown, Package } from "lucide-react"

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
import { getRevenueByBundle } from "@/app/actions/admin/revenueAnalytics"

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "hsl(262, 83%, 58%)", // Purple
    },
}

function RevenueByBundleChart() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getRevenueByBundle()

                if (response.success && response.data) {
                    // Transform the data for the chart
                    const transformedData = response.data.map(item => ({
                        bundle: item.bundleName,
                        revenue: item.revenue
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
    }, [])

    const totalRevenue = React.useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.revenue, 0)
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
                    <Package className="h-5 w-5 text-purple-600" />
                    <div>
                        <CardTitle className="uppercase text-purple-600 font-medium tracking-widest text-base">
                            Revenue by Bundle
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                            Total ₹{totalRevenue.toLocaleString()} revenue across all bundles
                        </CardDescription>
                    </div>
                </div>
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
                            dataKey="bundle"
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
                            tickFormatter={(value) => `₹${value.toLocaleString()}`}
                        />
                        <ChartTooltip
                            cursor={{ fill: "hsl(210 40% 96.1%)" }}
                            content={
                                <ChartTooltipContent
                                    nameKey="bundle"
                                    hideLabel
                                    indicator="dot"
                                    formatter={(value) => `₹${value.toLocaleString()}`}
                                />
                            }
                        />
                        <Bar
                            dataKey="revenue"
                            fill="var(--color-revenue)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default RevenueByBundleChart
