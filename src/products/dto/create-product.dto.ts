import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  imagePublicId?: string;

  @IsString()
  imageUrl?: string;

  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsUUID()
  brandId: string;

  @IsUUID()
  sizeId: string;
}
