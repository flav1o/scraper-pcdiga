import * as _ from 'lodash';
import * as SendGrid from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import { ENV_VARIABLES } from 'src/config/env';
import { OnEvent } from '@nestjs/event-emitter';
import scrapedNowEmail from './emails/scraped-now';
import { EMITTERS } from 'src/constants/emitters.constants';
import { ICreatedProductEmitterPayload, IProductPrices } from 'src/shared';

@Injectable()
export class ThirdPartyEmailService {
  constructor() {
    SendGrid.setApiKey(ENV_VARIABLES.APP_SEND_GRID_API);
  }

  async send(ean: string, name: string, url: string, prices: IProductPrices) {
    const mail: SendGrid.MailDataRequired = {
      to: 'flaviodancosta07@gmail.com',
      subject: `Scraped product - ${name}`,
      from: 'flaviodancosta07@gmail.com',
      text: `The product ${ean} was scraped at ${new Date().toISOString()}`,
      html: scrapedNowEmail(
        name,
        url,
        prices.currentPrice.toString(),
        prices.originalPrice.toString(),
      ),
    };

    return await SendGrid.send(mail);
  }

  @OnEvent(EMITTERS['EMAIL.NOTIFY_CREATED_PRODUCT'])
  handleOrderCreatedEvent(payload: ICreatedProductEmitterPayload) {
    this.send(payload.ean, payload.name, payload.url, payload.prices);
  }
}
