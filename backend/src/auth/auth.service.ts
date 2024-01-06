import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { authenticator } from 'otplib';
import { createUserDTO } from '../dtos/createUser.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../users/users.service';
import { toDataURL } from 'qrcode';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService{
	constructor(@Inject(forwardRef(() => UsersService)) private userService: UsersService, private jwtService: JwtService) {}
	async validate(user: createUserDTO): Promise<User> {
		// console.log('in validate, user: ', user);
		const user1 = await this.userService.create(user.email, user.username, user.fullname, user.image);
		return user1;
	}
	generate_jwt_token(username: string, id: number, is2FAEnabled: boolean){
		return this.jwtService.sign({ sub: id, username: username, Is2FAEnabled: is2FAEnabled, expiresIn: '1h' });
	}

	update_isFirstLogin(id: number, isFirstLogin: boolean){
		return this.userService.update(id, {isFirstLogin: isFirstLogin});
	}

	decode_token(token: string) {
		return this.jwtService.verify(token);
	}
	async user_by_token(token: string)
	{
        // console.log('in user by token: ', token)
		const decode_token = this.decode_token(token);
		const user = await this.userService.findOne(decode_token.sub);
		return user;
	}

	async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();
	
		const otpauthUrl = authenticator.keyuri(user.userName, 'TRANSCENDENCE', secret);
		await this.userService.update(user.id, {twoFactorSecret: secret});
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
	
	 async is2faCodeValid(twoFactorAuthenticationCode: string, user: User) {
		const verified = authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: user.twoFactorSecret
		  });
		  if (verified)
		 	 await this.userService.update(user.id, {isTwoFactorAuthenticated: true});
		return verified
	  }

	  async enable2FA(user: User){
		await this.userService.update(user.id, {is2FAEnabled: true});
	  }

	 async disable2FA(user: User){
		await this.userService.update(user.id, {is2FAEnabled: false});
	  }
}
