import { Controller, UseGuards, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import rolesEnum from 'src/users/roles.enum';
import { ApiService } from './api.service';

@ApiTags('api')
@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(rolesEnum.ADMINISTRATOR)
  @Post('/startparse')
  async startParse() {
    this.apiService.enableParse();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(rolesEnum.ADMINISTRATOR)
  @Post('/stopparse')
  async stopParse() {
    this.apiService.disableParse();
  }
}
