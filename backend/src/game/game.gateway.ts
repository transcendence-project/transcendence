import { Logger } from "@nestjs/common";
import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameService } from "./game.service";

@WebSocketGateway({
  namespace: "game",
  cors: { origin: "http://localhost:8080", credentials: true },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger("GameGateway");
  constructor(private readonly gameService: GameService) {}
  afterInit(): void {
    this.logger.log("WebSocket Gateay Game created");
  }

  handleConnection(client: Socket, ...args: any[]) {
    client.emit("connected", "Successfully connected to the server");
    console.log("Client connected");
  }

  handleDisconnect(client: any) {
    console.log("Client disconnected");
  }

  inviteUser(client: Socket, receiver: string): void {
    sender = this.gameService.find_user_with_id(client.id);
  }
}
