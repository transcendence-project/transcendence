import { Controller, Get, UseGuards, Req, Res, Param, Post, HttpCode, Body, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { FortyTwoStrategy } from './strategy.42';
import { FortyTwoAuthGuard } from './guard.42';
import { JwtAuthGuard } from './jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private jwtService: JwtService) {
	}
	@Get('42')
	@UseGuards(AuthGuard('42'))
	async login() {

	}

	@Get('/me')
	@UseGuards(JwtAuthGuard)
	getProfile(@Req() req) {
		// console.log('in get profile, req.user: ', req.user);
		return req.user;
	}

	@Get('42/callback')
	@UseGuards(AuthGuard('42'))
	async callback(@Req() req, @Res() res) {
		const user = req.user; // the authenticated user
		const token = this.authService.generate_jwt_token(user.userName, user.id);
		// const decodeToken = this.authService.decode_token(token);
		// console.log('back in controller');
		console.log("Token: ", token);
		const url = new URL('http://localhost:8080/home');
		url.searchParams.set('code', token);
		res.status(200).redirect(url.href);
	}

	@Get('2fa/generate') // GET just for testing, will later be POST
	@UseGuards(JwtAuthGuard) // will get the user which is linked to the sent Bearer token
	async generateQr(@Req() req, @Res() res) {
		try {
			const otp = this.authService.generateTwoFactorAuthenticationSecret(req.user);
			// console.log(`user 2fa secret = ${user.twoFactorAuthenticationSecret}`);
			const code = await this.authService.generateQrCodeDataURL((await otp).otpauthUrl);
			res.json({ qrCodeDataURL: code });

		} catch (error) {
			console.error('Error generating QR code:', error.message);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}

	@Post('2fa/authenticate/:code')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async authenticate2fa(@Param("code") code: string, @Req() req, ) {
		// console.log(req.user);
		const isCodeValid = this.authService.is2faCodeValid(
			code,
			req.user,
		);
		if (!isCodeValid) {
			console.log("INCORRECT 2 FA CODE !!!!!!!!!!!!");
		}
		// if (!isCodeValid) {
		// 	throw new UnauthorizedException('Wrong authentication code');
		// }
		// redirect to homepage??
		// else login to game, display user profile
	}
}
