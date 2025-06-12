import { Injectable } from '@nestjs/common';
import { GqlAuthGuard } from './super.guard';

@Injectable()
export class GoogleAuthGuard extends GqlAuthGuard('google') {}
