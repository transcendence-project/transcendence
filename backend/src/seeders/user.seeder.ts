import { Seeder } from "@jorgebodega/typeorm-seeding";
import { User } from "entities/user.entity";
import { DataSource } from "typeorm";
import { generateUser } from "data-generators/user.generator";

export class UserSeeder extends Seeder {
	public async run(dataSource: DataSource) {
		const users: User[] = [] // create users here
		for (let i = 0; i < 10; i++) {
			users.push(generateUser())
		}
		await dataSource.createEntityManager().save<User>(users)
	}
}