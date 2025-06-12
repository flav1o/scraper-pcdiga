export type SendEmail = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export type PriceEmailData = {
  to: string;
  subject: string;
  originalPrice: number;
  discountPrice: number;
  productName: string;
  productUrl: string;
  productImageUrl: string;
};
