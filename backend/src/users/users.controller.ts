import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { createUserDTO } from '../dtos/createUser.dto'
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Achievement } from 'entities/achievement.entity';

@Controller('users')
export class UsersController {
	
	constructor(private userService: UsersService){}
	@Post('/signup')
	createUser(@Body() body: createUserDTO) {
		this.userService.create(body.email, body.username, body.fullname, body.image);
	}

	// @Get('/:id')
	// findUser(@Param('id') id: number){
	// 	console.log('in find user, id: ', id);
	// 	return (this.userService.findOne(id))
	// }

	@Get()
	findAllUsers(@Query('userName') userName: string){
		return (this.userService.findAll(userName))
	}

	@Delete('/:id')
	deleteUser(@Param('id') id: string){
		return (this.userService.remove(parseInt(id)))
	}

	@Delete('/:id/friends/:friendId')
	deleteFriend(@Param('id') id: string, @Param('friendId') friendId: string){
		return (this.userService.removeFriend(parseInt(id), parseInt(friendId)))
	}

	@Get('/achievements')
	@UseGuards(JwtAuthGuard)
	async getAchievements(@Req() req): Promise<Achievement[]>{
		// console.log('test log')
		console.log('in get achievements, req.user: ', req.user);
		console.log('in get achievements, req.user.id: ', req.user.id);
		return (await this.userService.getAchievements(req.user.id))
	}

	@Patch(':id/giveAchievement/:achievementTitle')
	@UseGuards(JwtAuthGuard)
	giveAchievement(@Req() req, @Param('id') id: string, @Param('achievementTitle') achievementTitle: string){
		console.log('in give achievement, req.user.id: ', req.user.id);
		return (this.userService.addAchievement(req.user.id, achievementTitle))
	}
	@Get('my/channels')
	@UseGuards(JwtAuthGuard)
	async my_channels(@Req() req){
		return (await this.userService.findUserChan(req.user.id));
	}
}