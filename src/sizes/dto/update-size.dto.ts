import { IsString, IsUUID } from 'class-validator';

export class UpdateSizeDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;
}
