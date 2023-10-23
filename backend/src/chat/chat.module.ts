import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity';
import { Message } from '../entities/message.entity';
import { ChatController } from './chat.controller';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Module({
	controllers: [ChatController],
	imports: [TypeOrmModule.forFeature([Channel, Message])],
	providers: [ChatService, JwtService],
	exports: [ChatService]
})
export class ChatModule { }
