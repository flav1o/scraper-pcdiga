import { http } from "@/lib/axios";
import { ScrapedData } from "../scrapers/types";
import { log } from "../helpers/document";
import { CompanyToGql } from "../scrapers/mapper";
import { Companies } from "@/general.types";

type GqlReq = {
  mutation: string;
  variables?: { [key: string]: object | string };
  checkSum?: number;
  session?: string;
};

type SaveProductArgs = {
  product: ScrapedData["product"];
  checkSum: number;
  store: Companies;
  productUrl: string;
};

export const AddonService = {
  saveProduct: async function({
    store,
    product,
    checkSum,
    productUrl,
  }: SaveProductArgs) {
    const mutation = `
      mutation AddProduct($input: CreateProductInput!) {
        product(input: $input) {
          productId
          name  
          ean
          image
          lastScrapedAt
        }
      }
    `;

    const variables = {
      input: {
        product: {
          name: product.name,
          ean: product.ean,
          image: product.image,
          url: productUrl,
        },
        price: {
          originalPrice: product.price?.original?.price,
          discountPrice: product.price?.discount?.price,
          store: CompanyToGql[store],
        },
      },
    };

    return await this.gqlReq({ mutation, variables, checkSum });
  },
  generateSession: async function() {
    const mutation = `
      mutation GenerateSession {
          generateSession
        }
    `;

    const req = await this.gqlReq({ mutation });
    const session = req?.data?.data?.generateSession;

    await chrome.storage.local.set({
      USER_SESSION: session,
    });

    return session;
  },
  getAuthToken: async () => {
    const { AUTH_TOKEN } = await chrome.storage.local.get("AUTH_TOKEN");
    if (!AUTH_TOKEN) log("User token not found");

    return AUTH_TOKEN;
  },
  getSessionId: async () => {
    const storage = await chrome.storage.local.get("USER_SESSION");
    if (!storage.USER_SESSION) return null;

    return storage.USER_SESSION;
  },
  gqlReq: async function({ mutation, checkSum, variables }: GqlReq) {
    const AUTH_TOKEN = await this.getAuthToken();
    const session = await this.getSessionId();

    if (!AUTH_TOKEN) {
      log("User token not found");
      return null;
    }

    return await http.post(
      "/graphql",
      {
        query: mutation,
        ...(variables && { variables }),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          ...(checkSum && { "X-Content-Checksum": checkSum.toString() }),
          ...(session && { "X-Session": session }),
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
  },
};
