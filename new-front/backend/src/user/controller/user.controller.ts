import { Controller } from '@nestjs/common';
import { Post, Body, Get, Param, Put, Delete} from '@nestjs/common'
import { UserService } from '../service/user.service'
import { Observable } from 'rxjs'
import { UserI } from '../models/user.interface'

@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	findAll(): Observable<UserI[]> {
		return this.userService.findAll();
	}

	@Post()
	add(@Body() user: UserI): Observable<UserI>{
		return this.userService.add(user);
	}
/* new additions */

	@Get(':id')
	findOne(@Param('id') id: number): Observable<UserI> {
		const user = this.userService.findOne(id);
		if (!user){
			throw new Error('User not found')
		} else {
			return user
		}
	}

	@Put(':id')
	update(@Param('id') id: number, @Body() user: UserI): Promise<Observable<UserI>>{
		return this.userService.update(id, user);
	}

	@Delete(':id')
	delete(@Param('id') id: number): Observable<UserI>{
		const user = this.userService.findOne(id);
		if (!user){
			throw new Error('User not found')
		} else {
			return this.userService.findOne(id);
		}
	}

}
