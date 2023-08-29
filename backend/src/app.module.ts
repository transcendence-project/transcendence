import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './ormconfig';
import { AuthModule } from './auth/auth.module';
import { MailerService } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [UsersModule,
		TypeOrmModule.forRoot(typeOrmConfig),
		AuthModule, ConfigModule.forRoot(),
		MailerModule.forRoot({
			transport: {
				service: 'gmail',
				secure: false,
				auth: {
					user: process.env.MAILER_USER,
					pass: process.env.MAILER_PASSWORD,
				},
			},
			defaults: {
				from: '"No Reply" <oabushar@student.42abudhabi.ae>',
			},
			template: {
				dir: __dirname + '/templates',
				adapter: new HandlebarsAdapter(),
				options: {
					strict: true,
				},
			},
		})],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
