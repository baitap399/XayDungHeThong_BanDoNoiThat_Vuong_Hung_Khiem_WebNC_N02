// file định nghĩa và kiểm tra dữ liệu đầu vào cho chức năng update-order-status.
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../database/entities/enums';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
