import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway()
export class WebsocketGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}

// @WebSocketGateway():
// @WebSocketServer():
// @SubscribeMessage(event: string)
// @MessageBody():
// @ConnectedSocket():
// 