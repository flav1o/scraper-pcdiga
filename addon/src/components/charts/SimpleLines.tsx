"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  
} from "@/components/ui/chart";
import { ChartTooltipContent } from "./Tooltip";
import { ProductPrice } from "@/common/types";

export type ChartDataItem = Pick<ProductPrice, "originalPrice" | "createdAt" | "discountPrice">;

 type Props = {
  data: ChartDataItem[]
}

const chartConfig = {
  mobile: {
    label: "Price",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function SimpleLinesChart({data}: Readonly<Props>) {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer>
        <LineChart accessibilityLayer data={data}>
          <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
          <Line
            dataKey="originalPrice"
            type="natural"
            stroke="var(--color-mobile)"
            strokeWidth={2}
            dot={false}
          />
      </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
