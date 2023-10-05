import { Controller, Get, UseGuards, Req, Res, Post, HttpCode, Body, UnauthorizedException, Param } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
	constructor(private JwtService: JwtService, private chatService: ChatService){
	}

	@Get('channels')
	async all_channels(){
		// return all eh channels from the repo
	}

	@Post('/:chan_name/invite') // the user to be invited also
	async inviteUser(@Req() req, @Param('chan_name') chan_name: string){
		// add to the invite list??
	}

	@Post('/:chan_name/set_pass') // password
	async set_pass(@Req() req, @Param('chan_name') chan_name: string){
		// if (this.chatService.is_owner(req.user.userName, chan_name))
			// this.chatService.set_pass(chan_name, /* password */)
		// else
			// error: user not an owner (unauthorized)
	}

	@Post('/:chan_name/set_admin')
	async set_admin(@Req() req, @Param('chan_name') chan_name: string){
		// if (this.chatService.is_owner(req.user.userName, chan_name))
			// this.chatService.set_admin(chan_name, /* user to be set as admin */);
		// else
			// error: user not an owner (unauthorized)
	}

	@Post('/:chan_name/kick/:id')
	async kick_user(@Req() req, @Param('chan_name') chan_name: string){
		// if (this.chatService.is_owner(req.user.userName, chan_name) || 
			// this.chatService.is_admin(req.user.userName, chan_name))
			// this.chatService.kick_user(/* user to kick */, chan_name);
		// else
			// error: user not an owner or an admin (unauthorized)

	}

	@Post('/:chan_name/ban/:id')
	async ban_user(@Req() req, @Param('chan_name') chan_name: string){
		// if (this.chatService.is_owner(req.user.userName, chan_name) || 
			// this.chatService.is_admin(req.user.userName, chan_name))
			// this.chatService.ban_user(/* user to ban */, chan_name);
		// else
			// error: user not an owner or an admin (unauthorized)
	}

	@Post('/:chan_name/mute/:id')
	async mute_user(@Req() req, @Param('chan_name') chan_name: string){
		// if (this.chatService.is_owner(req.user.userName, chan_name) || 
			// this.chatService.is_admin(req.user.userName, chan_name))
			// this.chatService.mute_user(/* user to mute */, chan_name);
		// else
			// error: user not an owner or an admin (unauthorized)
	}

}
