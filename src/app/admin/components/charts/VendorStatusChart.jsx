"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { useState, useEffect } from "react"
import { ChevronDown, Users } from "lucide-react"

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
import { getVendorStatusDistribution } from "@/app/actions/admin/platformAnalytics"

const chartConfig = {
    vendors: {
        label: "Vendors",
    },
    pending: {
        label: "Pending",
        color: "hsl(38, 92%, 50%)",
    },
    approved: {
        label: "Approved",
        color: "hsl(142, 76%, 36%)",
    },
    rejected: {
        label: "Rejected",
        color: "hsl(0, 72%, 51%)",
    },
    expired: {
        label: "Expired",
        color: "hsl(220, 13%, 69%)",
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

function VendorStatusChart() {
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
                const response = await getVendorStatusDistribution(timeframe)

                if (response.success && response.data) {
                    // Transform the data for the chart
                    const transformedData = response.data.map(item => ({
                        status: item._id,
                        vendors: item.count,
                        fill: `var(--color-${item._id})`
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
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                        <CardTitle className="uppercase text-blue-600 font-medium tracking-widest text-base">
                            Vendor Status Distribution
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                            Showing breakdown for the {timeframeLabel}
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
                        <DropdownMenuItem onSelect={() => setTimeframe("24H")}>24h</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("1W")}>1 Week</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("1M")}>1 Month</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("3M")}>3 Months</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("6M")}>6 Months</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeframe("1Y")}>Last Year</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
                            dataKey="vendors"
                            nameKey="status"
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
                                                    {totalVendors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-sm"
                                                >
                                                    Total Vendors
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
                    const percentage = totalVendors > 0 ? ((item.vendors / totalVendors) * 100).toFixed(1) : 0;
                    return (
                        <div key={item.status} className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: `${item.fill}` }}
                            />
                            <span className="text-xs capitalize">
                                {item.status}: <strong>{percentage}%</strong> ({item.vendors.toLocaleString()})
                            </span>
                        </div>
                    );
                })}
            </CardFooter>
        </Card>
    )
}

export default VendorStatusChart
