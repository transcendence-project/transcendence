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

	@Get('current_chan/:chan_name')
	async cur_chan(@Param("chan_name") chan_name: string){
		console.log(chan_name);
		const chan_ = await this.chatService.chan_by_name(chan_name);
		return (chan_)
	}

	@Get('current_frndchan/:frnd_name')
	@UseGuards(JwtAuthGuard)
	async frnd_chan(@Param("frnd_name") frnd_name: string, @Req() req){
		console.log("the friend name is: ",frnd_name);
		const user = req.user;
		const chan_ = await this.chatService.frndchan_by_name(frnd_name, user);
		console.log(chan_);
		return (chan_)
	}
}
