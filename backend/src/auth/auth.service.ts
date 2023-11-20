import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { createUserDTO } from '../dtos/createUser.dto';
import { User } from '../entities/user.entity';
import { UsersService } from 'users/users.service';
import { toDataURL } from 'qrcode';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService{
	constructor(private userService: UsersService, private jwtService: JwtService) {}
	async validate(user: createUserDTO): Promise<User> {
		const user1 = await this.userService.create(user.email, user.username, user.fullname, user.image);
		console.log(user1.userName);
		return user1;
	}
	generate_jwt_token(username: string, id: number ){
		return this.jwtService.sign({ sub: id, username: username});
	}

	decode_token(token: string) {
		return this.jwtService.verify(token);
	}
	async user_by_token(token: string)
	{
		const decode_token = this.decode_token(token);
		const user = await this.userService.findOne(decode_token.sub);
		return user;
	}

	async generateTwoFactorAuthenticationSecret(user: Partial<User>) {
		const secret = authenticator.generateSecret();
	
		const otpauthUrl = authenticator.keyuri(user.email, 'PONG 2.0', secret);
	
		user.twoFactorSecret = secret;
		console.log(secret);
		// this.userService.update(user.id, {twoFactorAuthenticationSecret: secret});
		// await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
	
		return {
		  secret,
		  otpauthUrl
		}
	  }
	  
	async generateQrCodeDataURL(otpAuthUrl: string) {
		const dataURL = toDataURL(otpAuthUrl);
		// console.log(dataURL);
		return dataURL;
	  }
	
	  is2faCodeValid(twoFactorAuthenticationCode: string, user: Partial<User>) {
		return authenticator.verify({
		  token: twoFactorAuthenticationCode,
		  secret: user.twoFactorSecret
		});
	  }
}
