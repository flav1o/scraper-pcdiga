import { PartialType } from '@nestjs/mapped-types';
import { CreateRabbitmqDto } from './create-rabbitmq.dto';

export class UpdateRabbitmqDto extends PartialType(CreateRabbitmqDto) {
  id: number;
}
