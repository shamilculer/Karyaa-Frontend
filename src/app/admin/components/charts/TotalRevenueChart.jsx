"use client"

import * as React from "react"
import { TrendingUp, Coins, ChevronDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useState, useEffect } from "react"

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
import { getRevenueOverTime } from "@/app/actions/admin/revenueAnalytics"

const chartConfig = {
  revenue: {
    label: "Revenue",
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

const TotalRevenueChart = () => {
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
        const response = await getRevenueOverTime(timeframe)

        if (response.success && response.data) {
          // Transform the data for the chart
          const transformedData = response.data.map(item => ({
            time: item._id.month ? `${item._id.month}/${item._id.year}` : `Day ${item._id.day}`,
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
  }, [timeframe])

  // Calculate metrics
  const totalRevenue = data.reduce((acc, item) => acc + item.revenue, 0)
  const firstPeriodRevenue = data[0]?.revenue || 0
  const lastPeriodRevenue = data[data.length - 1]?.revenue || 0
  const revenueChange = lastPeriodRevenue - firstPeriodRevenue
  const percentageChange = firstPeriodRevenue > 0
    ? ((revenueChange / firstPeriodRevenue) * 100).toFixed(1)
    : "N/A"
  const isPositiveTrend = revenueChange >= 0

  if (loading) {
    return (
      <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-green-600" />
          <div>
            <CardTitle className="uppercase text-green-600 font-medium tracking-widest text-base">
              Revenue Over Time
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Showing revenue trends for the {timeframeLabel}
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
            <DropdownMenuItem onSelect={() => setTimeframe("24H")}> 24h </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTimeframe("1W")}> 1 Week </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTimeframe("1M")}> 1 Month </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTimeframe("3M")}> 3 Months </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTimeframe("6M")}> 6 Months </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTimeframe("1Y")}> Last Year </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-[9/4]"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={true}
              horizontal={true}
              stroke="#d6d6d6ff"
              strokeDasharray="3 3"
            />

            <YAxis hide={true} domain={['dataMin', 'dataMax']} />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.length > 4 ? value.slice(0, 3) : value}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip
              cursor={{ stroke: 'var(--color-revenue)', strokeDasharray: '2 2' }}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="revenue"
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />
              }
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {isPositiveTrend ? "Up" : "Down"} by {percentageChange}% vs. previous period
          <TrendingUp
            className={`h-4 w-4 transition-transform duration-300 ${isPositiveTrend ? "text-green-500" : "text-red-500"} ${!isPositiveTrend ? 'rotate-180' : ''}`}
          />
        </div>
        <div className="leading-none text-muted-foreground">
          Total revenue in the {timeframeLabel}: ₹{totalRevenue.toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  )
}

export default TotalRevenueChart