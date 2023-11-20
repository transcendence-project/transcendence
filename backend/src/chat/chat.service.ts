import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Channel } from '../entities/channel.entity';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Socket } from 'socket.io';
import { AuthService } from 'auth/auth.service';
import * as bcrypt from 'bcrypt'


@Injectable()
export class ChatService {
	private connected_users: Map<string, User> = new Map();
	// private game_invites: Map<string, string[]> = new Map(); // store only user names?
	// private direct_msg: Map<string, {to: string, from: string, content: string, created: Date }[]> = new Map();

	constructor(@InjectRepository(Channel) private channelRepo: Repository<Channel>,
	@InjectRepository(Message) private messageRepo: Repository<Message>,
	private authService: AuthService ){}

		//  ----------------------- GET CHANNEL / CONTENT -----------------------------
	async get_all_chan() {
		return this.channelRepo.find();
	}

	async chan_by_name(chan_name: string) // or by id
	{
		return (await this.channelRepo.findOne({ where: { room_name: chan_name }, relations: ['members', 'admins', 'owner', 'messages', 'banned'] }));
	}

	async mem_by_chan(chan_name: string): Promise<User[] | undefined> {
		const channel = await this.channelRepo.findOne({ where: { room_name: chan_name }, relations: ['members'] });
		if (channel)
			return channel.members;
	}

	async admin_by_chan(chan_name: string): Promise<User[] | undefined> {
		const channel = await this.channelRepo.findOne({ where: { room_name: chan_name }, relations: ['admins'] });
		if (channel)
			return channel.admins;
	}

	async owner_by_chan(chan_name: string): Promise<User | undefined> {
		const channel = await this.channelRepo.findOne({ where: { room_name: chan_name }, relations: ['owner'] });
		if (channel)
			return channel.owner;
	}

		//  ----------------------- CREATING / ADDING / SAVE -----------------------------
	async create_chan(chan_name: string, user: User, pass: string) {
		const chan = await this.chan_by_name(chan_name);
		if (chan || chan_name === ""){
			if (chan)
				console.log(`Channel ${chan_name} already exists`);
			else
				console.log("Channel name cannot be empty");
			return null;
		}
		else {
			try{
				if (pass){
					const chan2 = this.channelRepo.create({ room_name: chan_name, owner: user, password: pass, 
						members: [], admins: [], messages: [], banned: [], description: "", isGroupChannel: true, is_protected: true });
					chan2.members.push(user);
					await this.channelRepo.save(chan2);
					console.log(`Channel ${chan_name} created successfully`);
					return (chan2)
				}
				else
				{
					const chan2 = this.channelRepo.create({ room_name: chan_name, owner: user, password: pass, 
						members: [], admins: [], messages: [], banned: [], description: "", isGroupChannel: true, is_public: true });
					chan2.members.push(user);
					await this.channelRepo.save(chan2);
					console.log(`Channel ${chan_name} created successfully`);
					return (chan2)
				}

			}catch (error) {
			console.error('Error while saving channel:', error);
			}
		}
	}

	async add_chan_mem(user: User, chan_name: string) {
		const chan = await this.chan_by_name(chan_name);
		if (chan) {
			chan.members.push(user);
			await this.channelRepo.save(chan);
		}
		// else channel doesnot exist
	}

	async add_chan_admin(user_to_add: string, chan_name: string) {
		const chan = await this.chan_by_name(chan_name);
		const user = await this.find_user_with_name(user_to_add);
		if (chan) {
			chan.admins.push(user);
			await this.channelRepo.save(chan);
		}
	}

	async add_chan_ban(user: User, chan_name: string) {
		const chan = await this.chan_by_name(chan_name);
		if (chan) {
			chan.banned.push(user);
			await this.channelRepo.save(chan);
		}
	}

	async save_chan_message(sender: User, chan_name: string, content: string){
		const chan = await this.chan_by_name(chan_name);
		const message = this.messageRepo.create({senderID: sender.id, sender: sender, channel: chan, content: content, createdAt: null });
		// console.log(message);
		chan.messages.push(message);
		await this.messageRepo.save(message);
		// console.log(chan);
	}


		//  ----------------------- REMOVE -----------------------------

