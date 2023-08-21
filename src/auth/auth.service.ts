import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42'

@Injectable()
export class AuthService extends PassportStrategy(Strategy, '42'){
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
}
