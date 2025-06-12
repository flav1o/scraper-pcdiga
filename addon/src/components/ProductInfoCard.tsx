import { addEllipsis } from "@/common";
import { ChartDataItem, SimpleLinesChart } from "./charts/SimpleLines";
import { LazyImage } from "./LazyImage";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useMemo } from "react";
import { ProductPrice } from "@/common/types";
import { useNavigate } from "react-router-dom";

type Props = {
  productId: string;
  name: string;
  image: string;
  prices: ProductPrice[];
};

export const ProductInfoCard = ({ name, image, prices, productId }: Props) => {
  const navigate = useNavigate();

  const normalizeData = useMemo((): ChartDataItem[] => {
    const data = prices?.map((_item) => ({
      key: _item.createdAt.toString(),
      originalPrice: _item.originalPrice,
      discountPrice: _item.discountPrice,
      createdAt: _item.createdAt,
    }));

    return data?.reverse();
  }, [prices]);

  const currentDiscount = prices?.[0]?.discountPrice;
  const originalPrice = prices?.[0]?.originalPrice;

  return (
    <div className="flex items-center gap-2 h-[13vh]">
      <div className="rounded-sm w-[18%] h-full items-center">
        <LazyImage src={image} alt="product-1" className="rounded-sm" />
      </div>
      <div className="grid items-center justify-start w-[60%] h-full">
        <Tooltip>
          <TooltipTrigger
            className="font-bold text-sm break-keep text-start z-index-[1]"
            onClick={() => navigate(`/product-details/${productId}`)}
          >
            {addEllipsis(name, 20)}
          </TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>
        {prices.length <= 1 && (
          <div className="flex items-center">
            {prices.length === 1 && (
              <p className="text-xs text-gray-500">More Data Soon..</p>
            )}
          </div>
        )}
        {prices.length > 1 && (
          <div className="h-[5vh] mt-3 z-50">
            <SimpleLinesChart data={normalizeData} />
          </div>
        )}
      </div>
      <div className="ml-[auto] items-end w-[25%]">
        <p className="font-bold text-base text-end">
          {currentDiscount ?? originalPrice}€
        </p>
        {!!currentDiscount && (
          <p className="line-through text-xs text-gray-400 min-h-[1vh] text-end">
            {originalPrice}€
          </p>
        )}
      </div>
    </div>
  );
};

