import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42'
import { AuthService } from './auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor( private authService: AuthService
  ) {
    super({
      clientID: 'u-s4t2ud-d71d93ae1ed7236dccb8c56127a16205ca6fc7aca52c8dfe81f61aaf0ec7a31a',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/42/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ): Promise<any> {
    const user = await this.authService.validate({
	email: profile._json.email,
	username: profile.username,
	});
	console.log(user)
	if (!user) {
	  return done(new UnauthorizedException(), false);
	}
	done(null, user);
  }
  
}
