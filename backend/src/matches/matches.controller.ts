import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { UsersService } from 'users/users.service';
import { MatchDTO } from 'dtos/match.dto';
import { JwtAuthGuard } from 'auth/jwt.guard';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchesService: MatchesService, private readonly userService: UsersService) {}

  @Post()
  async create(@Body() matchData: MatchDTO) {
	this.userService.saveMatch(matchData.winnerId, matchData.loserId, matchData.winnerScore, matchData.loserScore);
  }

  @Get()
  async findAll() {
    return this.matchesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }
  
  @Get('my/matches')
  @UseGuards(JwtAuthGuard)
  async findMatches(@Req() req) {
	return this.matchesService.findMatches(req.user.id);
  }

  @Get('my/wins')
  @UseGuards(JwtAuthGuard)
  async findWins(@Req() req) {
	return this.matchesService.findMatchesAsPlayerOne(req.user.id);
  }

  @Get('my/losses')
  @UseGuards(JwtAuthGuard)
  async findLosses(@Req() req) {
	return this.matchesService.findMatchesAsPlayerTwo(req.user.id);
  }

}
