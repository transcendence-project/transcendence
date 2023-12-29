import { Logger } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect ,SubscribeMessage, WebSocketGateway ,WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { UsersService } from '../users/users.service';
import { SocketService } from './socket.service'
import { GameSelectDto } from './dto/game.dto';
@WebSocketGateway({
	namespace: 'game',
	cors: {
		origin: 'http://localhost:8080',
		credentials: true,
	},

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
    private readonly socketService: SocketService,
  ) {}
  afterInit(server : Server): void {
    this.socketService.setServer(server);
  }

  async handleConnection(client: Socket, ...args: any[]) {
      console.log("Connected");
    const header = client.handshake.headers;

    const token = header.token;
    this.gameService.addConnectUser(client, token);
  }

  handleDisconnect(client: any) {
    console.log(this.gameService.classic_queue);
    console.log("Client Disconnected!");
    this.gameService.removeFromQueue(client);
    // this.gameService.classic_queue.pop();
    // this.gameService.custom_queue.pop();
    // console.log("Client disconnected");
  }
  
  @SubscribeMessage('info')
   handleInfoGame(@ConnectedSocket() client: Socket, @MessageBody() data: GameSelectDto ) {
    console.log(data.gameMode);
    if (data.gameMode === 'single')
    {
        this.gameService.creatSingleGame(client, data);
        // console.log("emit to start game");
    }
    else if (data.gameMode === 'online')
    {
      this.gameService.onlineGame(client, data);
    }
  }
  
  @SubscribeMessage('paddleMove')
  handlePaddleMove(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    // const playerId = client.id; // Or any other way you identify your player
    this.gameService.movePlayerPaddle(client, data);
  }
  
  inviteUser(client: Socket, receiver: string): void {
    client.to(receiver).emit("invite", client.id);
  }

  updateGame(winnerID: number, winnerScore: number, loserID, loserScore): void {
	this.userService.saveMatch(winnerID, winnerScore, loserID, loserScore);
	}
}
