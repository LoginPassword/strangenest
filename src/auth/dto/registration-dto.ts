import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import rolesEnum from '../../users/roles.enum';

export class RegistrationDto {
  @ApiProperty({ maxLength: 255 })
  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  @Transform((param) => param.value.toLowerCase())
  email: string;

  @ApiProperty({ minLength: 6, maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ enum: rolesEnum })
  @IsNotEmpty()
  @IsString()
  @IsEnum(rolesEnum)
  role: string;
}
