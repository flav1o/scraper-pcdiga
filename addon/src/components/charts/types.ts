import { PriceHistory } from "@/types";

export interface StorePricesChartProps {
  priceHistory?: PriceHistory;
}

export interface ChartDataPoint {
  date: string;
  [key: string]: string | number | undefined;
}
