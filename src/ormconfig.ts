import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
	type: 'postgres',
	host: 'database',
	port: 5432,
	username: 'postgres',
	password: '123',
	database: 'postgres',
	entities: [__dirname + '/**/*.entity{.ts,.js}'],
	synchronize: true
}