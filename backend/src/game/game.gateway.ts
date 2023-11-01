import { Logger } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection ,OnGatewayDisconnect,MessageBody ,SubscribeMessage, WebSocketGateway ,WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({
  namespace: 'game',
  cors: { 
    origin: 'http://localhost:8080',
  },
})
export class GameGateway implements OnGatewayInit , OnGatewayConnection, OnGatewayDisconnect {
    
  private readonly logger = new Logger('GameGateway');
  constructor(private readonly gameService:GameService){}
  afterInit():void {
    this.logger.log('WebSocket Gateay Game created');
  }

  handleConnection(client: Socket, ...args: any[]) {
    client.emit('connected', 'Successfully connected to the server');
    const header = client.handshake.headers;

    const token = header.token;
    console.log("his is id ",client.id)
    console.log('Received token:', token);
    console.log("Client connected");
  }

  handleDisconnect(client: any) {
    console.log("Client disconnected");
  }

  @SubscribeMessage('start-game')
  start_game(@ConnectedSocket() client: Socket,@MessageBody() payload: any)
  {
    console.log("this is the client id",client.id ,"and this is the message from server",payload);
  }
}