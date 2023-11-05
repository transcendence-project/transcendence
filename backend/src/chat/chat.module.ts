import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity';
import { Message } from '../entities/message.entity';
import { ChatController } from './chat.controller';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
	controllers: [ChatController],
	imports: [TypeOrmModule.forFeature([Channel, Message]), AuthModule],
	providers: [ChatService, JwtService, ChatGateway],
	exports: [ChatService]
})
export class ChatModule { }
