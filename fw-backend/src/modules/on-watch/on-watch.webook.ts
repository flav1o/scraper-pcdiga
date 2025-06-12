import { Body, Controller, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as dayjs from 'dayjs';
import { PricesService } from '../prices/prices.service';
import { MailerService } from '../thirdparty/mailer/mailer.service';

@Controller('on-watch')
export class OnWatchController {
  constructor(
    private readonly priceService: PricesService,
    private readonly eventEmitter: EventEmitter2,
    private readonly mailerService: MailerService,
  ) {}

  @Post('webhook')
  async scrapedProductWebHook(@Body() body): Promise<boolean> {
    const prices = await this.priceService.getProductPrices(body.productId, 1);
    const latestPrice = prices[0];

    const todayLess24Hours = dayjs().subtract(24, 'hours');
    const lastUpdateOlderThan24Hours = dayjs(latestPrice?.createdAt).isBefore(
      todayLess24Hours,
    );

    if (lastUpdateOlderThan24Hours || !latestPrice) {
      console.log('PAGAR');
      await this.priceService.createProductPrice(
        body,
        'c9c89f96-13c9-47d7-99b0-9a7d634cf3fe',
        'AUTOMATED_ACTION',
      );
    }

    this.eventEmitter.emit('product.scraped', {
      productId: body.productId,
    });

    return true;
  }
}
