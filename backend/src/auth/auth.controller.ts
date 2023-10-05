import { Controller, Get, UseGuards, Req, Res, Post, HttpCode, Body, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
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
		;
	}

	@Get('42/callback')
	@UseGuards(AuthGuard('42'))
	async callback(@Req() req, @Res() res) {
		// the AuthGuard stores info about the authenticated
		// user in the req object, specifically the user property
		const user = req.user; // the authenticated user
		const token = this.jwtService.sign({ username: user.username });
		// const decodeToken = this.jwtService.verify(token);
		console.log('back in controller');
		console.log("Token", token)
		// console.log(user.email);
		res.redirect('http://localhost:3000'); // can redirect to our application page
		return (token); // will store it local storage front end
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	getProfile(@Req() req) {
		return req.user;
	}

	@Get('2fa/generate') // GET just for testing, will later be POST
	// @UseGuards(JwtAuthGuard) // will get the user which is linked to the sent Bearer token
	async generateQr(@Req() req, @Res() res) {
		const user = { // for testing purposes
			id: 4,
			username: 'arafeeq',
			email: 'arafeeq@student.42abudhabi.ae',
			twoFactorAuthenticationSecret: 'helloworld'
		}
		const otp = this.authService.generateTwoFactorAuthenticationSecret(user); // will be req.user later
		// console.log(`user 2fa secret = ${user.twoFactorAuthenticationSecret}`);
		const code = await this.authService.generateQrCodeDataURL((await otp).otpauthUrl);
		return res.redirect(code);
	}

	@Post('2fa/authenticate')
	@HttpCode(200)
	// @UseGuards(JwtAuthGuard) // will get the user which is linked to the sent Bearer token
	async authenticate2fa(@Req() req, @Body() body) {
		const user = { // for testing purposes
			id: 4,
			username: 'arafeeq',
			email: 'arafeeq@student.42abudhabi.ae',
			twoFactorAuthenticationSecret: 'EIRE46D7NJOEQ53O'
		}
		const isCodeValid = this.authService.is2faCodeValid(
			"129140",// will later be body.twoFactorAuthenticationCode
			user, // will later be req.user
		);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		// else login to game, display user profile
		const token = this.jwtService.sign({ username: user.username }); // will later be req.user.username
		return (token) // will store it local storage front end
	}
}
