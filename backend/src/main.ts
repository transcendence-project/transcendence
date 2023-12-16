require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import express from 'express';
import passport from 'passport';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: 'http://localhost:8080',
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
		console.log('Server started on http://localhost:3000');
	});
}
bootstrap();
