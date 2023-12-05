import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './ormconfig';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';

import { FriendRequestController } from 'friend-requests/FriendRequest.controller';
import { FriendRequestService } from 'friend-requests/FriendRequests.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';

@Module({
	imports: [AuthModule, UsersModule,
		TypeOrmModule.forRoot(typeOrmConfig),
		 ConfigModule.forRoot(), ChatModule, GameModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }


// ...typeOrmConfig, // Spread all properties from typeOrmConfig
// typeOrmConfig // efers to a single object, which contains the configuration settings for TypeORM