import { Logger } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect ,SubscribeMessage, WebSocketGateway ,WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  namespace: 'game',
  cors: { origin: 'http://localhost:8080',
  credentials: true, },

})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
 private server: Server;
  private readonly logger = new Logger("GameGateway");
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UsersService,
  ) {}
  afterInit(): void {
    this.logger.log("WebSocket Gateay Game created");
  }
  private clientCount = 0;
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
inviteUser(client: Socket, receiver: string): void {
    client.to(receiver).emit("invite", client.id);
  }

  updateGame(winnerID: number, winnerScore: number, loserID, loserScore): void {
	this.userService.saveMatch(winnerID, winnerScore, loserID, loserScore);
	}
}
