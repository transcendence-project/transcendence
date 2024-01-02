import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { Match } from "entities/match.entity";
import { InjectRepository } from "@nestjs/typeorm";
// import { FriendRequest } from "entities/friend-request.entity";
// import { FriendRequestService } from "friend-requests/FriendRequests.service";
import { Achievement } from "entities/achievement.entity";
import { SeederService } from "../achievements/achievement.seed";
import { MatchesService } from "matches/matches.service";
import {ConfigService} from "@nestjs/config";
import { ChatService } from "chat/chat.service";

@Injectable()
export class UsersService {
  constructor(
    private seederService: SeederService,
	private matchesService: MatchesService,
	private configService: ConfigService,
    @InjectRepository(User) private repo: Repository<User>,
	// private readonly userRepository: Repository<User>,

  ) {}

  async create(
    email: string,
    userName: string,
    fullname: string,
    image: string,
  ) {
    // const user = await this.findAll(userName);
    const user = await this.findOneByEmail(email);
    if (user) return user;
    const user2 = await this.repo.create({
      email,
      fullname,
      userName,
      image,
      twoFactorSecret: null,
      is2FAEnabled: false,
	  isTwoFactorAuthenticated: false,
      friends: [],
      channels: [],
	  blocked: [],
	matchesAsPlayerOne: [],
	matchesAsPlayerTwo: [],
      achievements: [],
	  wins: 0,
	  loses: 0,
	  points: 50,
    });
    return await this.repo.save(user2);
  }
  async findOne(id: number) {
	return await (this.repo.findOne({where: {id}, relations: ['channels']}))
  }
  async findOneByUserName(userName: string) {
    const user = await this.repo.findOne({ where: {userName}, relations: ['blocked'] });
    return user;
  }

  async findOneByEmail(email: string) {
	const user = await this.repo.findOneBy({ email });
	return user;
  }

  async findUserChan(user_id: number) {
    const user = await this.findOne(user_id);
    return user.channels;
  }

  async update(id: number, attrs: Partial<User>) {
	const user = await this.repo.findOne({ where: { id } });
	if (!user) return NotFoundException;
	Object.assign(user, attrs);
	return await this.repo.save(user);
  }

  async check_isFirstLogin(id: number) {
	const user = await this.repo.findOne({ where: { id } });
	if (!user) return NotFoundException;
	if (user.isFirstLogin === true)
	{
		await this.update(id, {isFirstLogin: false});
		return true;
	}
	else
		return false;
  }

  async update_userName(id: number, userName: string): Promise<User> {
	const user = await this.repo.findOne({ where: { id } });
	if (!user) throw new NotFoundException;

	const user_list = await this.repo.find();
	if (user_list.find((u) => u.userName === userName)){
		throw new BadRequestException("Username already exists");
	}

	user.userName = userName;
	return await this.repo.save(user);
  }

