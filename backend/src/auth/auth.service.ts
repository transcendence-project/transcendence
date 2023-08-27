import { Injectable } from '@nestjs/common';
import { createUserDTO } from 'users/dtos/createUser.dto';
import { User } from 'users/user.entity';
import { UsersService } from 'users/users.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService{
	constructor(private userService: UsersService, private jwtService: JwtService) {}
	async validate(user: createUserDTO): Promise<User> {
		const token = this.jwtService.sign({username: user.username});
		// console.log(token);
		// const decodeToken = this.jwtService.verify(token);
		return await this.userService.create(user.email, user.username);
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
