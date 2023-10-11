require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WebsocketGateway } from '../src/websocket/websocket.gateway';
import { AuthService } from './auth/auth.service';
import express from 'express';
import passport from 'passport';
import { IoAdapter } from '@nestjs/platform-socket.io'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
	origin: 'http://localhost:8080',
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	// credentials: true,
  });
// Initialize Passport
  app.use(passport.initialize());
// Include the authentication router from authService
  app.useGlobalPipes(
	new ValidationPipe({
		whitelist: true
	}));
//   await app.listen(3000);
	app.useWebSocketAdapter(new IoAdapter(app));
	app.listen(3000, () => {
		console.log('Server started on http://localhost:3000');
	});
}
bootstrap();
