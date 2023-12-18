import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { Match } from "entities/match.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class MatchesService {
  constructor(
	@InjectRepository(Match) private repo: Repository<Match>,
  ) {}

  async create(
	playerOne: User,
	playerTwo: User,
	winnerScore: number,
	loserScore: number,
	opponentID: number,
	winnerID: number,
  ) {
	const match = await this.repo.create({
	  playerOne,
	  playerTwo,
	winnerScore,
	  loserScore,
	  opponentID,
	  winnerID,
	});
	return await this.repo.save(match);
  }

  async findAll() {
	const matches = await this.repo.find();
	return matches;
  }

  async findOne(id: number) {
	const match = await this.repo.findOneBy({ id });
	return match;
  }

async findMatches(userId: number) {
  const matches = await this.repo.find({
    where: [
      { playerOne: { id: userId } },
      { playerTwo: { id: userId } }
    ],
    relations: ["playerOne", "playerTwo"]
  });
  matches.sort((a, b) => b.id - a.id)
  return matches;
}

async findMatchesAsPlayerOne(userId: number): Promise<Match[]> {
	const matches = await this.repo.find({
	where: [
	  { playerOne: { id: userId } }
	],
	relations: ["playerOne", "playerTwo"]
  });
  matches.sort((a, b) => b.id - a.id)
  return matches;
}

async findMatchesAsPlayerTwo(userId: number) {
	const matches = await this.repo.find({
	where: [
	  { playerTwo: { id: userId } }
	],
	relations: ["playerOne", "playerTwo"]
  });
  matches.sort((a, b) => b.id - a.id)
  return matches;
}

}