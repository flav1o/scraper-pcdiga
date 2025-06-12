"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { StorePricesChartProps } from "./types"
import { getChartConfig, getChartData } from "./StorePrice.helper"



export const StorePricesChart = ({ priceHistory }: StorePricesChartProps) => {
    console.log(JSON.stringify(priceHistory))
    if (!priceHistory) return null;
    
    const { data: chartData, regularKeys, discountKeys } = getChartData(priceHistory)
    const chartConfig = getChartConfig(regularKeys, discountKeys)

    return (
        <ChartContainer config={chartConfig} className="h-[100%] w-[100%]">
            <ResponsiveContainer>
                <LineChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                >
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    
                    {Array.from(regularKeys).map(key => (
                        <Line
                            key={key}
                            dataKey={key}
                            type="monotone"
                            stroke={chartConfig[key]?.color}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                    
                    {Array.from(discountKeys).map(key => (
                        <Line
                            key={key}
                            dataKey={key}
                            type="monotone"
                            stroke="transparent"
                            strokeWidth={0}
                            dot={{
                                fill: chartConfig[key]?.color,
                                strokeWidth: 2,
                                r: 4,
                            }}
                        />
                    ))}
                    
                    <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}
