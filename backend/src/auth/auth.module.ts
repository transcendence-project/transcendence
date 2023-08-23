import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { Strategy as FortyTwoStrategy } from 'passport-42';

@Module({
	imports: [PassportModule.register({Strategy: '42'})],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
