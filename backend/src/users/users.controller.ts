import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createUserDTO } from '../dtos/createUser.dto'
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Achievement } from 'entities/achievement.entity';
import { MatchDTO } from 'dtos/match.dto';
import { UpdateUserDTO } from 'dtos/UpdateUser.dto';
import { Express } from 'express';

@Controller('users')
export class UsersController {
	
	constructor(private userService: UsersService){}
	// @Post('/signup')
	// createUser(@Body() body: createUserDTO) {
	// 	this.userService.create(body.email, body.username, body.fullname, body.image);
	// }

	@Patch('/profile-picture')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file', {dest: './uploads'}))
	async upload_profile_picture(@Req() req, @UploadedFile(
		new ParseFilePipe({
			validators: [
				new MaxFileSizeValidator({maxSize: 5000}),
				new FileTypeValidator({fileType: 'image/png'})
			]
		})
	) file : Express.Multer.File){	
		return (await this.userService.update_profilePic(req.user.id, file.path));
	}

	// @Patch('/update')
	// @UseGuards(JwtAuthGuard)
	// @UseInterceptors(FileInterceptor('file', {dest: './uploads'}))
	// async upload_profile_picture(@Req() req, @UploadedFile() file : Express.Multer.File){
	// 	return (await this.userService.update_profilePic(req.user.id, file.path));
	// }



	@Post('/username')
	@UseGuards(JwtAuthGuard)
	async update_username(@Req() req, @Body() body) {
	//   console.log('Received request to update username:', body);
	  const user = await this.userService.update_userName(req.user.id, body.username);
	//   console.log('In update username, user: ', user);
	  return user;
	}

	@Get('leaderboard')
	@UseGuards(JwtAuthGuard)
	async get_leaderboard() {
		return await this.userService.findAllRankedUser();
	}

	@Get('/check-is-first-login')
	@UseGuards(JwtAuthGuard)
	async check_isFirstLogin(@Req() req)
	{
		const isFirstLogin = await this.userService.check_isFirstLogin(req.user.id);
		return { isFirstLogin: isFirstLogin };
	}


	// @Get('/:id')
	// findUser(@Param('id') id: string){
	// 	return (this.userService.findOne(parseInt(id)))
	// }

	@Get('friend/:name')
	@UseGuards(JwtAuthGuard)
	getFriend(@Param("name") name: string){
		const frnd = this.userService.findOneByUserName(name);
		return (frnd);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	findAllUsers(){
		return (this.userService.findAllUsers())
	}

	// @Delete('/:id')
	// deleteUser(@Param('id') id: string){
	// 	return (this.userService.remove(parseInt(id)))
	// }

	// @Delete('/:id/friends/:friendId')
	// deleteFriend(@Param('id') id: string, @Param('friendId') fId: string){
	// 	return (this.userService.removeFriend(parseInt(id), parseInt(fId)))
	// }

	@Get('/achievements')
	@UseGuards(JwtAuthGuard)
	async getAchievements(@Req() req): Promise<Achievement[]>{
		// console.log('test log')
		// console.log('in get achievements, req.user: ', req.user);
		// console.log('in get achievements, req.user.id: ', req.user.id);
		return (await this.userService.getAchievements(req.user.id))
	}

	@Patch('/giveAchievement/:achievementTitle')
	@UseGuards(JwtAuthGuard)
	giveAchievement(@Req() req, @Param('achievementTitle') achievementTitle: string){
		console.log('in give achievement, req.user.id: ', req.user.id);
		return (this.userService.addAchievement(req.user.id, achievementTitle))
	}
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
	@UseGuards(JwtAuthGuard)
	async save_match(@Body() body: MatchDTO){
		return (await this.userService.saveMatch(body.winnerId, body.winnerScore, body.loserId, body.loserScore));
	}

	@Get('/my/friends')
	@UseGuards(JwtAuthGuard)
	async my_friends(@Req() req){
		// console.log(req.user.id);
		const friend = await this.userService.getFriends(req.user.id);
		// console.log("friend: ", friend);
		return (await this.userService.getFriends(req.user.id));
	}

	@Get('my/blocked')
	@UseGuards(JwtAuthGuard)
	async my_blocked(@Req() req){
		return (await this.userService.get_blocked(req.user.id));
	}

	@Delete('/my/friends/:friendId')
	@UseGuards(JwtAuthGuard)
	async delete_friend(@Req() req, @Param('friendId') friendId: string){
		return (await this.userService.removeFriend(req.user.id, parseInt(friendId)));
	}
}