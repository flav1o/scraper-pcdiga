import { Nullable } from "../../general.types";
import { docByClass, docQuerySelector } from "../helpers/document";
import { Price, ScrapedData } from "./types";

const getImagesFromCollection = () => {
  const productImagery = docByClass("product-gallery__slider-image");
  const image = productImagery.item(0);

  if (!image) return null;

  return image?.getAttribute("src");
};

const getPriceFromMeta = (): Nullable<Price> => {
  const priceMeta = docQuerySelector('meta[itemprop="price"]');
  const currencyMeta = docQuerySelector('meta[itemprop="priceCurrency"]');

  if (!priceMeta || !currencyMeta) return null;

  const price = priceMeta.getAttribute("content");
  const currency = currencyMeta.getAttribute("content") ?? "EUR";

  return { price: Number(price), currency };
};

const getDiscountPrice = (): Nullable<Price> => {
  const discountPrice = docQuerySelector(
    "div.product-price-info > span > span > s > span > span.value > span.integer"
  );

  const integerPart = discountPrice?.textContent?.trim();

  if (integerPart) {
    return {
      price: Number(`${integerPart}`),
      currency: "EUR",
    };
  }

  return null;
};

export const wortenScraper = (): ScrapedData => {
  return {
    product: {
      name: docByClass("title")?.[0]?.textContent ?? "",
      image: getImagesFromCollection(),
      price: {
        discount: getPriceFromMeta(),
        original: getDiscountPrice(),
        isOnSale: !!getDiscountPrice(),
      },
    },
  };
};
