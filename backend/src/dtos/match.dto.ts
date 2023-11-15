import { IsNumber, IsString } from 'class-validator';

export class MatchDTO{
	@IsNumber()
	winnerId: number;

	@IsNumber()
	loserId: number;
	
	@IsNumber()
	winnerScore: number;
	
	@IsNumber()
	loserScore: number;
}