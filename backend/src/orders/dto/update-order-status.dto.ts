import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../database/entities/enums';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
