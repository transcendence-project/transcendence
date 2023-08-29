
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret key', // have to replace it with the secret key
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneByUserName(payload.username);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}