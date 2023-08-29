import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { createUserDTO } from 'users/dtos/createUser.dto';
import { User } from 'users/user.entity';
import { UsersService } from 'users/users.service';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService{
	constructor(private userService: UsersService) {}
	async validate(user: createUserDTO): Promise<User> {
		return await this.userService.create(user.email, user.username);
	}

	async generate2FA(user: User) {
		const secret = authenticator.generateSecret();

		const otpAuthUrl = authenticator.keyuri(user.email, 'Transcendence', secret);
		await this.userService.set2FA(user.id, secret);

		return {
			secret,
			otpAuthUrl
		}
	}

	async is2FAEnabled(twoFactorSecret: string, user: User) {
		return authenticator.verify({
			token: twoFactorSecret,
			secret: user.twoFactorSecret
		})
	}

	async generateQrCode(otpAuthUrl: string) {
		return (toDataURL(otpAuthUrl));
	}

	async loginwith2FA(user: Partial<User>){
		const payload = {
			email: user.email,
			
		}
	}
}


//   const authService = new AuthService();
  
//   export default authService;

// @Injectable()
// export class AuthService extends PassportStrategy(Strategy, '42'){

// 	constructor()
// 	{
// 		super()
// 		passport.

// 	}
	// constructor() {
	// 	super({
	// 		client process.env.FORTYTWO_APP_ID,
	// 		clientSecret: process.env.FORTYTWO_APP_SECRET,
	// 		callbackURL: "http://127.0.0.1:3000/auth/42/callback"

	// 	});
	// }

	// async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
	// 	const user = {id: profile.id, name: profile.displayName};
	// 	return user;
	// }
// }
