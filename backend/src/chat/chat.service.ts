import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Channel } from '../entities/channel.entity';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class ChatService {
	// -  have to inject database/repo -
	constructor(@InjectRepository(Channel) private channelRepo: Repository<Channel>,
	@InjectRepository(Message) private messageRepo: Repository<Message> ){}

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
		return (this.channelRepo.findOneBy({ room_name: chan_name }));
	}

	async create_chan(chan_name: string, user: User) {
		const chan = this.chan_by_name(chan_name);
		if (chan)
			console.log("Channel already exists\n");// error: channel already exist
		else {
			const chan2 = this.channelRepo.create({ room_name: chan_name, owner: user, password: "" });
			chan2.members.push(user);
			this.channelRepo.save(chan2);
		}
		// any condition if there is password??
	}

	async add_chan_mem(user: User, chan_name: string) {
		// insert or create the user in the channel memeber table
		const chan = await this.chan_by_name(chan_name);
		if (chan) {
			chan.members.push(user);
			await this.channelRepo.save(chan);
		}
	}

	async add_chan_admin(user: User, chan_name: string) {
		// insert or create the user in the channel memeber table
		const chan = await this.chan_by_name(chan_name);
		if (chan) {
			chan.admins.push(user);
			await this.channelRepo.save(chan);
		}
	}

	// leave channel
	async rm_chan_mem(user: User, chan_name: string) {
		const userIdToRemove = user.id;
		const chan = await this.chan_by_name(chan_name);
		if (chan) {
			chan.members = chan.members.filter(member => member.id !== userIdToRemove); // Remove the user
			await this.channelRepo.save(chan);
		}
	}

	async save_dm(sender: User, reciever: User){
		const message = await this.messageRepo.findOne({where: {senderId: sender.id, recipientID: reciever.id}})
		// if (message)
			// message.content.
	}

	async save_chan_message(sender: User, reciever: Channel){

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
		// user = this.repo.findOneBy({user_name});
		// if (user)
		// 	return true
		// else
		// 	return false;
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
}
// -------------------------------------------------------------------------------
