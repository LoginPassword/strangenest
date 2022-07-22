import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway()
export class EventsGateway {
  constructor(private authService: AuthService) {}
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // если в сокете есть валидный токен, то добавляем сокет в комнату авторизованных
    if (client.handshake.headers.authorization) {
      try {
        const token = client.handshake.headers.authorization.replace('Bearer ', '');
        this.authService.verifyJwt(token);
        client.join('auth');
      } catch (error) {
        // ignore
      }
    }
  }

  broadcast(eventName: string, payload: any) {
    this.server.emit(eventName, payload);
  }

  broadcastAuth(eventName: string, payload: any) {
    this.server.to('auth').emit(eventName, payload);
  }

  get authClientsCount() {
    return this.server.sockets.adapter.rooms.get('auth')?.size || 0;
  }
}
