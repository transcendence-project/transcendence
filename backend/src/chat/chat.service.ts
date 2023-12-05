import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Channel } from '../entities/channel.entity';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Socket } from 'socket.io';
import { AuthService } from 'auth/auth.service';
import * as bcrypt from 'bcrypt'
import { UsersService } from 'users/users.service';


@Injectable()
export class ChatService {
	private connected_users: Map<string, User> = new Map();

	constructor(@InjectRepository(Channel) private channelRepo: Repository<Channel>,
	@InjectRepository(Message) private messageRepo: Repository<Message>,
	private authService: AuthService){}
	

		//  ----------------------- CHANNEL GETTERS -----------------------------
	async get_all_chan() {
		return this.channelRepo.find();
	}

	async chan_by_name(chan_name: string): Promise<Channel> // or by id
	{
		return (await this.channelRepo.findOne({ where: { room_name: chan_name, isGroupChannel: true }, relations: ['members', 'admins', 'owner', 'messages', 'banned', 'muted'] }));
	}

	async mem_by_chan(chan_name: string): Promise<User[] | undefined> {
		const channel = await this.channelRepo.findOne({ where: { room_name: chan_name, isGroupChannel: true }, relations: ['members'] });
		if (channel)
			return channel.members;
	}

	async admin_by_chan(chan_name: string): Promise<User[] | undefined> {
		const channel = await this.channelRepo.findOne({ where: { room_name: chan_name, isGroupChannel: true }, relations: ['admins'] });
		if (channel)
			return channel.admins;
	}

	async owner_by_chan(chan_name: string): Promise<User | undefined> {
		const channel = await this.channelRepo.findOne({ where: { room_name: chan_name, isGroupChannel: true }, relations: ['owner'] });
		if (channel)
			return channel.owner;
	}

	async banned_by_chan(chan_name: string): Promise<User[] | undefined> {
		const channel = await this.channelRepo.findOne({ where: { room_name: chan_name, isGroupChannel: true }, relations: ['banned'] });
		if (channel)
			return channel.banned;
	}

	async muted_by_chan(chan_name: string): Promise<User[] | undefined> {
		const channel = await this.channelRepo.findOne({ where: { room_name: chan_name, isGroupChannel: true }, relations: ['muted'] });
		if (channel)
			return channel.muted;
	}

	async frndchan_by_name(frnd_name: string): Promise<Channel> {
		const channel = await this.channelRepo.createQueryBuilder("channel")
		.leftJoinAndSelect("channel.members", "member")
   		.leftJoinAndSelect("channel.messages", "message")
		.where("member.userName = :frnd_name", { frnd_name })
		.andWhere("channel.isGroupChannel = :is_group", { is_group: false })
		.getOne();
		if (channel)
		{
			console.log(channel);
			return channel;
		}
	}

