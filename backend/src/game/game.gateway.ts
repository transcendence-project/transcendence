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
    const header = client.handshake.headers;

    const token = header.token;
    this.gameService.addConnectUser(client, token);
    console.log("Connected");
  }

  handleDisconnect(client: any) {
    console.log(this.gameService.classic_queue);
    this.gameService.classic_queue.pop();
    console.log("Client disconnected");
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
        console.log("from gatway onlone mode");
      this.gameService.onlineGame(client, data);
    }
  }
  
  @SubscribeMessage('paddleMove')
  handlePaddleMove(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    // const playerId = client.id; // Or any other way you identify your player
    console.log("from gateway 454556546554656d4s5c4sc465sd45csdc65dsc654cd54c65c4654c65c64c65sd65c6sc465ds4c65sdc465ds54c6dsc")
    this.gameService.movePlayerPaddle(client, data);
  }
  
  inviteUser(client: Socket, receiver: string): void {
    client.to(receiver).emit("invite", client.id);
  }

  updateGame(winnerID: number, winnerScore: number, loserID, loserScore): void {
	this.userService.saveMatch(winnerID, winnerScore, loserID, loserScore);
	}
}
