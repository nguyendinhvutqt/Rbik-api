import { IsNotEmpty, IsUUID } from 'class-validator';
import { OrderStatus } from 'src/enums/order_status.enum';

export class UpdateOrderDto {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  status: OrderStatus;
}
