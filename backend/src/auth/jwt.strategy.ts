
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
	private readonly userService: UsersService, 
	private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('CLIENT_SECRET') // can specify another secret for jwt in .env later
    });
  }

  async validate(payload: any) {
	console.log('in validate, payload: ', payload);
	// console.log(`jwt strtategy payload.username = ${payload.username}`);
	  const user = await this.userService.findOne(payload.sub);
	  if (!user) {
		  throw new UnauthorizedException('Invalid token');
		}
    return user;
  }
}