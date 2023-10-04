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
	private connected_users: Map<string, User> = new Map();
	private game_invites: Map<User, User> = new Map();

	constructor(@InjectRepository(Channel) private roomRepo: Repository<Channel>, private authService: AuthService){}

	find_user_with_id(client_id: any){
		for (const [userID, user] of this.connected_users.entries())
			if (userID === client_id){
				return user;
			}
	}

	find_user_with_name(username: string){
		for (const [userID, user] of this.connected_users.entries())
			if (user.userName === username){
				return user;
			}
	}

	find_id(username: string){
		for (const [userID, user] of this.connected_users.entries())
		if (user.userName === username){
			return userID;
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

	rem_user_invites(client: any) {
		const user = this.find_user_with_id(client.id);
		for (const [sender, recipient] of this.game_invites.entries()) {
		  if (sender.userName === user.userName || recipient.userName === user.userName) {
			this.game_invites.delete(sender);
		  }
		}
	  }

	is_online(client: any): boolean{ // or set user as online in databse ??
		for (const [userID, user] of this.connected_users.entries())
			if (userID === client.id)
				return true;
		return false;
	}

	allowed_to_join(user: User, room: Channel, arg: string): boolean {
		//  IF CHANNEL IS PRIVATE 
		// maybe not necessary because we wont display the channel in the list if it is private
		if (room.is_private == false)
			return true;

		// IF CHANNEL HAS PASSOWRD AND THE USER HAS PROVIDED IT
		if (room.password){
			if (arg === room.password){
				return true;
			}
			else
				return false;
		}
		// IF NONE OF THESE, CHANNEL MUST BE PUBLIC
		return true;
	}

	invite_user_to_game(inviter: User, invitee: User)
	{
		this.game_invites.set(inviter, invitee);
		// send message to invitee that he has been invited
	}

}
