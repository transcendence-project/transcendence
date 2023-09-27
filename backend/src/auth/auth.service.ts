import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { createUserDTO } from '../dtos/createUser.dto';
import { User } from 'users/user.entity';
import { UsersService } from 'users/users.service';
import { toDataURL } from 'qrcode';
import { iUser } from 'users/users.inteface';

@Injectable()
export class AuthService{
	constructor(private userService: UsersService) {}
	async validate(user: createUserDTO): Promise<User> {
		
		const user1 = await this.userService.create(user.email, user.username);
		// console.log(user1.userName);
		return user1;
	}

	async generateTwoFactorAuthenticationSecret(user: iUser) {
		const secret = authenticator.generateSecret();
	
		const otpauthUrl = authenticator.keyuri(user.email, 'PONG 2.0', secret);
	
		user.twoFactorAuthenticationSecret = secret;
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
	
	  is2faCodeValid(twoFactorAuthenticationCode: string, user: iUser) {
		return authenticator.verify({
		  token: twoFactorAuthenticationCode,
		  secret: user.twoFactorAuthenticationSecret
		});
	  }
}
