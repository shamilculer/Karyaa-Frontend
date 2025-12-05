"use client"
import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import { getEnquiriesOverTime } from "@/app/actions/vendor/analytics"

export const description = "Enquiries Over Time Area Chart with Timeframe Filter and Gridlines"

const chartConfig = {
    enquiries: {
        label: "Enquiries",
        color: "hsl(227, 54%, 39%)", // Royal Blue
    },
}

const timeframeLabelMap = {
    "24H": "Last 24 Hours",
    "1W": "Last 1 Week",
    "1M": "Last 1 Month",
    "3M": "Last 3 Months",
    "6M": "Last 6 Months",
    "1Y": "Last 1 Year",
}

const EnquiryOverTime = () => {
    const [timeframe, setTimeframe] = useState("1M")
    const [chartData, setChartData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const timeframeLabel = timeframeLabelMap[timeframe]

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)

            const result = await getEnquiriesOverTime(timeframe)

            if (result.success && result.data) {
                // Transform data to match chart format
                const formattedData = result.data.map(item => ({
                    time: item.period,
                    enquiries: item.enquiries
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

    // Calculate performance indicator based on filtered data
    const firstPeriodEnquiries = chartData[0]?.enquiries || 0;
    const lastPeriodEnquiries = chartData[chartData.length - 1]?.enquiries || 0;
    const enquiryChange = lastPeriodEnquiries - firstPeriodEnquiries;
    const percentageChange = firstPeriodEnquiries > 0
        ? ((enquiryChange / firstPeriodEnquiries) * 100).toFixed(1)
        : "N/A";
    const isPositiveTrend = enquiryChange >= 0;
    const totalEnquiries = chartData.reduce((acc, item) => acc + item.enquiries, 0);

    return (
        <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md max-lg:!py-4">
            <CardHeader className="flex flex-row items-start justify-between max-lg:!px-3">
                <div>
                    <CardTitle className="uppercase text-[#2F4A9D] font-medium tracking-widest text-base">
                        Enquiries Over Time
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                        Showing total leads generated for the {timeframeLabel}
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
                        className=""
                    >
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <defs>
                                <linearGradient id="fillEnquiries" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-enquiries)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-enquiries)" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={true} stroke="#ccccccff" strokeDasharray="2 2" />
                            <XAxis
                                dataKey="time"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 10)}
                            />
                            <YAxis hide={true} domain={[0, (dataMax) => dataMax * 1.15]} />
                            <ChartTooltip
                                cursor={{ stroke: 'var(--color-enquiries)', strokeDasharray: '2 2' }}
                                content={
                                    <ChartTooltipContent
                                        indicator="line"
                                        nameKey="enquiries"
                                    />
                                }
                            />
                            <Area
                                dataKey="enquiries"
                                type="natural"
                                fill="url(#fillEnquiries)"
                                fillOpacity={0.4}
                                stroke="var(--color-enquiries)"
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
                    Total inquiries received in the {timeframeLabel}: {totalEnquiries.toLocaleString()}
                </div>
            </CardFooter>
        </Card>
    )
}

export default EnquiryOverTime