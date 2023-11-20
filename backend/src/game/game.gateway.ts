import { Logger } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection ,OnGatewayDisconnect,MessageBody ,SubscribeMessage, WebSocketGateway ,WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({
  namespace: 'game',
  cors: { 
    origin: 'http://localhost:8080',
  },
})
export class GameGateway implements OnGatewayInit , OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger('GameGateway');
  constructor(private readonly gameService:GameService){}
  afterInit():void {
    this.logger.log('WebSocket Gateay Game created');
  }

  private clientCount = 0;
  async handleConnection(client: Socket, ...args: any[]) {
    // this.clientCount++;
    this.server.emit('connected', this.clientCount);
    const header = client.handshake.headers;

    const token = header.token;
    await this.gameService.set_online_user(client,token);
    const user = this.gameService.find_user_with_id(client.id);
    
    console.log("from websocket user output ", user);
    console.log("from the client ", client.id);
  }

  handleDisconnect(client: any) {
    this.clientCount--;
    console.log("Client disconnected");
    client.emit('disconnected', this.clientCount);
  }

  @SubscribeMessage('start-game')
  start_game(@ConnectedSocket() client: Socket,@MessageBody() payload: any)
  {
    console.log(payload);
    // this.gameService.draw_table(payload.width, payload.height);
  }
}