import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate, validateOrReject } from 'class-validator';
import { EventsGateway } from 'src/events/events.gateway';
import { ResponseFromApiDto } from './dto/response-from-api.dto';

@Injectable()
export class ApiService {
  constructor(private eventsGateway: EventsGateway, private httpService: HttpService) {}
  parseEnabled = true;

  enableParse() {
    this.parseEnabled = true;
  }

  disableParse() {
    this.parseEnabled = false;
  }

  @Cron('0/5 * * * * *')
  async parsing() {
    if (!this.eventsGateway.authClientsCount) {
      // можно не делать запросы, если нету socketio клиентов
      return;
    }

    if (!this.parseEnabled) {
      return this.eventsGateway.broadcastAuth('parsing', []);
    }

    try {
      const response = await this.httpService.get(process.env.PARSING_URL).toPromise();

      // валидация и трансформация ответа api
      const classData = plainToClass(ResponseFromApiDto, { array: response.data });
      await validateOrReject(classData, { whitelist: true });

      return this.eventsGateway.broadcastAuth('parsing', classData.array);
    } catch (error) {
      // empty
    }

    this.eventsGateway.broadcastAuth('parsing', []);
  }
}
