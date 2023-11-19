import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { GameGateway } from "./game.gateway";
import { UsersService } from "users/users.service";
import { UsersModule } from "users/users.module";
import { AuthModule } from '../auth/auth.module';
import { MatchesService } from "../matches/matches.service";
import { MatchModule } from "matches/matches.module";
// import {TypeOrmModule} from "@nestjs/typeorm";
// import {Match} from "../entities/match.entity";

@Module({
  controllers: [GameController],
  imports: [AuthModule, UsersModule, MatchModule],
  providers: [GameService, GameGateway],
})
export class GameModule {}
