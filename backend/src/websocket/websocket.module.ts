import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { ChatModule } from '../chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity'
import { WebsocketService } from './websocket.service';
import { AuthModule } from '../auth/auth.module';


@Module({
	imports: [TypeOrmModule.forFeature([Channel]), ChatModule, AuthModule],
	providers: [WebsocketGateway, WebsocketService],
	exports: [WebsocketGateway, WebsocketService]
})
export class WebsocketModule { }
