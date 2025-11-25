"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { useState, useEffect } from "react"
import { TrendingUp } from "lucide-react"

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
import { getBundlePerformance } from "@/app/actions/admin/revenueAnalytics"

const chartConfig = {
    subscribers: {
        label: "Subscribers",
    },
}

// Colors for different bundles
const COLORS = [
    "hsl(217, 91%, 60%)",  // Blue
    "hsl(142, 76%, 36%)",  // Green
    "hsl(262, 83%, 58%)",  // Purple
    "hsl(38, 92%, 50%)",   // Orange
    "hsl(0, 72%, 51%)",    // Red
];

function BundlePerformanceChart() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getBundlePerformance()

                if (response.success && response.data) {
                    // Transform the data for the chart
                    const transformedData = response.data.map((item, index) => ({
                        name: item.name,
                        subscribers: item.subscribers,
                        fill: COLORS[index % COLORS.length]
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

    const totalSubscribers = React.useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.subscribers, 0)
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
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                        <CardTitle className="uppercase text-blue-600 font-medium tracking-widest text-base">
                            Bundle Performance
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                            Subscriber distribution across bundles
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[400px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={data}
                            dataKey="subscribers"
                            nameKey="name"
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
                                                    {totalSubscribers.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-sm"
                                                >
                                                    Subscribers
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
                {data.map((item) => {
                    const percentage = totalSubscribers > 0 ? ((item.subscribers / totalSubscribers) * 100).toFixed(1) : 0;
                    return (
                        <div key={item.name} className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-xs">
                                {item.name}: <strong>{percentage}%</strong> ({item.subscribers})
                            </span>
                        </div>
                    );
                })}
            </CardFooter>
        </Card>
    )
}

export default BundlePerformanceChart
