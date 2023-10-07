import { Injectable } from '@nestjs/common';
import { Channel } from '../entities/channel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity'
import { AuthService } from 'auth/auth.service';
import { Message } from '../entities/message.entity';

// for now websocket service mainly to save in the repository / store real time 
// because injecting repo in gateway isn't workin for some reason

@Injectable()
export class WebsocketService {
	private connected_users: Map<string, User> = new Map();
	private game_invites: Map<string, string[]> = new Map(); // store only user names?
	private direct_msg: Map<string, {to: string, from: string, content: string, created: Date }[]> = new Map();

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
		for (const [recipient, senders] of this.game_invites.entries()) {
		  if (recipient === user.userName)
			this.game_invites.delete(recipient);
		}
	}

	invite_user_to_game(inviter: User, invitee: User)
	{
		const senders = this.game_invites.get(invitee.userName) || [];
		senders.push(inviter.userName);
		this.game_invites.set(inviter.userName, senders);
	}
	
	is_online(client: any): boolean{ // or set user as online in databse ??
		for (const [userID, user] of this.connected_users.entries())
			if (userID === client.id)
				return true;
		return false;
	}

	can_join(user: User, room: Channel, arg: string): boolean {
		//  IF CHANNEL IS PRIVATE 
		// maybe not necessary because we wont display the channel in the list if it is private
		if (room.is_private == false)
			return true;

		// IF CHANNEL HAS PASSOWRD
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

	find_priv_msg_room(to: User, from: User){
		for (const [room_name, messages] of this.direct_msg.entries()){
			for (const msg_contents of messages){
				if (msg_contents.to === to.userName && msg_contents.from === from.userName || 
					msg_contents.to === from.userName && msg_contents.to === from.userName){
					return room_name;
				}
			}
		}
	}
	set_direct_msg(to: User, from: User, room_name: string, content: string)
	{
		const message = {to: to.userName, from: from.userName, content: content, created: new Date()};
		// Retrieve the existing array of messages for the room or create a new one if it doesn't exist
		const dms = this.direct_msg.get(room_name) || [];
		dms.push(message);
		this.direct_msg.set(room_name, dms);
	}
}
