import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(loginDto: LoginDto) {
    const passwordHash = crypto
      .createHash('sha256')
      .update(loginDto.password + process.env.PASSWORD_SALT)
      .digest('hex');

    const user = await this.usersService.getByEmail(loginDto.email);
    if (!user || user.passwordHash !== passwordHash) {
      return null;
    }

    return user.get();
  }

  async login(user: any) {
    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  verifyJwt(token: string) {
    return this.jwtService.verify(token);
  }
}
