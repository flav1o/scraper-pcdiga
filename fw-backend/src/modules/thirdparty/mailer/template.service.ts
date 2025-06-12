import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PriceEmailData } from './mailer.types';

@Injectable()
export class TemplateService {
  generatePriceEmailTemplate(data: PriceEmailData): string {
    try {
      // Read the HTML template file from the correct path
      const templatePath = join(
        process.cwd(),
        'src',
        'modules',
        'thirdparty',
        'mailer',
        'templates',
        'price-email.html',
      );
      let htmlTemplate = readFileSync(templatePath, 'utf-8');

      // Use discount price if available, otherwise use original price
      const currentPrice = data.discountPrice ?? data.originalPrice;

      const replacements = {
        '{{subject}}': data.subject,
        '{{companyName}}': 'Fox Watch',
        '{{productName}}': data.productName,
        '{{currentPrice}}': currentPrice.toFixed(2),
        '{{productUrl}}': data.productUrl,
        '{{productImageUrl}}': data.productImageUrl,
        '{{recipientEmail}}': data.to,
      };

      Object.entries(replacements).forEach(([placeholder, value]) => {
        htmlTemplate = htmlTemplate.replace(
          new RegExp(placeholder, 'g'),
          value,
        );
      });

      return htmlTemplate;
    } catch (error) {
      console.error('Error reading email template:', error);
      console.error(
        'Attempted path:',
        join(
          process.cwd(),
          'src',
          'modules',
          'thirdparty',
          'mailer',
          'templates',
          'price-email.html',
        ),
      );

      return this.getFallbackTemplate(data);
    }
  }

  private getFallbackTemplate(data: PriceEmailData): string {
    // Use discount price if available, otherwise use original price
    const currentPrice = data.discountPrice ?? data.originalPrice;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.subject}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            color: #007bff;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
          }
          .product-image {
            width: 100%;
            max-width: 300px;
            height: auto;
            border-radius: 8px;
            margin: 20px auto;
            display: block;
          }
          .price-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
          }
          .current-price {
            font-size: 36px;
            font-weight: bold;
            margin: 10px 0;
          }
          .cta-button {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
            font-size: 18px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Fox Watch</div>
          <h2 style="text-align: center;">${data.productName}</h2>
          <img src="${data.productImageUrl}" alt="${data.productName}" class="product-image">
          <div class="price-box">
            <div class="current-price">€${currentPrice.toFixed(2)}</div>
          </div>
          <div style="text-align: center;">
            <a href="${data.productUrl}" class="cta-button">Shop Now</a>
          </div>
          <p style="text-align: center; color: #666; margin-top: 30px;">
            Limited time offer - Don't miss out!
          </p>
        </div>
      </body>
      </html>
    `;
  }
}
