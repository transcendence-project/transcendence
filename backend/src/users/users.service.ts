import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private repo: Repository<User>){}

	create(email: string, userName: string, password: string) {

		const user = this.repo.create({email, userName, password})
		return (this.repo.save(user))
	}
	findOne(id: number) {
		return (this.repo.findOneBy({id}))
	}
	findAll(userName: string) {
		return (this.repo.find({where: {userName}}))
	}

	update(id: number, attrs: Partial<User>) {
		return (this.repo.update(id, attrs))
	}

	remove(id: number) {
		return (this.repo.delete(id))
	} 
}
