import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42'
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor( private authService: AuthService, private configService: ConfigService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('CALL_BACK_URL'),
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
