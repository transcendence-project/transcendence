import { Controller, Get, UseGuards, Req, Res, Post, HttpCode, Body, UnauthorizedException, Param } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { use } from 'passport';
import { JwtAuthGuard } from 'auth/jwt.guard';

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
	// @Get('my_channels')
	// @UseGuards(JwtAuthGuard)
	// async my_channels(){
	// 	// return all the channels that the user is part of from the repo 
	// }
	@Get('current_chan/:chan_name')
	async chan_memebrs(@Param("chan_name") chan_name: string){
		// console.log(`chan name in finding chan memebers is ${chan}`);
		console.log(chan_name);
		const chan_ = await this.chatService.chan_by_name(chan_name);
		// return (chan_.members);
		return (chan_)
	}
}
