import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { createUserDTO } from '../dtos/createUser.dto'
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Achievement } from 'entities/achievement.entity';
import { MatchDTO } from 'dtos/match.dto';

@Controller('users')
export class UsersController {
	
	constructor(private userService: UsersService){}
	@Post('/signup')
	createUser(@Body() body: createUserDTO) {
		this.userService.create(body.email, body.username, body.fullname, body.image);
	}

	// @Get('/:id')
	// findUser(@Param('id') id: string){
	// 	return (this.userService.findOne(parseInt(id)))
	// }

	@Get()
	findAllUsers(){
		return (this.userService.findAllUsers())
	}

	@Delete('/:id')
	deleteUser(@Param('id') id: string){
		return (this.userService.remove(parseInt(id)))
	}

	@Delete('/:id/friends/:friendId')
	deleteFriend(@Param('id') id: string, @Param('friendId') fId: string){
		return (this.userService.removeFriend(parseInt(id), parseInt(fId)))
	}

	@Get('/achievements')
	@UseGuards(JwtAuthGuard)
	async getAchievements(@Req() req): Promise<Achievement[]>{
		// console.log('test log')
		console.log('in get achievements, req.user: ', req.user);
		console.log('in get achievements, req.user.id: ', req.user.id);
		return (await this.userService.getAchievements(req.user.id))
	}

	// @Patch(':id/giveAchievement/:achievementTitle')
	// @UseGuards(JwtAuthGuard)
	// giveAchievement(@Req() req, @Param('id') id: string, @Param('achievementTitle') achievementTitle: string){
	// 	console.log('in give achievement, req.user.id: ', req.user.id);
	// 	return (this.userService.addAchievement(req.user.id, achievementTitle))
	// }
	@Get('my/channels')
	@UseGuards(JwtAuthGuard)
	async my_channels(@Req() req){
		// console.log(req.user.id);
		// console.log(await this.userService.findUserChan(req.user.id))
		return (await this.userService.findUserChan(req.user.id));
	}

	// @Get('my/matches')
	// @UseGuards(JwtAuthGuard)
	// async my_matches(@Req() req){
	// 	// console.log(req.user.id);
	// 	return (await this.userService.getMatches(req.user.id));
	// }

	@Post('save/match')
	// @UseGuards(JwtAuthGuard)
	async save_match(@Body() body: MatchDTO){
		// console.log(req.user.id);
		console.log('in save match, body: ', body);
		return (await this.userService.saveMatch(body.winnerId, body.winnerScore, body.loserId, body.loserScore));
	}

	@Get('my/friends')
	@UseGuards(JwtAuthGuard)
	async my_friends(@Req() req){
		console.log('in my friends, req.user.id: ', req.user.id);
		// console.log(req.user.id);
		return (await this.userService.getFriends(req.user.id));
	}

	@Get('my/blocked')
	@UseGuards(JwtAuthGuard)
	async my_blocked(@Req() req){
		return (await this.userService.get_blocked(req.user.id));
	}
}