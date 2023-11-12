import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { GameGateway } from "./game.gateway";
import { UsersService } from "users/users.service";
import { UsersModule } from "users/users.module";
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [GameController],
  imports: [AuthModule],
  providers: [GameService, GameGateway],
  imports: [UsersModule],
})
export class GameModule {}
