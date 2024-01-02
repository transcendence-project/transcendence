import { Logger } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect ,SubscribeMessage, WebSocketGateway ,WebSocketServer, MessageBody, ConnectedSocket , WsException} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

import { SocketService } from './socket.service'
import { GameSelectDto } from './dto/game.dto';

const configService = new ConfigService();
@WebSocketGateway({
	namespace: 'game',
	cors: {
		origin: configService.get('FRONTEND_URL'),
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
      console.log("Connected Game Gatway");
    const header = client.handshake.headers;

    const token = header.token;
    this.gameService.addConnectUser(client, token);
  }

  handleDisconnect(client: any) {
    console.log("Client Disconnected!");
    this.gameService.removePlayer(client, 1);
  }
  
  @SubscribeMessage('info')
   handleInfoGame(@ConnectedSocket() client: Socket, @MessageBody() data: GameSelectDto ) {
    console.log(data.gameMode);
    if (data.gameMode === 'single')
    {
        this.gameService.creatSingleGame(client, data);
    }
    else if (data.gameMode === 'online')
    {
      this.gameService.onlineGame(client, data);
    }
  }

  @SubscribeMessage('leave-queue')
   leaveQueue(@ConnectedSocket() client: Socket) {
    this.gameService.removePlayerFromQueue(client);
  }

  @SubscribeMessage('route-leave')
   routeLeaver(@ConnectedSocket() client: Socket) {
    console.log("the player is route away from the game page");
    this.gameService.removePlayer(client, 2);
  }
  
  @SubscribeMessage('paddleMove')
  handlePaddleMove(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    this.gameService.movePlayerPaddle(client, data);
  }

    // socketError(error: string) {
    //     this.logger.error(error)
    //     throw new WsException(error)
    // }
  @SubscribeMessage('invite')   
  handleInvite(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    // const playerId = client.id; // Or any other way you identify your player
    // this.gameService.movePlayerPaddle(client, data);
    const inviter = this.gameService.find_user_with_id(client);

    if (inviter.user.userName === data)
        client.emit('error-status');
    else {
        this.gameService.responeInvite(client, data);
        console.log("from the game socket for invite")
    }
    // console.log("this is from the game socket and this is the user invite", data, inviter.user.userName);
  }

  @SubscribeMessage('response-status')   
  handleInviteStatus(@ConnectedSocket() client: Socket, @MessageBody() data: Boolean) {
    this.gameService.responeInviteStatus(client, data);
  }

//   @SubscribeMessage('try')   
//   try(@ConnectedSocket() client: Socket, @MessageBody() data: Boolean) {
//     // this.gameService.responeInviteStatus(client, data);
//     console.log("try route")
//   }
  
  inviteUser(client: Socket, receiver: string): void {
    client.to(receiver).emit("invite", client.id);
  }

  updateGame(winnerID: number, winnerScore: number, loserID, loserScore): void {
	this.userService.saveMatch(winnerID, winnerScore, loserID, loserScore);
	}
}
