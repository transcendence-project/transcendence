import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { createUserDTO } from '../dtos/createUser.dto'
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	
	constructor(private userService: UsersService){}
	@Post('/signup')
	createUser(@Body() body: createUserDTO) {
		this.userService.create(body.email, body.username)
	}

	@Get('/:id')
	findUser(@Param('id') id: string){
		return (this.userService.findOne(parseInt(id)))
	}

	@Get()
	findAllUsers(@Query('userName') userName: string){
		return (this.userService.findAll(userName))
	}

	@Delete('/:id')
	deleteUser(@Param('id') id: string){
		return (this.userService.remove(parseInt(id)))
	}
}