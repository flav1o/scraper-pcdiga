import { Module } from '@nestjs/common';
import { ThirdPartyEmailService } from './third-party.service';

@Module({
  providers: [ThirdPartyEmailService],
  exports: [ThirdPartyEmailService],
})
export class ThirdPartyModule {}
