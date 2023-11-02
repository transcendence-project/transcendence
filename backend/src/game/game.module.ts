import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [GameController],
  imports: [AuthModule],
  providers: [GameService, GameGateway]
})
export class GameModule {}
