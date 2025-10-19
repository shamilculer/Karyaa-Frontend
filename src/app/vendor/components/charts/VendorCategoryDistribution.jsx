"use client"
import * as React from "react"
import { Pie, PieChart, Cell } from "recharts" 
import { LayoutList, ArrowRight } from "lucide-react" 
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

export const description = "Vendor Distribution by Service Category (Solid Pie Chart)"

// Define custom CSS variables for chart colors
const customChartStyles = `
    .chart-container-vendor {
        --chart-1: hsl(200, 70%, 50%); /* Photography & Video - Blue */
        --chart-2: hsl(10, 80%, 55%);  /* Catering - Reddish */
        --chart-3: hsl(40, 90%, 60%);  /* Event Venues - Yellow/Orange */
        --chart-4: hsl(300, 70%, 55%); /* Event Planning - Purplish */
        --chart-5: hsl(140, 60%, 45%); /* Entertainment - Green */
        --chart-6: hsl(270, 50%, 60%); /* Decor & Rentals - Indigo */
        --chart-7: hsl(0, 0%, 50%);    /* Others - Gray */
    }
`;

// --- Sample Data ---
const rawCategoryData = [
    { category: "Photography & Video", count: 450, fill: "var(--chart-1)" },
    { category: "Catering", count: 280, fill: "var(--chart-2)" },
    { category: "Event Venues", count: 120, fill: "var(--chart-3)" },
    { category: "Event Planning", count: 180, fill: "var(--chart-4)" },
    { category: "Entertainment", count: 90, fill: "var(--chart-5)" },
    { category: "Decor & Rentals", count: 70, fill: "var(--chart-6)" },
    { category: "Others", count: 30, fill: "var(--chart-7)" },
];

const totalVendors = rawCategoryData.reduce((sum, item) => sum + item.count, 0);

const chartConfig = rawCategoryData.reduce((acc, item, index) => {
    acc[item.category.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()] = { 
        label: item.category,
        color: `var(--chart-${index + 1})`,
    };
    return acc;
}, {});


function VendorCategoryDistribution() {
    return (
        <div className="chart-container-vendor"> 
            <style jsx="true">
                {customChartStyles}
            </style>

            <Card className="flex flex-col h-full w-full bg-white border border-gray-200 shadow-lg rounded-xl">
                {/* TIGHTENED CARD HEADER PADDING (pb-2) */}
                <CardHeader className="flex flex-row items-start justify-between p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <LayoutList className="size-6 text-indigo-600" />
                        <div>
                            <CardTitle className="uppercase text-indigo-600 font-bold tracking-wider text-base">
                                Vendor By Categories
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500 mt-1">
                                Breakdown of **{totalVendors.toLocaleString()}** registered vendors.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                
                {/* TIGHTENED CARD CONTENT PADDING (pb-2, pt-2) */}
                <CardContent className="flex-1 pb-2 pt-2">
                    <ChartContainer
                        config={chartConfig}
                        // Set max-height to visually reduce card height
                        className="mx-auto aspect-square max-h-[300px]" 
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        hideLabel
                                        formatter={(value, name, item) => [
                                            `${value.toLocaleString()} Vendors`, 
                                            item.payload.category
                                        ]}
                                    />
                                }
                            />
                            <Pie
                                data={rawCategoryData}
                                dataKey="count"
                                nameKey="category"
                                innerRadius={0}
                                outerRadius={140} // Increased size for a bigger chart
                                strokeWidth={3}
                                paddingAngle={2}
                                // Removed className="fill-current"
                            >
                                {rawCategoryData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.fill} // Explicitly setting fill color for the cell
                                        stroke={entry.fill} // Ensures the border (stroke) matches the fill color
                                        strokeWidth={1}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-2 border-t border-gray-100 p-4">
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 w-full">
                        {rawCategoryData.map((item) => {
                            const percentage = totalVendors > 0 ? ((item.count / totalVendors) * 100).toFixed(1) : 0;
                            return (
                                <div key={item.category} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 font-medium text-gray-700">
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.fill }}
                                        />
                                        {item.category}
                                    </div>
                                    <div className="text-right">
                                        <span className="font-semibold text-gray-900">{percentage}%</span> 
                                        <span className="text-gray-500 ml-1">({item.count})</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <a 
                        href="/admin/analytics/categories" 
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center justify-center pt-2"
                    >
                        Analyze Market Saturation
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                </CardFooter>
            </Card>
        </div>
    )
}

export default VendorCategoryDistribution