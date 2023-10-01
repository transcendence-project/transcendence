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

	// method for client connection
	handleConnection(client: any, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
		this.websocketService.set_user(client); // client should have user entity
	}

	// method for client disconnection
	handleDisconnect(client: any) {
		this.websocketService.delete_user(client);
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('send_message')
	send_message(client: any, payload: any): void {
		const { room, message } = payload;
		// this.server.to(room).emit(/* event or message to send back to the sender*/, { message, sender: client.id });
		// save the message in the database
	}

	@SubscribeMessage('create_room')
	async create_room(client: any, room_name: string): Promise<void> {

		const user = await this.websocketService.find_user(client);
		// have to change user as User??
		await this.chatService.create_chan(room_name, user);
		// join the room ?
	}

	@SubscribeMessage('join_room')
	join_room(client: any, room_name: string): void {
		// To get the list of rooms the client is currently in
		const rooms = Object.keys(client.rooms);
		// check if they are part of the room (if channel) from the databse, if yes
		if (!rooms.includes(room_name)) {
			// check if the channel is invite only, if yes
			client.join(room_name);
			// 
			// else
			// channel is invite only
			// (will private rooms appear for the user if they are a part of it?)
		}
		//   else
		// already part of the channel or room  / alread joined the room
	}

	@SubscribeMessage('leave_room')
	leave_room(client: any, room_name: string): void { // client can be User later
		const rooms = Object.keys(client.rooms);
		if (!rooms.includes(room_name)) {
			client.leave(room_name);
		}
		// else
		//   not part of the channel
	}

	@SubscribeMessage('mute_user')
	mute_user(client: any, room_name: string): void {
		//
	}

	// chat history retrieval
	// user status - online or offline

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
