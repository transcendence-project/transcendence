import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import passport from 'passport';
import { Strategy as FortyTwoStrategy } from 'passport-42';
import { IsEmail } from 'class-validator';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService{
	constructor() {
		this.configurePassport();
	}
	configurePassport() {
		passport.use(new FortyTwoStrategy({
			clientID: "u-s4t2ud-d71d93ae1ed7236dccb8c56127a16205ca6fc7aca52c8dfe81f61aaf0ec7a31a",
			clientSecret: "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",
		   callbackURL: "http://localhost:3000/auth/42/callback",
		   profileFields: {
			'id': function (obj) { return String(obj.id); },
			'username': 'login',
			'displayName': 'displayname',
			'emails': 'email',
		  }
		}, (accessToken: string, refreshToken: string, profile: Profile, done) => {
			// console.log('Profile:', profile);
			const user = {
				id: parseInt(profile.id),
				name: profile.displayName,
				login: profile.username,
				email: profile.emails,
			};
			console.log(`User ID: ${user.id}`);
			console.log(`User Name: ${user.name}`);
			console.log(`User login: ${user.login}`);
			console.log(`User e-mail: ${user.email}`);
			// Authentication callback logic
			// create and store user in database
			return done(null, user);
		}));
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
