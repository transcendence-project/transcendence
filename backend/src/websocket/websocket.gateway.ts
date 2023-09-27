import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatService } from '../chat/chat.service';
import { Channel } from 'chat/channel.entity';
import { Repository } from 'typeorm';

@WebSocketGateway()
export class WebsocketGateway {
  constructor(private chatService: ChatService /* @InjectRepository(Channel) private roomRepo: Repository<Channel> */) {}
  @WebSocketServer()
  server: Server;

  // method for client connection
  // method for client disconnection

  @SubscribeMessage('send_message')
  send_message(client: any, payload: any): void {
	const {room, message} = payload;
	// this.server.to(room).emit(/* event or message to send back to the sender*/, { message, sender: client.id });
	// save the message in the database
  }

  @SubscribeMessage('create_room')
  async create_room(client: any, room_name: string): Promise<void> {
	const new_room = new Channel(); //or with the create function like in users
    new_room.room_name = room_name;
	// save it in chat service repo by making channel repo in chatService public or
	// inject repository into gateway 
	// await this.roomRepo.save(new_room);
	// join the room??
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
  leave_room(client: any, room_name: string) : void{ // client can be User later
	const rooms = Object.keys(client.rooms);
	if (!rooms.includes(room_name)) {
			client.leave(room_name);
	  }
	// else
	//   not part of the channel
  }

  @SubscribeMessage('mute_user')
  mute_user(client: any, room_name: string) : void{
	//
	}

  
  // chat history retrieval
  // user status - online or offline
}

// ----------------------------------------------------------

// IN FRONT END (to test)

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
