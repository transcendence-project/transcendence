import { Logger } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect ,SubscribeMessage, WebSocketGateway ,WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { UsersService } from '../users/users.service';
import { info } from 'console';

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
  async handleConnection(client: Socket, ...args: any[]) {
    const header = client.handshake.headers;

    const token = header.token;
    this.gameService.addConnectUser(client, token);
  }

  handleDisconnect(client: any) {
    this.clientCount--;
    console.log("Client disconnected");
    client.emit('disconnected', this.clientCount);
  }

  @SubscribeMessage('start-game')
  start_game(@ConnectedSocket() client: Socket,@MessageBody() payload: any)
  {
    //   console.log(payload);
    this.gameService.setCanvasDimensions(payload.width, payload.height);
    this.gameService.init_table();
    this.startGameUpdates();
    // console.log(tableData);
    // client.emit('table', tableData);
    //   this.gameService.draw_table(payload.width,payload.height);
    // return {event:'table' ,data: this.gameService.init_table(client)};
  }
  
  @SubscribeMessage('info')
  handleInfoGame(@ConnectedSocket() client: Socket, @MessageBody() data: object) {
    console.log(data);
    // if (data && data.info)
    // {
    //   const dataType = data.info.type;
    // }
  }
  @SubscribeMessage('paddleMove')
  handlePaddleMove(@ConnectedSocket() client: Socket, @MessageBody() data: { direction: string }) {
    const playerId = client.id; // Or any other way you identify your player
    this.gameService.movePlayerPaddle(data.direction);
  }
  private gameInterval;
  private lastUpdateTime: number;
  startGameUpdates() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
    this.lastUpdateTime = Date.now();
    this.gameInterval = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
      this.gameService.updateGame(deltaTime);
      this.server.emit('table', this.gameService.getCurrentGameState());
      this.lastUpdateTime = currentTime;
    }, 1000 / 60);
  }
  
  inviteUser(client: Socket, receiver: string): void {
    client.to(receiver).emit("invite", client.id);
  }

  updateGame(winnerID: number, winnerScore: number, loserID, loserScore): void {
	this.userService.saveMatch(winnerID, winnerScore, loserID, loserScore);
	}
}
