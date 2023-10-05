import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './ormconfig';
import { AuthModule } from './auth/auth.module';
// import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { FriendRequestController } from 'FriendRequests/FriendRequest.controller';
import { FriendRequestService } from 'FriendRequests/FriendRequests.service';
// import { WebsocketGateway } from './websocket/websocket.gateway';
// import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [UsersModule,
		TypeOrmModule.forRoot(typeOrmConfig),
		AuthModule, ConfigModule.forRoot(), /* ChatModule,*/ GameModule, /*WebsocketModule*/],
  controllers: [AppController],
  providers: [AppService /* WebsocketGateway */],
})
export class AppModule {}
