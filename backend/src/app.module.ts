import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './ormconfig';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule,
		TypeOrmModule.forRoot(typeOrmConfig),
		AuthModule, ConfigModule.forRoot(),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
