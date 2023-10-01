import { Injectable } from '@nestjs/common';
import { Channel } from '../entities/channel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity'
import { AuthService } from 'auth/auth.service';

// for now websocket service mainly to save in the repository / store real time 
// because injecting repo in gateway isn't workin for some reason

@Injectable()
export class WebsocketService {
	private connected_users: Map<string, any> = new Map();

	constructor(@InjectRepository(Channel) private roomRepo: Repository<Channel>, private authService: AuthService){}

	find_user(client: any){
		for (const [userID, user] of this.connected_users.entries())
			if (userID === client.id){
				return user;
			}
	}

	async set_user(client: any){
		const token = client.handshake.query.token; // should supposedly give the jwt token sent by the front end
		const user = await this.authService.user_by_token(token);
		this.connected_users.set(client.id, user);
		// set user as online
	}

	delete_user(client: any){
		this.connected_users.delete(client.id);
		// set user as offline
	}

	is_online(client: any): boolean{ // or set user as online in databse ??
		for (const [userID, user] of this.connected_users.entries())
			if (userID === client.id)
				return true;
		return false;
	}

}
