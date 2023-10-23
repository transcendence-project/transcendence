import { Controller, Get, UseGuards, Req, Res, Post, HttpCode, Body, UnauthorizedException, Param } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
	constructor(private JwtService: JwtService, private chatService: ChatService){
	}

	// all channels
	@Get('channels')
	async all_channels(){
		// return all the channels from the repo
	}

	// could add it in the users service
	// @Get('mychannels')
	// async my_channels(){
	// 	// return all the channels that the user is part of from the repo 
	// }
}
