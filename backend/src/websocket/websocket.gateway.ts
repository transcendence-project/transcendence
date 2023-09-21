import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway()
export class WebsocketGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send_message')
  send_message(client: any, payload: any): void {
	const {room, message} = payload;
	this.server.to(room).emit('messageReceived', { message, sender: client.id });
	// save it in the database
    // return 'Hello world!';
  }

  @SubscribeMessage('join_room')
  join_room(client: any, room_name: string): void {
	// To get the list of rooms the client is currently in
	const rooms = Object.keys(client.rooms);
	if (!rooms.includes(room_name)) {
		// Join the old room
		client.join(room_name);
	  }
  }

  @SubscribeMessage('leave_room')
  leave_room(client: any, room_name: string) : void{ // client can be User later
    client.leave(room_name);
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
