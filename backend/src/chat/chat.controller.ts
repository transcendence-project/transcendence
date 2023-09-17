import { Controller, Get, UseGuards, Req, Res, Post, HttpCode, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('chat')
export class ChatController {
	constructor(private JwtService: JwtService){
	}
	@Get('channels')
	async all_channels(){
	}
	// @Get('/:chan_name')
	// async view_chan(){

	// }
	@Get('message/:username') // direct message user
	async messageUser(){

	}

	@Post('/:chan_name')
	async create_chan(){
		
	}
	@Post('/:chan_name/join')
	async joinChan(){

	}

	@Post('/:chan_name/leave')
	async leaveChan(){

	}

	@Post('/:chan_name/message')
	async sendMsg(){

	}

	@Post('/:chan_name/invite')
	async inviteUser(){

	}

	@Post('/:chan_name/set_pass')
	async set_pass(){

	}

	@Post('/:chan_name/set_admin')
	async set_admin(){

	}

	@Post('/:chan_name/kick/:id')
	async kick_user(){

	}

	@Post('/:chan_name/ban/:id')
	async ban_user(){

	}

	@Post('/:chan_name/mute/:id')
	async mute_user(){

	}

}
