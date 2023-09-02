import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private repo: Repository<User>){}

	async create(email: string, userName: string) {

		const user = await this.findAll(userName);
		// const user = await this.findOneByUserName(userName);
		// if (user)
		// 	return (user)
		if (user.length)
			return (null)
		const user2 = this.repo.create({email, userName})
		return (this.repo.save(user2))
	}
	findOne(id: number) {
		return (this.repo.findOneBy({id}))
	}
	findOneByUserName(userName: string) {
		return (this.repo.findOneBy({userName}))
	}

	findAll(userName: string) {
		return (this.repo.find({where: {userName}}))
	}

	update(id: number, attrs: Partial<User>) {
		return (this.repo.update(id, attrs))
	}

	async remove(id: number) {
		const user = await this.findOne(id)
		if (!user)
			return (NotFoundException)
		console.log(user)
		return (this.repo.delete(id))
	} 
}
