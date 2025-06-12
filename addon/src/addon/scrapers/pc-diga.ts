import { docQuerySelector } from "../helpers/document";
import { ScrapedData } from "./types";

const getProductName = (): string | null => {
  const ogTitleMetaTag = docQuerySelector("meta[property='og:title']");

  if (!ogTitleMetaTag) return null;

  return ogTitleMetaTag?.getAttribute("content");
};

const getProductImage = (): string | null => {
  const ogImageMetaTag = docQuerySelector("meta[property='og:image']");

  if (!ogImageMetaTag) return null;

  return ogImageMetaTag?.getAttribute("content");
};

const getJsonLd = (): string | null => {
  const jsonLd = document.querySelector("script[type='application/ld+json']");

  if (!jsonLd?.textContent) return null;

  return JSON.parse(jsonLd?.textContent);
};

const getOnDiscountOriginalPrice = () => {
  const xpathExpression =
    "/html/body/div[2]/main/div/div[3]/div[2]/div/div[1]/div[1]/div[1]/div[2]/div/p";

  const result = document.evaluate(
    xpathExpression,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  const priceString = result.singleNodeValue?.textContent;

  const price = priceString
    ?.split(" ")[0]
    .replace(",", ".")
    .replace("€", "")
    .trim();

  return Number(price) || 0;
};
export const pcdigaScraper = (): ScrapedData => {
  const jsonLd = getJsonLd() as any;
  const offers = jsonLd?.offers ?? {};
  const currentPrice = Number(offers.price);
  const isOnDiscount = Boolean(offers.priceValidUntil);

  const originalPrice = isOnDiscount
    ? getOnDiscountOriginalPrice()
    : currentPrice;

  return {
    product: {
      name: jsonLd?.name ?? getProductName(),
      image: getProductImage(),
      ean: jsonLd?.gtin13 ?? "teste",
      price: {
        original: {
          price: originalPrice,
          currency: "EUR",
        },
        discount: isOnDiscount
          ? { price: currentPrice, currency: "EUR" }
          : null,
        isOnSale: true,
      },
    },
  };
};
