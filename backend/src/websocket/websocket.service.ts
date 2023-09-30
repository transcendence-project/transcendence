import { Injectable } from '@nestjs/common';
import { Channel } from '../chat/channel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity'

// for now service mainly to save in the repository / store real time 
// because injecting repo in gateway isn't workin for some reason

@Injectable()
export class WebsocketService {
	private connected_users: Map<string, any> = new Map();

	constructor(@InjectRepository(Channel) private roomRepo: Repository<Channel>){}

	async find_user(client: any): Promise</* User | */any | null>{
		/*  for...of - is a JavaScript loop construct that allows you to iterate
		over iterable objects like arrays, strings, maps, sets, etc.*/
		/* clients.entries() - returns an iterable object (an iterator) that 
		yields [key, value] pairs for each entry in the clients Map. */
		for (const [userID, user] of this.connected_users.entries())
			if (userID === client.id){
				return client;
			}
	}

	async set_user(client: any){
		// store client as it is or store it as a User from the db ?
		this.connected_users.set(client.id, client);
	}

	async delete_user(client: any){
		this.connected_users.delete(client.id);
	}
}
