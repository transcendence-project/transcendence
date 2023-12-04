import { Controller, Get, UseGuards, Req, Res, Param, Post, Header, HttpCode, Body, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { FortyTwoStrategy } from './strategy.42';
import { FortyTwoAuthGuard } from './guard.42';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {
	}
	@Get('42')
	@UseGuards(AuthGuard('42'))
	@Header('Cache-Control', 'no-store, no-cache, must-revalidate')
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
	// @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
	async callback(@Req() req, @Res() res) {
		const user = req.user;
		const token = this.authService.generate_jwt_token(user.userName, user.id);
		// console.log("Token: ", token);
		if (user.is2FAEnabled == true)
		{
			// redirect to 2fa page and then take them to homepage
			const url = new URL('http://localhost:8080/twofactor');
			url.searchParams.set('code', token);
			return res.status(200).redirect(url.href);
		}
		else{
			// the one below
		}
		const url = new URL('http://localhost:8080/home');
		url.searchParams.set('code', token);
		return res.status(200).redirect(url.href);
	}

	@Get('2fa/generate')
	@UseGuards(JwtAuthGuard)
	async generateQr(@Req() req, @Res() res) {
		console.log("reached jwt generate");
		try {
			const otp = this.authService.generateTwoFactorAuthenticationSecret(req.user);
			const code = await this.authService.generateQrCodeDataURL((await otp).otpauthUrl);
			res.json({ qrCodeDataURL: code });

		} catch (error) {
			console.error('Error generating QR code:', error.message);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}

	@Get('2fa/authenticate/:code')
	@UseGuards(JwtAuthGuard)
	async authenticate2fa(@Param("code") code: string, @Req() req, @Res() res) {
		console.log("inside verifying 2fa");
		const isCodeValid = await this.authService.is2faCodeValid(
			code,
			req.user,
		);
		console.log(isCodeValid)
		if (!isCodeValid) {
			console.log("INCORRECT 2 FA CODE !!!!!!!!!!!!");
			return null;
		}
		else
		{
			console.log("! COOODEE SUCCESSFUULLLLLLL !");
			// const url = new URL('http://localhost:8080/home');
			// res.redirect('http://localhost:8080/home')
			// url.searchParams.set('code', token);
			// return res.status(200).redirect(url.href);
			return "verified";
		}
	}

	@Get('2fa/enable')
	@UseGuards(JwtAuthGuard)
	async enable2fa(@Req() req, ) {
		await this.authService.enable2FA(req.user);
	}
	
	@Get('2fa/disable')
	@UseGuards(JwtAuthGuard)
	async disable2fa(@Req() req, ) {
		await this.authService.disable2FA(req.user);
	}
}
