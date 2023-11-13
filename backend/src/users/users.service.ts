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
  async findOne(id: number) {
	const user = await this.repo.findOneBy({ id });
	return user;
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
    // console.log("in add achievement, achievementTitle: ", achievementTitle);
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

  async checkAchievements(userId: number) {
	const user: User = await this.findOne(userId);
	const matches: Match[] = await this.matchesService.findMatches(userId);
	const achievements: Achievement[] = await this.getAchievements(userId);

	if (matches.length === 1 && !achievements.find((a) => a.title === "First Match")) {
		this.addAchievement(userId, "First Match");
	}
	if (user.matchesAsPlayerOne.length === 1 && !achievements.find((a) => a.title === "First Win")) {
		this.addAchievement(userId, "First Win");
	}
	if (matches.length === 3 && !achievements.find((a) => a.title === "Played 3 Matches")) {
		this.addAchievement(userId, "Played 3 Matches");
	}
}


  async saveMatch(winnerID: number, winnerScore: number, loserID: number, loserScore: number) {
	const winner: User = await this.findOne(winnerID);
	const loser: User = await this.findOne(loserID);
	const winnerScoreString: string = winnerScore.toString();
	const loserScoreString: string = loserScore.toString();
	const score: string = winnerScoreString + '-' + loserScoreString;

	const match = await this.matchesService.create(winner, loser, score, loserID, winnerID);

	winner.matchesAsPlayerOne.push(match);
	loser.matchesAsPlayerTwo.push(match);

	this.repo.save(winner);
	this.repo.save(loser);

	this.updateUserPoints(winnerID, loserID);
	this.checkAchievements(winnerID);
  }

  async getMatches(userId: number) {
	const user = await this.findOne(userId);
	const matches = await this.matchesService.findMatches(userId);
	return matches;
  }
}
