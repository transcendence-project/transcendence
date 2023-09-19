import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel.entity'
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Channel]), JwtModule.register({
	secret: process.env.CLIENT_SECRET,
	signOptions: { 
		// expiresIn: '5h',
		algorithm: 'HS256'},
  })],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule {}
