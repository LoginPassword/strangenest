import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token - 60 minutes' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token - 30 days' })
  refreshToken: string;
}
