import { Companies } from "../../general.types";
import { pcdigaScraper } from "./pc-diga";
import { wortenScraper } from "./worten";

export const getProduct = (url: string) => {
  switch (url) {
    case Companies.WORTEN:
      return wortenScraper();
    case Companies.PC_DIGA:
      return pcdigaScraper();
    default:
      return null;
  }
};

export const CompanyToGql: { [key in Companies]: string } = {
  [Companies.PC_DIGA]: "PC_DIGA",
  [Companies.WORTEN]: "WORTEN",
};
