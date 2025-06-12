import { CreateProductInput } from 'src/modules/products/gql/types/products.inputs';

const stableStringify = ({ product, price }: CreateProductInput): string => {
  return `${product.name}${product.ean}${product.image}${price.originalPrice}${price?.discountPrice}`;
};

export const genCheckSum = (data: CreateProductInput, seed = 0) => {
  const str = stableStringify(data);

  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;

  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
