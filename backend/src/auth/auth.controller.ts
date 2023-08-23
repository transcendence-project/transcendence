import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import express from 'express';
import { User } from '../users/user.entity';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService){}
	@Get('42')
	@UseGuards(AuthGuard('42'))
	async login() {;
	}

	@Get('42/callback')
	@UseGuards(AuthGuard('42'))
	async callback(@Req() req, @Res() res) {
		// the AuthGuard stores info about the authenticated
		// user in the req object, specifically the user property
		const user = req.user;
		// console.log(`User ID: ${user.id}`);
		// console.log(`User User Name: ${user.userName}`);
		return res.redirect('https://en.wikipedia.org/wiki/Pong');
	}

	// @Get('/profile')
	// async profile(@Req()req) {
	// 	return req.user;
	//   }
}
