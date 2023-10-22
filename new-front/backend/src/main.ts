import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
//   const configService: ConfigService = app.get(ConfigService);

// 	app.enableCors({
// 		origin:configService.get('*'),
// 		credentials: true,
// 	});

// 	await app.listen(configService.get('PORT', 3000));


  app.enableCors({
    // origin: 'http://localhost:3000', 
	origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });
  await app.listen(3000);
}
// bootstrap().catch(() => null);
bootstrap();
