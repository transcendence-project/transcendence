import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { Strategy as FortyTwoStrategy } from 'passport-42';
import { UsersService } from 'users/users.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'users/users.module';
import { AppModule } from 'app.module';

@Module({
	imports: [PassportModule.register({Strategy: '42'}), UsersModule, ConfigModule.forRoot()],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
