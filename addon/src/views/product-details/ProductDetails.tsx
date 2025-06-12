import { ProductWithPrices } from "@/common/types";
import { Button, MainWrapper } from "@/components";
import { Toggle } from "@/components/ui/toggle";
import { PriceAlert } from "@/components/price-alert";

import { useMutation, useQuery } from "@apollo/client";
import {
  Activity,
  ActivityCalendar,
  Props as CalendarProps,
} from "react-activity-calendar";
import { ProductCard } from "./components/ProductDetailsCard";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { StorePicker } from "./components/StorePicker";
import { IoMdArrowRoundBack } from "react-icons/io";
import { StorePricesChart } from "@/components/charts/StorePrices";
import { GiFox } from "react-icons/gi";
import { PRODUCT_DETAILS_MOUNT, REMOVE_ON_WATCH } from "@/graphql";
import { GET_PRICE_HISTORY } from "@/graphql/queries/get-price-history";
import { GET_PRICE_OPPORTUNITY } from "@/graphql/queries/get-price-opportunity";
import { toast } from "sonner";
import { PriceHistory } from "@/types";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export const ProductDetailsView = () => {
  const { t } = useTranslation();
  const { id: productId } = useParams<{ id: string }>();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showPriceAlert, setShowPriceAlert] = useState(false);

  const { data: productData, refetch } = useQuery<{
    product: ProductWithPrices;
    checkIsOnWatch: boolean;
  }>(PRODUCT_DETAILS_MOUNT, {
    variables: { productId },
    onCompleted: (_data) => console.log(_data),
    onError: (error) => console.log(error),
  });

  const { data: priceOpportunityData } = useQuery(GET_PRICE_OPPORTUNITY, {
    variables: { productId },
    skip: !productId,
  });

  const { data: priceHistoryData } = useQuery<{
    getPriceHistory: PriceHistory;
  }>(GET_PRICE_HISTORY, {
    variables: { 
      input: { 
        productId,
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() }),
      } 
    },
    skip: !productId,
  });

  const isOnWatch = productData?.checkIsOnWatch;
  const currentPrice = priceOpportunityData?.evaluatePriceOpportunity?.currentPrice;

  const [removeFromWatchList] = useMutation(REMOVE_ON_WATCH, {
    variables: { productId },
    onCompleted: () => {
      toast.success(t("on_watch.product_removed"));
      refetch();
      setShowPriceAlert(false);
    },
  });

  const handleToggleWatchList = () => {
    if (isOnWatch) {
      removeFromWatchList();
    } else {
      setShowPriceAlert(true);
    }
  };

  const handlePriceAlertSet = () => {
    refetch();
    setShowPriceAlert(false);
  };

  const handlePriceAlertCancel = () => {
    setShowPriceAlert(false);
  };

  const { prices, product } = productData?.product || {};

  const normalizedPrices: Activity[] = useMemo(() => {
    const monthTillEndOfYear = 12 - dayjs().month();
    const data = prices?.map((price) => {
      return {
        date: dayjs(price.createdAt).format("YYYY-MM-DD"),
        count: 1,
        level: 4,
      };
    });

    data?.push({
      date: dayjs()
        .add(monthTillEndOfYear, "month")
        .format("YYYY-MM-DD"),
      count: 0,
      level: 0,
    });

    return data || [];
  }, [prices]);

  const config: CalendarProps = useMemo(() => {
    return {
      data: normalizedPrices,
      hideTotalCount: true,
      hideColorLegend: true,
      theme: {
        dark: ["#ffffff1b", "#09d18f"],
      },
    };
  }, [normalizedPrices]);

  return (
    <MainWrapper width="500px" height="600px" style={{ overflowY: "auto", marginBottom: "5vh" }}>
      <BackButton />

      <div>
        <ProductCard product={product} />
      </div>
      <div className="px-5 pb-5 flex justify-end gap-3">
        <Toggle
          variant="outline"
          onClick={handleToggleWatchList}
          pressed={!!isOnWatch}
        >
          {isOnWatch ? "On Watch" : "Watch"} <GiFox />
        </Toggle>
      </div>
      
      <div className="px-5 pb-5">
        {productId && showPriceAlert && !isOnWatch && (
          <PriceAlert 
            productId={productId} 
            currentPrice={currentPrice}
            forceShowSetting={true}
            onPriceAlertSet={handlePriceAlertSet}
            onCancel={handlePriceAlertCancel}
          />
        )}
      </div>

      <main className="px-5">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold">
            {t("product_details.scraped_activity")}
          </h3>
          <StorePicker />
        </div>
      
        {!!config.data?.length && <ActivityCalendar {...config} />}
      
        <div className="flex flex-col h-[20vh] my-5 gap-5">
          <div className="flex justify-between items-center">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>
          {priceHistoryData?.getPriceHistory && (
            <StorePricesChart priceHistory={priceHistoryData.getPriceHistory} />
          )}
        </div>
      </main>
    </MainWrapper>
  );
};

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-6 left-6 z-50">
      <Button
        className="h-9 w-9 rounded-full border-none shadow-none bg-white"
        variant="default"
        onClick={() => navigate(-1)}
      >
        <IoMdArrowRoundBack />
      </Button>
    </div>
  );
};
