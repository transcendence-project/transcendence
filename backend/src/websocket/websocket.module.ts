import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { ChatModule } from '../chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../chat/channel.entity'
import { WebsocketService } from './websocket.service';


@Module({
	imports: [TypeOrmModule.forFeature([Channel]), ChatModule],
	providers: [WebsocketGateway, WebsocketService],
	exports: [WebsocketGateway, WebsocketService]
})
export class WebsocketModule { }
