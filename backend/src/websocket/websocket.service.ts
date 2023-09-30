import { Injectable } from '@nestjs/common';
import { Channel } from '../chat/channel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity'
import { AuthService } from 'auth/auth.service';

// for now service mainly to save in the repository / store real time 
// because injecting repo in gateway isn't workin for some reason

@Injectable()
export class WebsocketService {
	private connected_users: Map<string, any> = new Map();

	constructor(@InjectRepository(Channel) private roomRepo: Repository<Channel>, private authService: AuthService){}

	find_user(client: any){
		/*  for...of - is a JavaScript loop construct that allows you to iterate
		over iterable objects like arrays, strings, maps, sets, etc.*/
		/* clients.entries() - returns an iterable object (an iterator) that 
		yields [key, value] pairs for each entry in the clients Map. */
		for (const [userID, user] of this.connected_users.entries())
			if (userID === client.id){
				return user;
			}
	}

	async set_user(client: any){
		const token = client.handshake.query.token; // should supposedlyy give the jwt token sent by the front end
		//either decode the user from the token // could create function in auth service
		const user = await this.authService.user_by_token(token);
		this.connected_users.set(client.id, user);
		// set user as online
	}

	delete_user(client: any){
		this.connected_users.delete(client.id);
		// set user as offline
	}

	is_online(client: any): boolean{
		for (const [userID, user] of this.connected_users.entries())
			if (userID === client.id)
				return true;
		return false;
	}

}
