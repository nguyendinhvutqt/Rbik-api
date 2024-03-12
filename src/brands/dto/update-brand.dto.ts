import { IsString, IsUUID } from 'class-validator';

export class UpdateBrandDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;
}
