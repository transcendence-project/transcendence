import { Injectable } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { from, Observable, map } from 'rxjs'
import { UserEntity } from '../models/user.entity'
import { UserI } from '../models/user.interface'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>
	){}

	add(user: UserI): Observable<UserI> {
		return from(this.userRepository.save(user))
	}

	findAll(): Observable<UserI[]> {
		return from(this.userRepository.find());
	}

	/* additional */
	findOne(id: number): Observable<UserI>{
		return from(this.userRepository.findOne( { where : { id }}))
	}

	async update(id: number, user: UserI): Promise<Observable<UserI>> {
		await this.userRepository.update(id, user);
		return from(this.userRepository.findOne( { where: {id}}));
	  }
	  

	async delete(id: number): Promise<void>{
	  await from(this.userRepository.delete(id))
	}
}
