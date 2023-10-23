import { TypeOrmModuleOptions } from "@nestjs/typeorm";
// import { Channel } from "./entities/channel.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: '123',
	database: 'postgres',
	// logging: ['query', 'error'], // for logging queries and errors
	entities: [__dirname + '/**/*.entity{.ts,.js}'],
	synchronize: true // remove in production environment
}