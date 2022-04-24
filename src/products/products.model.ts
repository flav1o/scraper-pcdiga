import * as mongoose from 'mongoose';

export const ProductPriceSchema = new mongoose.Schema(
  {
    currentPrice: Number,
    originalPrice: Number,
    priceDifference: Number,
    isOnDiscount: Boolean,
    discountPercentage: Number,
  },
  { timestamps: true, versionKey: false },
);

export const ProductSchema = new mongoose.Schema(
  {
    ean: String,
    name: String,
    url: String,
    prices: [{ type: ProductPriceSchema }],
  },
  { timestamps: true, versionKey: false },
);
