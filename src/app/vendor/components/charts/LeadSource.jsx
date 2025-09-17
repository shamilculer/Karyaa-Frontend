"use client"
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
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

export const description = "Lead source breakdown (donut chart)"

const chartData = [
  { source: "Category", leads: 120, fill: "var(--chart-1)" },
  { source: "Search", leads: 180, fill: "var(--chart-2)" },
  { source: "Featured", leads: 75, fill: "var(--chart-3)" },
  { source: "Direct", leads: 60, fill: "var(--chart-4)" },
]

const chartConfig = {
  leads: {
    label: "Leads",
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
    label: "Direct",
    color: "var(--chart-4)",
  },
}

function LeadSource() {
  const totalLeads = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.leads, 0)
  }, [])

  return (
    <Card className="flex flex-col h-full w-full bg-white border border-gray-200 shadow-none rounded-md">
      <CardHeader className="items-center pb-0">
        <CardTitle className="uppercase text-sidebar-foreground font-normal tracking-widest">
          Lead Sources
        </CardTitle>
        <CardDescription className="text-xs">
          Showing breakdown for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
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
                          className="fill-muted-foreground"
                        >
                          Profile Views
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
      <CardFooter className="flex flex-wrap gap-4 text-sm">
        {chartData.map((item) => (
          <div key={item.source} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: `${item.fill}` }}
            />
            <span>{item.source}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  )
}

export default LeadSource
