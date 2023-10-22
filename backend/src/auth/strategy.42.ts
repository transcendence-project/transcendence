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
		// clientID: configService.getOrThrow<string>('CLIENT_ID'),
		// clientSecret: configService.getOrThrow<string>('CLIENT_SECRET'),
		// callbackURL: configService.getOrThrow<string>('CALL_BACK_URL'),
		clientID:"u-s4t2ud-4c75e173a2ac0bd45dd6ffef981478484928aedc5657f1e87ccd204863eb89b8",
		clientSecret:"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",
		callbackURL:"http://localhost:3000/auth/42/callback"
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
	// console.log(user)
	// if (!user) {
	//   return done(new UnauthorizedException(), false);
	// }
	done(null, user);
  }
}