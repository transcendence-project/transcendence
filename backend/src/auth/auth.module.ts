import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'users/users.service';
import { ConfigModule } from '../config/config.module';
import { UsersModule } from 'users/users.module';
import { FortyTwoStrategy } from './strategy.42';
import { AppModule } from 'app.module';

@Module({
	imports: [UsersModule, PassportModule.register({ defaultStrategy: '42' }), ConfigModule],
	controllers: [AuthController],
	providers: [AuthService, FortyTwoStrategy],
})
export class AuthModule {}
