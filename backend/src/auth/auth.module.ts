import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.startegy';
import { UsersService } from 'users/users.service';
import { ConfigModule } from '../config/config.module';
import { UsersModule } from 'users/users.module';
import { FortyTwoStrategy } from './strategy.42';
import { AppModule } from 'app.module';

@Module({
	imports: [UsersModule, PassportModule.register({}), ConfigModule, JwtModule.register({
		secret: process.env.CLIENT_SECRET,
		signOptions: { 
			expiresIn: '5h',
			algorithm: 'HS256'},
	  })],
	controllers: [AuthController],
	providers: [AuthService, FortyTwoStrategy, JwtStrategy],
})
export class AuthModule {}
