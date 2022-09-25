import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import {
  calculateDiscount,
  removeKeywordFromEan,
  transformPricesToNumber,
} from 'src/common/utils';
import { USER_AGENTS } from 'src/constants/scraper.constants';

@Injectable()
export class ScraperService {
  async pageScraping(pageUrl: string) {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENTS);
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      const name = document.querySelector('h1')?.textContent || 'NOT FOUND';
      const currentPrice =
        document.querySelector(
          '#body-overlay > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div.grid.lg\\:grid-cols-product-page.gap-x-6.w-full.items-start > div.max-w-full.min-w-full.mt-6 > div.p-4.bg-background-off.rounded-md.grid.gap-y-4 > div:nth-child(4) > div > div > div.flex.gap-x-4.items-center > div.text-primary.text-2xl.md\\:text-3xl.font-black',
        )?.textContent || 'NOT FOUND';
      const ean =
        document.querySelector(
          '#body-overlay > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div.grid.lg\\:grid-cols-product-page.gap-x-6.w-full.items-start > div.max-w-full.min-w-full.mt-6 > div.p-4.bg-background-off.rounded-md.grid.gap-y-4 > div.contents.lg\\:hidden > div.w-full.h-full > div > div:nth-child(3)',
        )?.textContent || 'NOT FOUND';
      const originalPrice =
        document.querySelector(
          '#body-overlay > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div.grid.lg\\:grid-cols-product-page.gap-x-6.w-full.items-start > div.max-w-full.min-w-full.mt-6 > div.p-4.bg-background-off.rounded-md.grid.gap-y-4 > div:nth-child(4) > div > div > div.flex.gap-x-4.items-center > div.pvpr-lh.undefined.flex.flex-col.justify-end.self-end > p',
        )?.textContent || 'NOT FOUND';

      return {
        name,
        ean,
        currentPrice,
        originalPrice,
      };
    });

    await browser.close();

    const { name, ean, currentPrice, originalPrice } = data;

    return {
      name,
      ean: removeKeywordFromEan(ean),
      currentPrice: transformPricesToNumber(currentPrice),
      originalPrice: transformPricesToNumber(originalPrice),
      priceDifference: calculateDiscount(originalPrice, currentPrice),
    };
  }
}