	async rem_chan_mem(user: User, chan_name: string) {
		const userIdToRemove = user.id;
		const chan = await this.chan_by_name(chan_name);
		if (chan) {
			chan.members = chan.members.filter(member => member.id !== userIdToRemove);
			chan.admins = chan.admins.filter(admin => admin.id !== userIdToRemove);
			if (chan.owner)
				if (chan.owner.id === userIdToRemove)
					chan.owner = null;
			// if (!chan.members.length && !chan.admins.length && !chan.owner)
			// {
			// 	try {
			// 		await this.channelRepo.remove(chan);
			// 		console.log('Channel deleted successfully.');
			// 	  } catch (error) {
			// 		console.error('Error deleting channel:', error.message);
			// 	  }
			// }
			await this.channelRepo.save(chan);
		}
	}

	async rem_chan_admin(user: User, chan_name: string) {
		const admin_to_rem = user.userName;
		const chan = await this.chan_by_name(chan_name);
		if (chan) {
			chan.admins = chan.admins.filter(admin => admin.userName !== admin_to_rem);
			await this.channelRepo.save(chan);
		}
	}



	//  ----------------------- CHECKS -----------------------------
	async is_admin(user_name: string, chan_name: string) {
		const chan = await this.chan_by_name(chan_name);
		const isAdmin = chan.admins.some((admin: User) => admin.userName === user_name);
		if (isAdmin)
			return true;
		else
			return false;
	}
	async is_owner(user_name: string, chan_name: string) {
		const chan = await this.chan_by_name(chan_name);
		if (chan.owner)
			if (chan.owner.userName === user_name)
				return true;
		return false;
	}
	async is_chan_mem(user_name: string, chan_name: string) {
		const memebers = await this.mem_by_chan(chan_name);
		const user = memebers.find(memeber => memeber.userName === user_name);
		if (user)
			return true
		else
			return false;
	}

	async is_ban(user_name: string, chan_name: string) {
		const chan = await this.chan_by_name(chan_name);
		const isBanned = chan.banned.some((ban: User) => ban.userName === user_name);
		if (isBanned)
			return true;
		else
			return false;
	}

	async is_mute(user_name: string, chan_name: string) {
		// if in mute table of repo
		// return true
		// else
		// return false;
	}

// -----------------------------------SPECIFIC TO OWNERS---------------------------------
	async set_pass(chan_name: string, pass: string) {
		// update/set password of the channel (from repo or local storage?)
	}


	// ----------------------------------WEBSOCKET SERVICES------------------------------
	find_user_with_id(client_id: string){
		const user = this.connected_users.get(client_id);
		return user;
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


	async set_user(client: Socket){
		const token = client.handshake.auth.token;
		const user = await this.authService.user_by_token(token);
		this.connected_users.set(client.id, user);
		// set user as online
	}

	delete_user(client: any){
		this.connected_users.delete(client.id);
		// set user as offline
	}


	// rem_user_invites(client: any) {
	// 	const user = this.find_user_with_id(client.id);
	// 	for (const [recipient, senders] of this.game_invites.entries()) {
	// 	  if (recipient === user.userName)
	// 		this.game_invites.delete(recipient);
	// 	}
	// }

	// invite_user_to_game(inviter: User, invitee: User)
	// {
	// 	const senders = this.game_invites.get(invitee.userName) || [];
	// 	senders.push(inviter.userName);
	// 	this.game_invites.set(inviter.userName, senders);
	// }
	
	is_online(client: any): boolean{ // or set user as online in databse ??
		for (const [userID, user] of this.connected_users.entries())
			if (userID === client.id)
				return true;
		return false;
	}

	async can_join(user: User, room: Channel, arg: string): Promise<boolean> {
		if (await this.is_ban(user.userName, room.room_name) === true)
			return false;
		if (room.is_protected === true)
		{
			if (room.password)
			{
				try{
					const match = await bcrypt.compare(arg, room.password);
					if (match)
						return true;
					else
						return false;
				}
				catch (error) {
					console.error('Error while comparing password:', error);
					return false;
				}
			}
		}
		return true;
	}

	// find_priv_msg_room(to: User, from: User){
	// 	for (const [room_name, messages] of this.direct_msg.entries()){
	// 		for (const msg_contents of messages){
	// 			if (msg_contents.to === to.userName && msg_contents.from === from.userName || 
	// 				msg_contents.to === from.userName && msg_contents.to === from.userName){
	// 				return room_name;
	// 			}
	// 		}
	// 	}
	// }
	// set_direct_msg(to: User, from: User, room_name: string, content: string)
	// {
	// 	const message = {to: to.userName, from: from.userName, content: content, created: new Date()};
	// 	// Retrieve the existing array of messages for the room or create a new one if it doesn't exist
	// 	const dms = this.direct_msg.get(room_name) || [];
	// 	dms.push(message);
	// 	this.direct_msg.set(room_name, dms);
	// }
}

// -------------------------------------------------------------------------------