import { ConflictException, Injectable } from '@nestjs/common';
import { RegistrationDto } from '../auth/dto/registration-dto';
import * as crypto from 'crypto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  async checkEmailExists(email: string) {
    return !!email && !!(await User.findOne({ where: { email } }));
  }

  async create(registrationDto: RegistrationDto) {
    if (await this.checkEmailExists(registrationDto.email)) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = crypto
      .createHash('sha256')
      .update(registrationDto.password + process.env.PASSWORD_SALT)
      .digest('hex');

    const { email, role } = registrationDto;
    return (await User.create({ email, role, passwordHash })).get();
  }

  getByEmail(email: string) {
    return User.findOne({ where: { email } });
  }
}
