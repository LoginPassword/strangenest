import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EventsModule } from 'src/events/events.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [EventsModule, HttpModule],
})
export class ApiModule {}
