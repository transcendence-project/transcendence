import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private repo: Repository<User>){}

	async create(email: string, userName: string) {

		// const user = await this.findAll(userName);
		const user = await this.findOneByUserName(userName);
		// if (user)
		// 	return (user)
		if (user)
			return (user)
		const user2 = this.repo.create({email, userName, twoFactorSecret: null, is2FAEnabled: false})
		
		return (this.repo.save(user2))
	}
	findOne(id: number) {
		return (this.repo.findOneBy({id}))
	}
	findOneByUserName(userName: string) {
		return (this.repo.findOneBy({userName}))
	}

	findOneByEmail(email: string) {
		return (this.repo.findOneBy({email}))
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
	
	async set2FA(id: number, secret: string) {
		const user = await this.findOne(id);
		if (!user)
			return (NotFoundException)
		user.twoFactorSecret = secret;
		return (this.repo.save(user));
	}

	async enable2FA(id: number) {
		const user = await this.findOne(id);
		if (!user)
			return (NotFoundException)
		user.is2FAEnabled = true;
		return (this.repo.save(user));
	}
}
