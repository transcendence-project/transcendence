import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { Strategy as FortyTwoStrategy } from 'passport-42';
import { UsersService } from 'users/users.service';

@Injectable()
export class AuthService{
	constructor(private userService: UsersService, private configService: ConfigService) {
		this.configurePassport();
	}
	configurePassport() {
		passport.use(new FortyTwoStrategy({
			clientID: this.configService.get<string>('CLIENT_ID'),
			clientSecret: this.configService.get<string>('CLIENT_SECRET'),
		   callbackURL: this.configService.get<string>('CALL_BACK_URL'),
		   profileFields: {
			'id': function (obj) { return String(obj.id); },
			'username': 'login',
			'displayName': 'displayname',
			'emails': 'email',
		  }
		}, async (accessToken: string, refreshToken: string, profile: Profile, done) => {
			// console.log('Profile:', profile);
			const user = {
				id: parseInt(profile.id),
				name: profile.displayName,
				login: profile.username,
				email: profile.emails.toString(),
				// email: profile.emails.map(emailObject => emailObject.value),
			};
			console.log(`User ID: ${user.id}`);
			console.log(`User Name: ${user.name}`);
			console.log(`User login: ${user.login}`);
			console.log(`User e-mail: ${user.email}`);
			// console.log(profile)
			// Authentication callback logic
			// create and store user in database
			this.userService.create(user.email, user.login, user.name)
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
