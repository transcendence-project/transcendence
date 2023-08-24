import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import express from 'express';
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
// Initialize Passport
  app.use(passport.initialize());

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
