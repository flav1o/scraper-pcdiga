import React from "react";
import { Product } from "@/common/types";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { LazyImage } from "@/components";
import { useQuery } from "@apollo/client";
import { GET_PRICE_OPPORTUNITY } from "@/graphql/queries/get-price-opportunity";

type Props = {
  product?: Product;
};

const GRADIENTS = {
  EXCELLENT: "to-emerald-500",
  GOOD: "to-blue-400",
  NORMAL: "to-yellow-300",
  HIGH: "to-red-500",
};

export const ProductCard = ({ product }: Props) => {
  const { t } = useTranslation();

  const { data } = useQuery(GET_PRICE_OPPORTUNITY, {
    variables: { productId: product?.productId },
  });

  const getGradientClass = (classification: string | undefined) => {
    const toColor =
      GRADIENTS[classification as keyof typeof GRADIENTS] || "to-orange-400";
    return `absolute inset-0 bg-gradient-to-r from-white via-white opacity-40 ${toColor}`;
  };

  const classification = data?.evaluatePriceOpportunity?.classification;
  const gradientClass = getGradientClass(classification);

  return (
    <div className="relative bg-white overflow-hidden m-5 p-5 rounded-lg border border-gray-200 min-h-[200px]">
      <div className={gradientClass}></div>
      <div className="relative z-10 grid grid-cols-4 gap-5">
        <div className="col-span-1">
          <div className="rounded-lg flex items-center justify-center py-2 h-full">
            <LazyImage
              src={product?.image}
              alt="product"
              className="w-[100%] object-contain rounded-md h-auto"
            />
          </div>
        </div>
        <div className="col-span-3 flex flex-col justify-between">
          <a
            className="text-base font-bold text-gray-800 mb-3"
            href={product?.url}
            target="_blank"
            rel="noreferrer"
          >
            {product?.name}
          </a>
          <div className="pr-5">
            <ProductCardDetails name="EAN" value={product?.ean} />
            <ProductCardDetails
              name={t("product_details.created_at")}
              value={dayjs(product?.createdAt).format("DD/MM/YYYY HH:mm")}
            />
            <ProductCardDetails
              name={t("product_details.last_scraped")}
              value={dayjs(product?.lastScrapedAt).format("DD/MM/YYYY HH:mm")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCardDetails = ({
  name,
  value,
}: {
  name: string;
  value?: string | number | React.ReactNode;
}) => {
  return (
    <div className="flex items-center space-y-1">
      <span className="text-xs font-medium text-gray-500 w-28">{name}</span>
      <span className="text-xs text-gray-700 ml-auto">{value}</span>
    </div>
  );
};
