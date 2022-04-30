import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScraperService {
  async pageScraping(pageUrl: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
    );
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      const currentPrice: HTMLElement = document.querySelector(
        '.product-info-main .price-box span[data-price-type=finalPrice] .price',
      );

      const originalPrice: HTMLElement = document.querySelector(
        '.product-info-main .price-box span[data-price-type=oldPrice] .price',
      );

      const priceDifference: HTMLElement =
        document.querySelector('.discount_value');

      const name: HTMLElement = document.querySelector(
        '#maincontent > div.columns > div > div.product-info-main > div.page-title-wrapper.product > h1 > span',
      );

      const ean: HTMLElement = document.querySelector(
        '#maincontent > div.columns > div > div.product.attribute-header > div.product.attribute-wrapper > div.product.attribute.ean > div',
      );

      //TODO: refactor the return with an util function
      return {
        currentPrice: currentPrice
          ? +currentPrice.innerText
              .replace(/(\d+),(\d+).*/, '$1.$2')
              .replace(/[^0-9.]/g, '')
          : null,
        originalPrice: originalPrice
          ? +originalPrice.innerText
              .replace(/(\d+),(\d+).*/, '$1.$2')
              .replace(/[^0-9.]/g, '')
          : +currentPrice.innerText
              .replace(/(\d+),(\d+).*/, '$1.$2')
              .replace(/[^0-9.]/g, ''),
        priceDifference: priceDifference
          ? +priceDifference.innerText
              .replace(/(\d+),(\d+).*/, '$1.$2')
              .replace(/[^0-9.]/g, '')
          : 0,
        name: name.innerText,
        ean: ean.innerText,
      };
    });

    await browser.close();
    return data;
  }
}
