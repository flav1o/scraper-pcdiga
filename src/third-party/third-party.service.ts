import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { ENV_VARIABLES } from 'src/config/env';
import { ProductPrice } from 'src/graphql/graphql-schema';
import scrapedNowEmail from './emails/scraped-now';
import * as _ from 'lodash';

@Injectable()
export class ThirdPartyEmailService {
  constructor() {
    SendGrid.setApiKey(ENV_VARIABLES.APP_SEND_GRID_API);
  }

  async send(ean: string, name: string, url: string, prices: ProductPrice) {
    const mail: SendGrid.MailDataRequired = {
      to: process.env.APP_SEND_GRID_MY_EMAIL,
      subject: `Scraped product - ${name}`,
      from: process.env.APP_SEND_GRID_FROM_EMAIL,
      text: `The product ${ean} was scraped at ${new Date().toISOString()}`,
      html: scrapedNowEmail(
        name,
        url,
        prices.currentPrice.toString(),
        prices.originalPrice.toString(),
      ),
    };

    const transport = await SendGrid.send(mail);
    return transport;
  }
}
