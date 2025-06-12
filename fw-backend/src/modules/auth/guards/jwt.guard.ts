import { Injectable } from '@nestjs/common';
import { GqlAuthGuard } from './super.guard';

@Injectable()
export class JwtAuthGuard extends GqlAuthGuard('jwt') {}
