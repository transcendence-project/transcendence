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
	
	constructor(private chatService: ChatService, private websocketService: WebsocketService,
		/* , @InjectRepository(Channel) private roomRepo: Repository<Channel> */) { }
	@WebSocketServer()
	server: Server;

	handleConnection(client: any, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
		this.websocketService.set_user(client);
		// rejoin rooms already part of ??
	}

	handleDisconnect(client: any) {
		this.websocketService.delete_user(client);
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('send_message_to_chan')
	send_message_chan(client: any, payload: any): void {
		const { room_name, message } = payload;
		this.server.to(room_name).emit('room_message', { message, sender: client.id });
		// save the message in the database
	}

	@SubscribeMessage('private_messgae')
	send_message_dm(client: any, payload: any): void {
		const { username, message } = payload;
		const reciever_id = this.websocketService.find_id(username);
		this.server.to(reciever_id).emit('priv_message', { message, sender: client.id });
		// save the message in the database
	}

	@SubscribeMessage('create_room')
	async create_room(client: any, room_name: string): Promise<void> {

		const user = await this.websocketService.find_user(client);
		await this.chatService.create_chan(room_name, user);
		// join the room ?
	}

	@SubscribeMessage('join_room')
	join_room(client: any, room_name: string): void {
		const user = this.websocketService.find_user(client.id);
		if (this.websocketService.allowed_to_join(user, room_name, "")) // "" = the args such as password, invite etc.
		{
			this.chatService.add_chan_mem(user, room_name);
			client.join(room_name);
			// send successfully joined message to user
		}
	}

	@SubscribeMessage('leave_room')
	leave_room(client: any, room_name: string): void {
		const user = this.websocketService.find_user(client);
		this.chatService.rm_chan_mem(user, room_name);
		client.leave(room_name);
	}

	@SubscribeMessage('mute_user')
	mute_user(client: any, room_name: string): void {
		//
	}

}

// ----------------------------------------------------------

// IN FRONT END (to test)

// const socket = new WebSocket('ws://localhost:8080', 'custom data or authentication codes');
// socket.emit('join_room', 'room_name');

// // Send a message to a specific room
// const message = {
//   room: 'test_room',
//   content: 'Hello, test room!',
// };
// socket.emit('send_message', message);

// ----------------------------------------------------------

// @WebSocketGateway():
// @WebSocketServer():
// @SubscribeMessage(event: string)
// @MessageBody():
// @ConnectedSocket():
