import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsJSON } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'I would like to place an order',
    description: 'This is the description of the order',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    example: 'Developed in 2024',
    description: 'This is the specification of the order',
  })
  @IsString()
  specifications!: string;

  @ApiProperty({
    example: 3,
    description: 'This is the quantity of the order',
  })
  @IsInt()
  quantity!: number;

  @IsOptional()
  @IsJSON()
  metadata?: any;
}
