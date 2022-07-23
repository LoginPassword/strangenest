import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './refresh-token.model';
import { RefreshDto } from './dto/refresh.dto';

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
    const accessToken = this.jwtService.sign({ id: user.id, email: user.email, role: user.role }, { expiresIn: '60m' });
    const refreshToken = this.jwtService.sign({ id: user.id }, { expiresIn: '30d' });

    await RefreshToken.upsert({ userId: user.id, refreshToken });

    return { accessToken, refreshToken };
  }

  async refresh({ refreshToken }: RefreshDto) {
    try {
      this.verifyJwt(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    const refreshTokenRecord = await RefreshToken.findOne({ where: { refreshToken } });
    if (!refreshTokenRecord) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.usersService.getById(refreshTokenRecord.userId);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.login(user);
  }

  verifyJwt(token: string) {
    return this.jwtService.verify(token);
  }
}
