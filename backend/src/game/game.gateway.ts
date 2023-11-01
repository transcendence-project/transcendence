import { Logger } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect ,SubscribeMessage, WebSocketGateway ,WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({
  namespace: 'game',
  cors: { origin: 'http://localhost:8080',
  credentials: true, },

})
export class GameGateway implements OnGatewayInit , OnGatewayConnection, 
              OnGatewayDisconnect {
  private readonly logger = new Logger('GameGateway');
  constructor(private readonly gameService:GameService){}
  afterInit():void {
    this.logger.log('WebSocket Gateay Game created');
  }

  handleConnection(client: Socket, ...args: any[]) {
    client.emit('connected', 'Successfully connected to the server');
    console.log("Client connected");
  }

  handleDisconnect(client: any) {
    console.log("Client disconnected");
  }
}
