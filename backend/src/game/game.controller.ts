import { Controller, Get, Post, UseGuards, Req, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { UsersService } from '../users/users.service';
import { MatchesService } from '../matches/matches.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { MatchDTO } from 'dtos/match.dto';

@Controller('game')
export class GameController {
	constructor(
		private readonly gameService: GameService,
		private readonly userService: UsersService,
		private readonly matchesService: MatchesService,
	) { }

	@Get('/matches')
	@UseGuards(JwtAuthGuard)
	async getMatches(@Req() req) {
		return await this.matchesService.findOne(req.user.id);
	}

	@Post('/giveMatch')
	async giveMatch(@Body() match: MatchDTO) {
	this.userService.saveMatch(match.winnerId, match.loserId, match.winnerScore, match.loserScore);
	}

}
