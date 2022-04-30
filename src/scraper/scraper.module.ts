import { Module } from '@nestjs/common';
import { NestCrawlerModule } from 'nest-crawler';
import { ScraperService } from './scraper.service';

@Module({
  providers: [ScraperService],
  imports: [NestCrawlerModule],
  exports: [ScraperService],
})
export class ScraperModule {}
