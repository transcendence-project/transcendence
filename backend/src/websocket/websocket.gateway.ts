// import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Server } from 'socket.io';
// import { InjectRepository } from '@nestjs/typeorm';
// // import { ChatService } from '../chat/chat.service';
// import { Channel } from 'chat/channel.entity';
// import { Repository } from 'typeorm';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { WebsocketService } from './websocket.service';

import { Channel } from '../entities/channel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
	
	constructor(private chatService: ChatService, private websocketService: WebsocketService
		/* , @InjectRepository(Channel) private roomRepo: Repository<Channel> */) { }
	@WebSocketServer()
	server: Server;

	handleConnection(client: any, ...args: any[]) { // called automatically when frontend establish websocket connection
		console.log(`Client connected: ${client.id}`);
		this.websocketService.set_user(client);
		const user = this.websocketService.find_user_with_id(client.id);
		for (const channel of user.channels) // rejoin
			client.join(channel.room_name);
			client.emit('connection_success'); // socket.addEventListener('message', .... )
		// In case of error
		/*  client.on('error', (error) => { // to handle websocket errors
			client.emit('connection_failure');
		});*/
	}

	handleDisconnect(client: any) {
		this.websocketService.delete_user(client);
		this.websocketService.rem_user_invites(client);
		console.log(`Client disconnected: ${client.id}`);
		client.emit('disconnection_success');
	}

	@SubscribeMessage('send_message_to_chan')
	send_message_chan(client: any, payload: any): void {
		const user = this.websocketService.find_user_with_id(client.id);
		const { room_name, message } = payload;
		this.server.to(room_name).emit('room_message', { message, sender: client.id });
		this.chatService.save_chan_message(user, room_name, message);
		// save the message in the database
		client.emit('chan_msg_success');
	}

	@SubscribeMessage('private_messgae')
	send_message_dm(client: any, payload: any): void {
		const { username, message } = payload;
		const user = this.websocketService.find_user_with_id(client.id);
		const reciever = this.websocketService.find_user_with_id(username);
		// check if user and reciever are friends, if no, error mesage
		const dm_name = this.websocketService.find_priv_msg_room(reciever, user);
		if (dm_name)
		{
			this.server.to(this.websocketService.find_id(username)).emit('priv_message', { message, sender: client.id });
			this.websocketService.set_direct_msg(reciever, user, dm_name, message);
		}
		else{
			const new_dm_name = user.userName + "_" + reciever.userName;
			this.websocketService.set_direct_msg(reciever, user, new_dm_name, message);
		}
		client.emit('priv_msg_success');
	}

	@SubscribeMessage('create_room')
	async create_room(client: any, room_name: string): Promise<void> {

		const user = this.websocketService.find_user_with_id(client.id);
		await this.chatService.create_chan(room_name, user);
		// set user as owner and admin
		client.join(room_name);
		client.emit('create_room_success');
	}

	@SubscribeMessage('join_room')
	async join_room(client: any, payload: any) {
		const { room_name, arg } = payload; // args: password
		const user = this.websocketService.find_user_with_id(client.id);
		const room = await this.chatService.chan_by_name(room_name);
	;	if (this.websocketService.can_join(user, room, arg))
		{
			this.chatService.add_chan_mem(user, room_name);
			client.join(room_name);
			client.emit('join_room_success');
		}
	}

	@SubscribeMessage('leave_room')
	leave_room(client: any, room_name: string): void {
		const user = this.websocketService.find_user_with_id(client.id);
		this.chatService.rm_chan_mem(user, room_name); // removing from databse
		client.leave(room_name);
		client.emit('leave_room_success');
	}

	@SubscribeMessage('mute_user')
	mute_user(client: any, payload: any): void {

		const { user_to_mute, room_name } = payload;
		const user = this.websocketService.find_user_with_id(client.id);
		// mute user
		// send to user_to_mute is mute
	}

	@SubscribeMessage('invite_to_game')
	invite_user(client: any, invitee_: string): void {
		const inviter = this.websocketService.find_user_with_id(client.id);
		const invitee = this.websocketService.find_user_with_name(invitee_);
		this.websocketService.invite_user_to_game(inviter, invitee);
		// send message to invitee that he has been invited
	}

	@SubscribeMessage('add_user_to_priv')
	add_priv_user(client: any, payload: any){
		const { user_to_add, room_name } = payload;
		const user = this.websocketService.find_user_with_id(client.id);
		if (this.chatService.is_admin(user.userName, room_name) || this.chatService.is_owner(user.userName, room_name))
		{
			const add_user = this.websocketService.find_user_with_name(user_to_add);
			this.chatService.add_chan_mem(user, room_name);
			client.join(room_name);
			client.emit('add_user_success');
		}
		//else
		// send error message to user: user not owner or admin
	}

	@SubscribeMessage('set_admin')
	set_admin(client: any, payload: any)
	{
		const { admin_to_add, room_name } = payload;
		const user = this.websocketService.find_user_with_id(client.id);
		if (this.chatService.is_admin(user.userName, room_name) || this.chatService.is_owner(user.userName, room_name))
		{
			this.chatService.add_chan_admin(admin_to_add, room_name);
			// send to admin_to_add that they are an admin
		}
		// else
			// send to user that they are not an admin or owner
	}

	@SubscribeMessage('rem_admin')
	rem_admin(client: any, payload)
	{
		const { admin_to_rem, room_name } = payload;
		const user = this.websocketService.find_user_with_id(client.id);
		if (this.chatService.is_admin(user.userName, room_name) || this.chatService.is_owner(user.userName, room_name))
		{
			this.chatService.rem_chan_admin(admin_to_rem, room_name);
			// send to admin_to_add that they are an admin
		}
		// else
			// send to user that they are not an admin or owner
	}

}

// // ----------------------------------------------------------

// // IN FRONT END (to test)

// const socket = new WebSocket('ws://localhost:3000', 'custom data or authentication codes');
// socket.send(JSON.stringify({ event: 'join_room', room_name: roomName })); // to join room

// socket.addEventListener('message', (event) => {
//   const data = JSON.parse(event.data);
//   if (data.event === 'join_room_success') {
//     // Update the UI to indicate successful room join
//   }
// });

// // ----------------------------------------------------------

// // @WebSocketGateway():
// // @WebSocketServer():
// // @SubscribeMessage(event: string)
// // @MessageBody():
// // @ConnectedSocket():
