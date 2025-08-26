import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsMongoId,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @IsMongoId()
  filmId!: string;

  @IsString()
  scheduleId!: string;

  @IsInt()
  @Min(1)
  row!: number;

  @IsInt()
  @Min(1)
  seat!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}

export type ItemStatus =
  | 'booked'
  | 'already_booked'
  | 'out_of_range'
  | 'not_found';

export class CreateOrderResponseDto {
  ok!: boolean;
  results!: Array<OrderItemDto & { status: ItemStatus }>;
}
