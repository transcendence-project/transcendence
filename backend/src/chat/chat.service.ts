import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { channel } from 'diagnostics_channel';
import * as request from 'supertest';

@Injectable()
export class ChatService {
	 // -  have to inject database/repo -
	 constructor(/* Inject repo */){}

	// view all channels
	async get_all_chan(){
			// return <Array>? of all channels from repo
		}

	// view all channel members
	async mem_by_chan(chan_name: string){
		// retrun <Array>? of memebers of the given channel
	}

	// get channel by name
	async chan_exist(chan_name: string)
	{
		// chan = <repo>.findOneBy({chan_name});
		// if (chan)
		// 	return true;
		// else
		// 	return false;
	}
	// join channel
	async add_chan_mem(user: User)
	{
		// insert or create the user in the channel memeber table
	}

	// leave channel
	async rm_chan_mem(userName: string, chan_name: string)
	{
		// const user = await this.<repo>.findOne({userName});
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
	async add_chan(chan_name: string)
	{
		// this.<repo>.create (chan_name: string); // and other specifications if any
	}

	// if_admin
	async is_admin(user_name: string, chan_name: string)
	{
		// user = // find user from repo admin table
		// if (user)
		// 	return true;
		// else
		// 	return false;
	}
	// if_owner
	async is_owner(user_name: string, chan_name: string)
	{
		// user = // find user from repo owner table
		// if (user)
		// 	return true;
		// else
		// 	return false;
	}
	async is_chan_mem(user_name: string, chan_name: string)
	{
		// user = this.repo.findOneBy({user_name});
		// if (user)
		// 	return true
		// else
		// 	return false;
	}

	// SPECIFIC TO OWNERS
	// set channel password
	async set_pass(chan_name: string, pass: string)
	{

			// change password of the channel (from repo or local storage?)
		
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
			// add user to the mute table??
	}
}
