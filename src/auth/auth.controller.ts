import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RegistrationDto } from 'src/auth/dto/registration-dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('/registration')
  @ApiCreatedResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Email already exists' })
  async registration(@Body() registrationDto: RegistrationDto) {
    const user = await this.usersService.create(registrationDto);
    return this.authService.login(user);
  }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  @ApiCreatedResponse({ type: LoginResponseDto })
  @ApiBody({ type: LoginDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Email or password is incorrect' })
  async login(@Request() req: Express.Request) {
    return this.authService.login(req.user);
  }
}
