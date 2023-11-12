import { Logger } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect ,SubscribeMessage, WebSocketGateway ,WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({
  namespace: 'game',
  cors: { origin: 'http://localhost:8080',
  credentials: true, },

})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger("GameGateway");
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UsersService,
  ) {}
  afterInit(): void {
    this.logger.log("WebSocket Gateay Game created");
  }

  handleConnection(client: Socket, ...args: any[]) {
    client.emit('connected', 'Successfully connected to the server');
    console.log("Client connected");
  }

  handleDisconnect(client: any) {
    this.clientCount--;
    console.log("Client disconnected");
    client.emit('disconnected', this.clientCount);
  }

  @SubscribeMessage('start-game')
  start_game(@ConnectedSocket() client: Socket,@MessageBody() payload: any): { event: string; data: number[] }
  {
      console.log("start-game working");
    return {event:'table' ,data: this.gameService.init_table(client)};
  }
}
