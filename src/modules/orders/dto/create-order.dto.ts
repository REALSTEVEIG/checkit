import { IsString, IsInt, IsOptional, IsJSON } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  description!: string;

  @IsString()
  specifications!: string;

  @IsInt()
  quantity!: number;

  @IsOptional()
  @IsJSON()
  metadata?: any;
}
