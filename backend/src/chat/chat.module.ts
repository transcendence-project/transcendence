import { Module } from '@nestjs/common';
// import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel.entity';

@Module({
//   controllers: [ChatController],
  imports: [TypeOrmModule.forFeature([Channel])],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule {}
