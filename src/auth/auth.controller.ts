import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
	@Get('42')
	@UseGuards(AuthGuard('42'))
	async login() {

	}

	@Get('42/callback')
	@UseGuards(AuthGuard('42'))
	async callback() {}
}
