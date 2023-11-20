import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Channel } from '../entities/channel.entity';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Socket } from 'socket.io';
import { AuthService } from 'auth/auth.service';


@Injectable()
export class ChatService {
	private connected_users: Map<string, User> = new Map();
	private game_invites: Map<string, string[]> = new Map(); // store only user names?
	private direct_msg: Map<string, {to: string, from: string, content: string, created: Date }[]> = new Map();

	constructor(@InjectRepository(Channel) private channelRepo: Repository<Channel>,
	@InjectRepository(Message) private messageRepo: Repository<Message>,
	private authService: AuthService ){}

	// view all channels
	async get_all_chan() {
		return this.channelRepo.find();
	}

	// view all channel members
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

	// get channel by name
	async chan_by_name(chan_name: string) // or by id
	{
		return (await this.channelRepo.findOne({ where: { room_name: chan_name }, relations: ['members', 'messages'] }));
	}

	async create_chan(chan_name: string, user: User, pass: string) {
		const chan = await this.chan_by_name(chan_name);
		if (chan){
			// const all_chan = await this.get_all_chan();
			// console.log(all_chan);
			console.log(`Channel ${chan_name} already exists`);
			return null;
		}
		else {
			try{
				if (pass){
					const chan2 = this.channelRepo.create({ room_name: chan_name, owner: user, password: pass, 
						members: [], admins: [], messages: [],  description: "", isGroupChannel: true, is_protected: true });
					chan2.members.push(user);
					chan2.admins.push(user);
					await this.channelRepo.save(chan2);
					console.log(`Channel ${chan_name} created successfully`);
					return (chan2)
				}
				else
				{
					const chan2 = this.channelRepo.create({ room_name: chan_name, owner: user, password: pass, 
						members: [], admins: [], messages: [], description: "", isGroupChannel: true, is_public: true });
					chan2.members.push(user);
					chan2.admins.push(user);
					await this.channelRepo.save(chan2);
					console.log(`Channel ${chan_name} created successfully`);
					// console.log(chan2.members);
					return (chan2)
				}

			}catch (error) {
			console.error('Error while saving channel:', error);
			}
		}
	}

	async add_chan_mem(user: User, chan_name: string) {
		// insert or create the user in the channel memeber table
		const chan = await this.chan_by_name(chan_name);
		if (chan) {
			chan.members.push(user);
			await this.channelRepo.save(chan);
		}
		// else channel doesnot exist
	}

	async rm_chan_mem(user: User, chan_name: string) {
		const userIdToRemove = user.id;
		const chan = await this.chan_by_name(chan_name);
		if (chan) {
			chan.members = chan.members.filter(member => member.id !== userIdToRemove); // Remove the user
			await this.channelRepo.save(chan);
		}
	}

	async add_chan_admin(user: User, chan_name: string) {
		const chan = await this.chan_by_name(chan_name);
		if (chan) {
			chan.admins.push(user);
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

	async save_chan_message(sender: User, chan_name: string, content: string){
		const chan = await this.chan_by_name(chan_name);
		const message = this.messageRepo.create({senderID: sender.id, sender: sender, channel: chan, content: content, createdAt: null });
		chan.messages.push(message);
		await this.messageRepo.save(message);
		// console.log(chan);
	}

	//  ----------------------- CHECKS -----------------------------
	async is_admin(user_name: string, chan_name: string) {
		const user = this.channelRepo.findOneBy({/* user_name */ }); // from the admin table/array
		if (user)
			return true;
		else
			return false;
	}
	async is_owner(user_name: string, chan_name: string) {
		const user = this.channelRepo.findOneBy({/* user_name */ }); // from the owner table/array
		if (user)
			return true;
		else
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
		// if in banned table of repo
		// return true
		// else
		// return false;
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

// --------------------------------SPECIFIC TO OWNERS/ADMINISTRATORS-------------------------

	async kick_user(user_to_kick: string, chan_name: string) {
		// rm chan_mem
	}
	// ban user
	async ban_user(user_to_ban: string, chan_name: string) {
		// add user to the banned table of the 
	}
	// mute user
	async mute_user(req_user: string, user_to_mute: string, chan_name: string) {
		// if (this.is_owner(req_user) || this.is_admin(req_user))
		// add user to the mute table?
	}
	async unmute_user(req_user: string, user_to_mute: string, chan_name: string) {
		// if (this.is_owner(req_user) || this.is_admin(req_user))
		// delete user to the mute table?
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
		// console.log(token);
		const user = await this.authService.user_by_token(token);
		// console.log('user from set_user below');
		// console.log(user);
		this.connected_users.set(client.id, user);
		// for (const [userID, user] of this.connected_users.entries())
		// {
		// 	console.log('comes here?????');
		// 	console.log(userID);
		// 	console.log(user);
			// if (userID === client_id){
			// 	console.log("USER FOUNDDD!!!!!");
				// return user;
			// }
		// }
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
		
		if (room.is_protected === true)
		{
			console.log(arg);
			console.log(room.password);
			// if (room.password){
				// if (arg === room.password){ // check if the password enterd is correct
				// 	return true;
				// else
				// 	return false;
			// }
		}
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

// -------------------------------------------------------------------------------