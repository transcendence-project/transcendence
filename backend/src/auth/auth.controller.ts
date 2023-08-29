import { Controller, Get, UseGuards, Req, Res, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
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
		const user = req.user; // the authenticated user
		return res.redirect('https://en.wikipedia.org/wiki/Pong'); // can redirect to our application page
	}

	// @Get('/profile')
	// async profile(@Req()req) {
	// 	return req.user;
		// display profile page
	//   }

	@Post('2fa/generate')
	async generate2FA(@Req() req, @Body() body) {
		const is2FAEnabled = await this.authService.is2FAEnabled(req.user.twoFactorSecret, req.user);
		if (!is2FAEnabled)
			throw new UnauthorizedException('2FA is not enabled');
		await this.authService.generate2FA(req.user);
	}
}
