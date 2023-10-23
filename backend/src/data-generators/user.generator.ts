import * as Faker from 'faker';
import { User } from 'entities/user.entity';

export function generateUser(): User {
	const user = new User();
	user.email = Faker.internet.email();
	user.userName = Faker.internet.userName();
	return user;
}