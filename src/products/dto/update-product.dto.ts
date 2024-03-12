import { IsNumber, IsString, IsUUID } from 'class-validator';

export class UpdateProductDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsNumber()
  quantity: number;
}
