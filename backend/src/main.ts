require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { ConfigService } from '@nestjs/config';
import express from 'express';
import passport from 'passport';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	const backend = configService.get('BACKEND_URL');
	const frontend = configService.get('FRONTEND_URL');
	app.enableCors({
		origin: frontend,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	});
	// Initialize Passport
	app.use(passport.initialize());
	app.use('/uploads', express.static('uploads'));
	// Include the authentication router from authService
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true
		}));
	//   await app.listen(3000);
	app.listen(3000, () => {
		console.log('Server started on',backend);
	});
}
bootstrap();