		//  ----------------------- CREATE / UPDATE -----------------------------
	async create_chan(chan_name: string, user: User, pass: string, type: string, client: any) {
		const chan = await this.chan_by_name(chan_name);
		if (chan || chan_name === "" || chan_name.length > 20){
			const detail = ""
			if (chan)
			{
				const data_to_send = {
					severity: "error",
					summary: "Cannot Create Channel",
					detail: `Channel ${chan_name} already exists.`
				}
				client.emit('notify', data_to_send);
			}
			else if (chan_name === "" || !chan_name)
			{
				const data_to_send = {
					severity: "error",
					summary: "Cannot Create Channel",
					detail: `Channel name cannot be empty.`
				}
				client.emit('notify', data_to_send);
			}
			else
			{
				const data_to_send = {
					severity: "error",
					summary: "Cannot Create Channel",
					detail: `Channel name too long.`
				}
				client.emit('notify', data_to_send);
			}
			return null;
		}
		else if (type === "prot" &&  pass === "") {
			const data_to_send = {
				severity: "error",
				summary: "Cannot Create Channel",
				detail: `Password cannot be empty.`
			}
			client.emit('notify', data_to_send);
			return null;
		}
		else {
			try{
				if (type === "prot"){
					const chan2 = this.channelRepo.create({ room_name: chan_name, owner: user, password: pass, 
						members: [], admins: [], messages: [], banned: [], muted: [], isGroupChannel: true, is_protected: true });
					chan2.members.push(user);
					await this.channelRepo.save(chan2);
					console.log(`Channel ${chan_name} created successfully`);
					return (chan2)
				}
				else if (type === "pub")
				{
					const chan2 = this.channelRepo.create({ room_name: chan_name, owner: user, password: pass, 
						members: [], admins: [], messages: [], banned: [], muted: [], isGroupChannel: true, is_public: true });
					chan2.members.push(user);
					await this.channelRepo.save(chan2);
					console.log(`Channel ${chan_name} created successfully`);
					return (chan2)
				}
				else if (type === "priv")
				{
					console.log('type is priv');
					const chan2 = this.channelRepo.create({ room_name: chan_name, owner: user, password: pass, 
					members: [], admins: [], messages: [], banned: [], muted: [], isGroupChannel: true, is_private: true });
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

	async create_friend_chan(user: User, friend: User) {
		const channel = await this.frndchan_by_name(friend.userName);
		console.log(friend);
		// console.log(user);
		if (!channel){
			const chan = this.channelRepo.create({ room_name: "", owner: null, password: "", 
				members: [], admins: [], messages: [], banned: [], muted: [], isGroupChannel: false, is_protected: true });
				chan.members.push(user);
				chan.members.push(friend);
				await this.channelRepo.save(chan);
				console
		}
		// console.log(channel);
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

	async add_chan_mute(user: User, chan_name: string) {
		const chan = await this.chan_by_name(chan_name);
		// console.log('chan: ', chan);
		if (chan) {
			chan.muted.push(user);
			await this.channelRepo.save(chan);
		}
	}

	async rem_chan_mute(user: User, chan_name: string) {
		const chan = await this.chan_by_name(chan_name);
		if (chan) {
			chan.muted = chan.muted.filter(mute => mute.id !== user.id);
			await this.channelRepo.save(chan);
		}
	}

	async save_chan_message(sender: User, chan_name: string, content: string){
		const chan = await this.chan_by_name(chan_name);
		const message = this.messageRepo.create({senderID: sender.id, sendername: sender.userName, sender: sender, channel: chan, content: content, createdAt: null });
		chan.messages.push(message);
		await this.messageRepo.save(message);
	}

	async save_frnd_chan_msg(sender: User, frnd_name: string, content: string) {
		console.log(`frnd name = ${frnd_name}`);
		const channel = await this.frndchan_by_name(frnd_name);
		// console.log(channel)
		const message = this.messageRepo.create({senderID: sender.id, sendername: sender.userName, sender: sender, channel: channel, content: content, createdAt: null });
		if (channel.messages) {
			channel.messages.push(message);
		}
		await this.messageRepo.save(message);
	}

	async change_chan_pass(chan_name: string, new_pass: string) {
		const chan = await this.chan_by_name(chan_name);
		if (chan)
		{
			chan.password = new_pass;
			await this.channelRepo.save(chan);
		}
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
		const admins = await this.admin_by_chan(chan_name);
		const isAdmin = admins.some((admin: User) => admin.userName === user_name);
		if (isAdmin)
			return true;
		else
			return false;
	}
	async is_owner(user_name: string, chan_name: string) {
		const owner = await this.owner_by_chan(chan_name);
		if (owner)
			if (owner.userName === user_name)
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
		const banned = await this.banned_by_chan(chan_name);
		const isBanned = banned.some((ban: User) => ban.userName === user_name);
		if (isBanned)
			return true;
		else
			return false;
	}

	async is_mute(user_name: string, chan_name: string) {
		const muted = await this.muted_by_chan(chan_name);
		if (muted)
		{
			const isMuted = muted.some((mute: User) => mute.userName === user_name);
			if (isMuted)
				return true;
			else
				return false;
		}
	}

	async can_join(user: User, room: Channel, arg: string, client: any): Promise<boolean> {
		if (await this.is_ban(user.userName, room.room_name) === true)
		{
			const data_to_send = {
				severity: "error",
				summary: "Unable to Join",
				detail: `You are banned from Channel ${room.room_name}.`
			};
			client.emit('notify', data_to_send);
			return false;
		}
		if (room.is_protected === true)
		{
			if (room.password)
			{
				try{
					const match = await bcrypt.compare(arg, room.password);
					if (match)
						return true;
					else
					{
						const data_to_send = {
							severity: "error",
							summary: "Unable to Join",
							detail: `Incorrect Password`
						};
						client.emit('notify', data_to_send);
						return false;
					}
				}
				catch (error) {
					console.error('Error while comparing password:', error);
					return false;
				}
			}
		}
		return true;
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

	user_exist(client_id: string) {
		if (this.connected_users.get(client_id))
			return true;
		else
			return false;
	}

	async set_user(client: Socket){
		const token = client.handshake.auth.token;
		const user = await this.authService.user_by_token(token);
		if (user && this.find_user_with_name(user.userName)){
			return null;
		}
		this.connected_users.set(client.id, user);
		return user;
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