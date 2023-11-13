import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { UsersService } from 'users/users.service';
import { MatchDTO } from 'dtos/match.dto';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchesService: MatchesService, private readonly userService: UsersService) {}

  @Post()
  async create(@Body() matchData: MatchDTO) {
	this.userService.saveMatch(matchData.winnerID, matchData.loserID, matchData.winnerScore, matchData.loserScore);
  }

  @Get()
  async findAll() {
    return this.matchesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }
}
