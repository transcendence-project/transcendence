import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Channel } from './channel.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
	 // -  have to inject database/repo -
	 constructor(@InjectRepository(Channel) private channelRepo: Repository<Channel> ){}

	// view all channels
	async get_all_chan(){
		return this.channelRepo.find();
	}

	// view all channel members
	async mem_by_chan(chan_name: string){
		
	}

	// get channel by name
	async chan_exist(chan_name: string)
	{
		const chan = this.channelRepo.findOneBy({chan_name});
		if (chan)
			return true;
		else
			return false;
	}
	// join channel
	async add_chan_mem(user: User)
	{
		// insert or create the user in the channel memeber table
	}

	// leave channel
	async rm_chan_mem(userName: string, chan_name: string)
	{
		// const user = await this.channelRepo.findOne({mem}); from the memebers table of the cahnnel table
		// if (user)
		// return (this.<repo>.delete(userName))
	}

	// message channel
	msg_chan(sender: string, chan_name: string)
	{

	}

	// message individual user
	msg_user(sender: string, reciever: string)
	{
		
	}

	// create channel
	async add_chan(req_user: string, chan_name: string)
	{
		// this.channelRepo.create(); // and other specifications if any
		// add to admin tabel, 
		// add to owner table
		// add to channel tabel, 
		// add to member tabe
	}

	// if_admin
	async is_admin(user_name: string, chan_name: string)
	{
		const user = this.channelRepo.findOneBy({/* user_name */}); // from the admin table/array
		if (user)
			return true;
		else
			return false;
	}
	// if_owner
	async is_owner(user_name: string, chan_name: string)
	{
		const user =  this.channelRepo.findOneBy({/* user_name */}); // from the owner table/array
		if (user)
			return true;
		else
			return false;
	}
	async is_chan_mem(user_name: string, chan_name: string)
	{
		// user = this.repo.findOneBy({user_name});
		// if (user)
		// 	return true
		// else
		// 	return false;
	}

	async is_ban(user_name: string, chan_name: string)
	{
		// if in banned table of repo
		// return true
		// else
			// return false;
	}

	async is_mute(user_name: string, chan_name: string)
	{
		// if in mute table of repo
		// return true
		// else
			// return false;
	}

	// SPECIFIC TO OWNERS
	// set channel password
	async set_pass(chan_name: string, pass: string)
	{
		// update password of the channel (from repo or local storage?)
	}

	// set admin
	async set_admin(req_user: string, chan_name: string, user_name: string)
	{
			// update user as admin 
	}

	// SPECIFIC TO OWNERS/ADMINISTRATORS
	// kick user
	async kick_user(user_to_kick: string, chan_name: string)
	{
			// rm chan_mem
	}
	// ban user
	async ban_user(user_to_ban: string, chan_name: string)
	{
			// add user to the banned table of the 
	}
	// mute user
	async mute_user(req_user: string, user_to_mute: string, chan_name: string)
	{
		// if (this.is_owner(req_user) || this.is_admin(req_user))
			// add user to the mute table?
	}
	async unmute_user(req_user: string, user_to_mute: string, chan_name: string)
	{
		// if (this.is_owner(req_user) || this.is_admin(req_user))
			// delete user to the mute table?
	}
}