  async update_profilePic(id: number, file_path: string) {
	const user = await this.repo.findOne({ where: { id } });
	if (!user) return NotFoundException;
	user.image = this.configService.get(BACKEND_URL) + '/' + file_path;
	console.log('in update profile pic, user.image: ', user.image);
	return await this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) return NotFoundException;
    console.log(user);
    return this.repo.delete(id);
  }

  async addFriend(userId: number, friend: User) {
    const user = await this.repo.findOne({
      where: { id: userId },
      relations: ["friends"],
    });
    if (!user.friends) {
      user.friends = [];
    }
    if (user.friends.find((f) => f.id === friend.id)) {
      throw new ConflictException("Friend already added");
    }
    user.friends.push(friend);
    return await this.repo.save(user);
  }

  async isFriend(userId: number, friendId: number): Promise<boolean> {
	// console.log('in is friend, userId: ', userId);
	const num_friend_id: number = parseInt(friendId.toString(), 10); // convert string to number
	const user = await this.repo.findOne({
	  where: { id: userId },
	  relations: ["friends"],
	});

	if (!user.friends) {
	  user.friends = [];
	}
	// console.log('in is friend, user.friends: ', user.friends);
	// console.log('in is friend, friendId: ', friendId);
	// console.log('in is friend, user.friends.find((f) => f.id === friendId): ', user.friends.find((f) => f.id === friendId));
	return user.friends.some((friend) => friend.id === num_friend_id);

}

  async removeFriend(userId: number, friendId: number) {
	console.log('in remove friend, userId: ', userId);
    const user = await this.repo.findOne({
      where: { id: userId },
      relations: ["friends"],
    });
    const friend = await this.repo.findOne({
      where: { id: friendId },
      relations: ["friends"],
    });
    if (!user.friends) {
      user.friends = [];
    }
    user.friends = user.friends.filter((friend) => friend.id !== friendId);
    friend.friends = friend.friends.filter((friend) => friend.id !== userId);

    await this.repo.save(friend);
    return await this.repo.save(user);
  }

  async getFriends(userId: number): Promise<User[]> {
	const user = await this.repo.findOne({
	  where: { id: userId },
	  relations: ["friends"],
	});
	if (!user) throw new NotFoundException("User not found");
	return user.friends;
  }

  async getAchievements(userId: number): Promise<Achievement[]> {
    const user = await this.repo.findOne({
      where: { id: userId },
      relations: ["achievements"],
    });
    if (!user) throw new NotFoundException("User not found");
    console.log("in get achievements, user achievements: ", user.achievements);
    return user.achievements;
  }

  async addAchievement(userId: number, achievementTitle: string) {
    // console.log("in add achievement, userId: ", userId);
    console.log("in add achievement, achievementTitle: (", achievementTitle, ")");
    const user = await this.repo.findOne({
      where: { id: userId },
      relations: ["achievements"],
    });
    if (!user) throw new NotFoundException("User not found");
    if (user.achievements.find((a) => a.title === achievementTitle))
      throw new ConflictException("Achievement already added");
    const achievement = await this.seederService.getAchievementByTitle(
      achievementTitle,
    );
    if (!achievement) throw new NotFoundException("Achievement not found");
    // console.log("in add achievement, achievement: ", achievement);
    // console.log("in add achievement, user.achievements: ", user.achievements);
    // console.log("in add achievement, user: ", user);
	console.log('in add achievement: ', achievement);
    user.achievements.push(achievement);
    return await this.repo.save(user);
  }

  async updateUserPoints(winnerID: number, loserID: number)
  {
	const winner: User = await this.findOne(winnerID);
	const loser: User = await this.findOne(loserID);
	winner.points += 10;
	if (loser.points >= 5)
	{
		loser.points -= 5;
	}
	winner.wins += 1;
	loser.loses += 1;
	console.log('in update user points, winner: ', winner);
	console.log('in update user points, loser: ', loser);
	await this.repo.save(winner);	
	await this.repo.save(loser);
  }

  async findAllUsers() {
	return this.repo.find();
  }

  async findAllRankedUser() {
	const user = await this.repo.find({ order: { points: "DESC" } });
	return user;
  }

  async checkAchievements(winner: User, loser: User) {
	const matches: Match[] = await this.matchesService.findMatches(winner.id);
	const achievements: Achievement[] = await this.getAchievements(winner.id);

	// console.log('in check achievements, matches: ', matches);
	// console.log('in check achievements, matches.length: ', matches.length);
	if (matches.length === 1 && !achievements.find((a) => a.title === "First Match")) {
		this.addAchievement(winner.id, "First Match");
	}
	if (winner.matchesAsPlayerOne.length === 1 && !achievements.find((a) => a.title === "First Win")) {
		this.addAchievement(winner.id, "First Win");
	}
	if (matches.length === 3 && !achievements.find((a) => a.title === "Played 3 Matches")) {
		this.addAchievement(winner.id, "Played 3 Matches");
	}

	const loserMatches: Match[] = await this.matchesService.findMatches(loser.id);
	const loserAchievements: Achievement[] = await this.getAchievements(loser.id);

	if (loserMatches.length === 1 && !loserAchievements.find((a) => a.title === "First Match")) {
		this.addAchievement(loser.id, "First Match");
	}
	if (loserMatches.length === 3 && !loserAchievements.find((a) => a.title === "Played 3 Matches")) {
		this.addAchievement(loser.id, "Played 3 Matches");
	}
}


  async saveMatch(winnerID: number, winnerScore: number, loserID: number, loserScore: number) {

	const winner: User = await this.repo.findOne({ where: { id: winnerID}, relations: ["matchesAsPlayerOne"] });
	const loser: User = await this.repo.findOne({ where: { id: loserID}, relations:  ["matchesAsPlayerTwo"]});


	const match = await this.matchesService.create(winner, loser, winnerScore, loserScore, loserID, winnerID);
	winner.matchesAsPlayerOne.push(match);
	loser.matchesAsPlayerTwo.push(match);

	await this.repo.save(winner);
	await this.repo.save(loser);

	this.updateUserPoints(winnerID, loserID);
	this.checkAchievements(winner, loser);
  }

  async getMatches(userId: number) {
	const matches = await this.matchesService.findMatches(userId);
	return matches;
  }

  async getMatchesAsPlayerOne(userId: number) {
	const matches = await this.matchesService.findMatchesAsPlayerOne(userId);
	return matches;
  }

  async add_blocked(friend_name: string, user_name: string) {
	// const friend = await this.findOneByUserName(friend_name);
	const user = await this.findOneByUserName(user_name);
	if (user)
	{
		const frnd = await this.repo.findOne({
			where: { userName: friend_name }});
		user.blocked.push(frnd);
		await this.repo.save(user);
	}
  }

	async get_blocked(user_id: number){
		const user = await this.repo.findOne({
			where: { id: user_id },
			relations: ["blocked"],
		});
		return user.blocked;
	}
  async rem_blocked(friend_name: string, user_name: string) {
	const user = await this.findOneByUserName(user_name);
	if (user)
	{
		user.blocked = user.blocked.filter((friend: User )=> friend.userName !== friend_name);
		await this.repo.save(user);
	}
  }

  async is_blocked(friend_name: string, user_name: string){
	// const user = await this.repo.findOne({
	// 	where: { userName: user_name },
	// 	relations: ["blocked"],
	// });
	const user = await this.findOneByUserName(user_name);
	const isBlocked = user.blocked.some((friend: User) => friend.userName === friend_name);
	if (isBlocked)
		return true;
	else
		return false;
  }
}
