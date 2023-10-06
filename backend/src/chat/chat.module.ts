import { Module } from '@nestjs/common';
// import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity';
import { Message } from '../entities/message.entity';

@Module({
	//   controllers: [ChatController],
	imports: [TypeOrmModule.forFeature([Channel, Message])],
	providers: [ChatService],
	exports: [ChatService]
})
export class ChatModule { }
