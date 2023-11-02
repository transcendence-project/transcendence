import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm'
import { FriendRequest } from 'entities/friend-request.entity';
import { FriendRequestService } from 'friend-requests/FriendRequests.service';
import { Achievement } from 'entities/achievement.entity';
import { SeederService } from '../achievements/achievement.seed';

@Injectable()
export class UsersService {
	constructor(private seederService: SeederService, @InjectRepository(User) private repo: Repository<User>){}

	async create(email: string, userName: string){

		// const user = await this.findAll(userName);
		const user = await this.findOneByUserName(userName);
		if (user)
			return (user)
		const user2 = this.repo.create({email, userName, twoFactorSecret: null, is2FAEnabled: false, friends: [], channels: [], matches: [], achievements: []});
		return (this.repo.save(user2))
	}
	findOne(id: number) {
		return (this.repo.findOneBy({id}))
	}
	async findOneByUserName(userName: string) {
		const user = await this.repo.findOneBy({userName});
		return (user);
	}

	findOneByEmail(email: string) {
		return (this.repo.findOneBy({email}))
	}

	findAll(userName: string) {
		return (this.repo.find({where: {userName}}))
	}

	async findUserChan(user_id: number){
		const user = await this.findOne(user_id);
		return user.channels;
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

	async addFriend(userId: number, friend: User) {
		const user = await this.repo.findOne({where: {id: userId}, relations: ['friends']});
		if (!user.friends){
			user.friends = [];
		}
		if (user.friends.find(f => f.id === friend.id)){
			throw new ConflictException('Friend already added');
		}
		user.friends.push(friend);
		return this.repo.save(user);
	}

	async removeFriend(userId: number, friendId: number) {
		const user = await this.repo.findOne({where: {id: userId}, relations: ['friends']});
		const friend = await this.repo.findOne({where: {id: friendId}, relations: ['friends']});
		if (!user.friends){
			user.friends = [];
		}
		user.friends = user.friends.filter(friend => friend.id !== friendId);
		friend.friends = friend.friends.filter(friend => friend.id !== userId);

		await this.repo.save(friend);
		return this.repo.save(user);
	}

	async getAchievements(userId: number): Promise<Achievement[]> {
		const user = await this.repo.findOne({where: {id: userId}, relations: ['achievements']});
		if (!user)
			throw new NotFoundException('User not found');
		console.log('in get achievements, user achievements: ', user.achievements);
		return user.achievements;
	}

	async addAchievement(userId: number, achievementTitle: string) {
	
		console.log('in add achievement, userId: ', userId);
		console.log('in add achievement, achievementTitle: ', achievementTitle);
		const user = await this.repo.findOne({where: {id: userId}, relations: ['achievements']});
		if (!user)
			throw new NotFoundException('User not found');
		if (user.achievements.find(a => a.title === achievementTitle))
			throw new ConflictException('Achievement already added');
		const achievement = await this.seederService.getAchievementByTitle(achievementTitle);
		if (!achievement)
			throw new NotFoundException('Achievement not found');
		console.log('in add achievement, achievement: ', achievement);
		console.log('in add achievement, user.achievements: ', user.achievements);
		console.log('in add achievement, user: ', user);
		user.achievements.push(achievement);
		return this.repo.save(user);
	}
}
