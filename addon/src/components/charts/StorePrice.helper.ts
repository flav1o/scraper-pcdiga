import { PriceHistory, PriceHistoryPoint } from "@/types";
import { ChartConfig } from "@/components/ui/chart";

export interface ChartDataPoint {
  date: string;
  [key: string]: string | number | undefined;
}

export const getChartData = (
  priceHistory: PriceHistory
): {
  data: ChartDataPoint[];
  regularKeys: Set<string>;
  discountKeys: Set<string>;
} => {
  const groupedByDate = new Map<string, ChartDataPoint>();
  const regularKeys = new Set<string>();
  const discountKeys = new Set<string>();

  priceHistory.history.forEach((point: PriceHistoryPoint) => {
    const date = new Date(point.date).toLocaleDateString();
    if (!groupedByDate.has(date)) {
      groupedByDate.set(date, { date });
    }
    const entry = groupedByDate.get(date)!;

    const regularKey = point.store;
    entry[regularKey] = point.price;
    regularKeys.add(regularKey);

    if (point.discountPrice) {
      const discountKey = `${point.store}_DISCOUNT`;
      entry[discountKey] = point.discountPrice;
      discountKeys.add(discountKey);
    }
  });

  return {
    data: Array.from(groupedByDate.values()),
    regularKeys,
    discountKeys,
  };
};

export const getChartConfig = (
  regularKeys: Set<string>,
  discountKeys: Set<string>
): ChartConfig => {
  const config: ChartConfig = {};
  const storeColors: { [key: string]: string } = {
    'PC_DIGA': 'hsl(var(--chart-1))',
    'WORTEN': 'hsl(var(--chart-2))',
    'FNAC': 'hsl(var(--chart-3))',
    'RADIO_POPULAR': 'hsl(var(--chart-4))',
  };

  regularKeys.forEach((key) => {
    const displayName = key.replace('_', ' ');
    config[key] = {
      label: displayName,
      color: storeColors[key] || 'hsl(var(--chart-1))',
    };
  });

  discountKeys.forEach((key) => {
    const storeName = key.replace('_DISCOUNT', '');
    const displayName = storeName.replace('_', ' ');
    config[key] = {
      label: `${displayName} (Desconto)`,
      color: 'hsl(142, 76%, 36%)',
    };
  });

  return config;
};
