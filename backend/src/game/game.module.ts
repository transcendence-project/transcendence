import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { GameGateway } from "./game.gateway";
import { UsersService } from "users/users.service";
import { UsersModule } from "users/users.module";

@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway],
  imports: [UsersModule],
})
export class GameModule {}
