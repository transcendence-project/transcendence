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

@Injectable()
export class UsersService {
  constructor(
    private seederService: SeederService,
	private matchesService: MatchesService,
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  async create(
    email: string,
    userName: string,
    fullname: string,
    image: string,
  ) {
    // const user = await this.findAll(userName);
    const user = await this.findOneByUserName(userName);
    if (user) return user;
    const user2 = this.repo.create({
      email,
      fullname,
      userName,
      image,
      twoFactorSecret: null,
      is2FAEnabled: false,
      friends: [],
      channels: [],
	matchesAsPlayerOne: [],
	matchesAsPlayerTwo: [],
      achievements: [],
	  points: 50,
    });
    return this.repo.save(user2);
  }
  findOne(id: number) {
	return (this.repo.findOne({where: {id}, relations: ['channels']}))
  }
  async findOneByUserName(userName: string) {
    const user = await this.repo.findOneBy({ userName });
    return user;
  }

  async findOneByEmail(email: string) {
	const user = await this.repo.findOneBy({ email });
	return user;
  }

  async findUserChan(user_id: number) {
    const user = await this.findOne(user_id);
	console.log(user)
    return user.channels;
  }

  update(id: number, attrs: Partial<User>) {
    return this.repo.update(id, attrs);
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
    return this.repo.save(user);
  }

  async removeFriend(userId: number, friendId: number) {
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
    return this.repo.save(user);
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
    return this.repo.save(user);
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
	this.repo.save(winner);
	this.repo.save(loser);
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

	// console.log('in save match, winner: ', winner);
	// console.log('in save match, loser: ', loser);
	const winnerScoreString: string = winnerScore.toString();
	const loserScoreString: string = loserScore.toString();
	const score: string = winnerScoreString + '-' + loserScoreString;

	const match = await this.matchesService.create(winner, loser, score, loserID, winnerID);
	console.log('in save match, winner: ', winner);
	console.log('in save match, loser: ', loser);
	console.log('in save match, match: ', match);
	// console.log('in save match, winner matches as player one: ', winner.matchesAsPlayerOne);
	// console.log('in save match, loser matches as player two: ', loser.matchesAsPlayerTwo);
	winner.matchesAsPlayerOne.push(match);
	loser.matchesAsPlayerTwo.push(match);

	this.repo.save(winner);
	this.repo.save(loser);

	this.updateUserPoints(winnerID, loserID);
	this.checkAchievements(winner, loser);
  }

  async getMatches(userId: number) {
	const matches = await this.matchesService.findMatches(userId);
	return matches;
  }
}
