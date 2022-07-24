import { IsString, IsArray, ValidateNested, IsNumber, IsInstance, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

class ResponseElem {
  @IsString()
  member: string;

  @IsString()
  @Expose({ name: 'payment_method' })
  paymentMethod: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  min: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max: number;
}

export class ResponseFromApiDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponseElem)
  @IsInstance(ResponseElem, { each: true })
  array: ResponseElem[];
}
