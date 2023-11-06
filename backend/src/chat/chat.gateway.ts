import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';

@WebSocketGateway({cors:{origin:'http://localhost:8080'},  namespace: 'chat'})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private chatService: ChatService,
		/* , @InjectRepository(Channel) private roomRepo: Repository<Channel> */) { }
	@WebSocketServer()
	server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  async handleConnection(client: Socket) { // called automatically when frontend establish websocket connection
	console.log(`Client connected in chat: ${client.id}`);
	await this.chatService.set_user(client); // after login page fix
	const user = this.chatService.find_user_with_id(client.id);
	// console.log(user);
	// if (user.channels)
	// 	for (const channel of user.channels) // rejoin
	// 		client.join(channel.room_name);
	// 	client.emit('connection_success');
	// In case of error
	/*  client.on('error', (error) => { // to handle websocket errors
		client.emit('connection_failure');
	});*/
}

handleDisconnect(client: any) {
	this.chatService.delete_user(client);
	this.chatService.rem_user_invites(client);
	console.log(`Client disconnected: ${client.id}`);
	//  remove from connected_users
	client.emit('disconnection_success');
}

@SubscribeMessage('send_msg_to_chan')
send_message_chan(client: any, payload: any): void {
	const user = this.chatService.find_user_with_id(client.id);
	const { room_name, message } = payload;
	this.server.to(room_name).emit('room_message', { message, sender: client.id });
	this.chatService.save_chan_message(user, room_name, message);
	// save the message in the database
	client.emit('chan_msg_success');
}

@SubscribeMessage('private_message')
send_message_dm(client: any, payload: any): void {
	const { username, message } = payload;
	const user = this.chatService.find_user_with_id(client.id);
	const reciever = this.chatService.find_user_with_id(username);
	// check if user and reciever are friends, if no, error mesage
	const dm_name = this.chatService.find_priv_msg_room(reciever, user);
	if (dm_name)
	{
		this.server.to(this.chatService.find_id(username)).emit('priv_message', { message, sender: client.id });
		this.chatService.set_direct_msg(reciever, user, dm_name, message);
	}
	else{
		const new_dm_name = user.userName + "_" + reciever.userName;
		this.chatService.set_direct_msg(reciever, user, new_dm_name, message);
	}
	client.emit('priv_msg_success');
}

@SubscribeMessage('create_prot_room')
async create_prot_room(client: any, payload: any): Promise<void> {

	console.log("reached create prot room - backend websockets");
	const { channel_name, password } = payload;
	console.log(`channel name in backend: ${channel_name}`);
	console.log(`password in backend: ${password}`);
	const user = this.chatService.find_user_with_id(client.id);
	const chan = await this.chatService.create_chan(channel_name, user, password);
	client.join(channel_name);
	if (chan){
		const data_to_send = {
			chan_name: channel_name,
			state: 'protected',
			user: user.userName,
			id: chan.id,
			pass: password, 
		};
		client.emit('create_room_success', data_to_send);
	}
	else
		client.emit('create_room_success');
}

@SubscribeMessage('create_pub_room')
async create_pub_room(client: any, payload: any): Promise<void> {
	
	console.log("reached create pub room - backend websockets");
	const { channel_name, password } = payload;
	console.log(`channel name in backend: ${channel_name}`);
	console.log(`password in backend: ${password}`);
	const user = this.chatService.find_user_with_id(client.id);
	const chan = await this.chatService.create_chan(channel_name, user, password);
	client.join(channel_name);
	if (chan){
		const data_to_send = {
			chan_name: channel_name,
			state: 'public',
			user: user.userName,
			id: chan.id,
			pass: password,
		};
		client.emit('create_room_success', data_to_send);
	}
	else
		client.emit('create_room_success');
}

@SubscribeMessage('join_room')
async join_room(client: any, payload: any) {
	const { room_name, arg } = payload; // args: password
	const user = this.chatService.find_user_with_id(client.id);
	const room = await this.chatService.chan_by_name(room_name);
;	if (this.chatService.can_join(user, room, arg))
	{
		this.chatService.add_chan_mem(user, room_name);
		client.join(room_name);
		client.emit('join_room_success');
	}
}

@SubscribeMessage('leave_room')
leave_room(client: any, room_name: string): void {
	const user = this.chatService.find_user_with_id(client.id);
	this.chatService.rm_chan_mem(user, room_name); // removing from databse
	client.leave(room_name);
	client.emit('leave_room_success');
}

@SubscribeMessage('mute_user')
mute_user(client: any, payload: any): void {

	const { user_to_mute, room_name } = payload;
	const user = this.chatService.find_user_with_id(client.id);
	// mute user
	// send to user_to_mute is mute
}

@SubscribeMessage('invite_to_game')
invite_user(client: any, invitee_: string): void {
	const inviter = this.chatService.find_user_with_id(client.id);
	const invitee = this.chatService.find_user_with_name(invitee_);
	this.chatService.invite_user_to_game(inviter, invitee);
	// send message to invitee that he has been invited
}

@SubscribeMessage('add_user_to_priv')
add_priv_user(client: any, payload: any){
	const { user_to_add, room_name } = payload;
	const user = this.chatService.find_user_with_id(client.id);
	if (this.chatService.is_admin(user.userName, room_name) || this.chatService.is_owner(user.userName, room_name))
	{
		const add_user = this.chatService.find_user_with_name(user_to_add);
		this.chatService.add_chan_mem(user, room_name);
		client.join(room_name);
		client.emit('add_user_success', );
	}
	//else
	// send error message to user: user not owner or admin
}

@SubscribeMessage('set_admin')
set_admin(client: any, payload: any)
{
	const { admin_to_add, room_name } = payload;
	const user = this.chatService.find_user_with_id(client.id);
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
	const user = this.chatService.find_user_with_id(client.id);
	if (this.chatService.is_admin(user.userName, room_name) || this.chatService.is_owner(user.userName, room_name))
	{
		this.chatService.rem_chan_admin(admin_to_rem, room_name);
		// send to admin_to_add that they are an admin
	}
	// else
		// send to user that they are not an admin or owner
}

}
