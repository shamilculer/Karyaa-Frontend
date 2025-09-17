"use client"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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

export const description = "A simple area chart"

const chartData = [
    { month: "July", enquiries: 120 },
    { month: "August", enquiries: 180 },
    { month: "September", enquiries: 95 },
    { month: "October", enquiries: 220 },
    { month: "November", enquiries: 160 },
    { month: "December", enquiries: 245 },
]

const chartConfig = {
    enquiries: {
        label: "Enquiries",
        color: "var(--chart-1)", // uses your Tailwind theme color
    },
}


function EnquiryOverTime() {
    return (
        <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md">
            <CardHeader>
                <CardTitle className="uppercase text-sidebar-foreground font-normal tracking-widest">Enquiries Over Time</CardTitle>
                <CardDescription className="text-xs">
                    Showing total visitors for the last 6 months
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey="enquiries"
                            type="natural"
                            fill="var(--chart-1)"
                            fillOpacity={0.4}
                            stroke="var(--chart-1)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default EnquiryOverTime