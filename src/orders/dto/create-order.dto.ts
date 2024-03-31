import { IsArray, IsUUID } from 'class-validator';
export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsArray()
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}
