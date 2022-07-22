import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventsGateway } from 'src/events/events.gateway';

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
    // конечно лучше валидировать ответы api, но мне стало лень это делать для тестового

    if (!this.eventsGateway.authClientsCount) {
      // можно не делать запросы, если нету socketio клиентов
      return;
    }

    if (!this.parseEnabled) {
      return this.eventsGateway.broadcastAuth('parsing', []);
    }

    try {
      const response = await this.httpService.get(process.env.PARSING_URL).toPromise();
      if (response.data && Array.isArray(response.data)) {
        const result = response.data.map((el) => ({
          seller: el.member,
          paymentMethod: el.payment_method,
          price: Number(el.price),
          min: Number(el.min),
          max: Number(el.max),
        }));
        return this.eventsGateway.broadcastAuth('parsing', result);
      }
    } catch (error) {
      // empty
    }

    this.eventsGateway.broadcastAuth('parsing', []);
  }
}
