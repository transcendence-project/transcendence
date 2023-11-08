import { Controller, Get, UseGuards, Req, Res, Post, HttpCode, Body, UnauthorizedException, Param } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
	constructor(private JwtService: JwtService, private chatService: ChatService){
	}

	// all channels
	@Get('all_channels')
	async all_channels(){
		return (await this.chatService.get_all_chan());
	}

	// could add it in the users service
	@Get('my_channels')
	async my_channels(){
		// return all the channels that the user is part of from the repo 
	}
	@Get('chan_memebers')
	async chan_memebrs(@Param("chan_name") chan: string){
		console.log(`chan name in finding chan memebers is ${chan}`);
		return (await this.chatService.chan_by_name(chan));
	}
}
