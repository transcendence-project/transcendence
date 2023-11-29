 import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "../chat/chat.service";
import * as bcrypt from 'bcrypt';
import { Channel } from "entities/channel.entity";
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: { origin: "http://localhost:8080" },
  namespace: "chat",
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
	private userService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage("message")
  handleMessage(client: any, payload: any): string {
    return "Hello world!";
  }

  // ----------------------------------- CONNECTION ---------------------------------

	async handleConnection(client: Socket) { // called automatically when frontend establish websocket connection
		console.log(`Client connected in chat: ${client.id}`);
		await this.chatService.set_user(client);
		const user = this.chatService.find_user_with_id(client.id);
		if (user.channels)
			for (const channel of user.channels)
				client.join(channel.room_name);
	}

	handleDisconnect(client: any) {
		this.chatService.delete_user(client);
		console.log(`Client disconnected: ${client.id}`);
		//  remove from connected_users
		client.emit('disconnection_success');
	}

	// ----------------------------------- MESSAGE ---------------------------------

	@SubscribeMessage('send_msg_to_chan')
	async send_message_chan(client: any, payload: any) {
		const user = this.chatService.find_user_with_id(client.id);
		const { room_name, message } = payload;
		// this.server.to(room_name).emit('room_message', { message, sender: client.id });
		// console.log(user.userName);
		const chan = await this.chatService.chan_by_name(room_name);
		console.log('the chan is in send: ', chan);
		if (await this.chatService.is_mute(user.userName, room_name) === false)
		{
			await this.chatService.save_chan_message(user, room_name, message);
			const data_to_send = {
				content: message,
				user: user.userName,
				chan: room_name,	
			};
			this.server.emit('update_chan_message', data_to_send);
		}
		else
			client.emit('mute_message');
	}

	// @SubscribeMessage('private_message')
	// send_message_dm(client: any, payload: any): void {
	// 	const { username, message } = payload;
	// 	const user = this.chatService.find_user_with_id(client.id);
	// 	const reciever = this.chatService.find_user_with_id(username);
	// 	// check if user and reciever are friends, if no, error mesage
	// 	const dm_name = this.chatService.find_priv_msg_room(reciever, user);
	// 	if (dm_name) {
	// 		this.server.to(this.chatService.find_id(username)).emit('priv_message', { message, sender: client.id });
	// 		this.chatService.set_direct_msg(reciever, user, dm_name, message);
	// 	}
	// 	else {
	// 		const new_dm_name = user.userName + "_" + reciever.userName;
	// 		this.chatService.set_direct_msg(reciever, user, new_dm_name, message);
	// 	}
	// 	client.emit('priv_msg_success');
	// }

// ----------------------------------- CREATE CHANNEL ---------------------------------

@SubscribeMessage('create_pub_room')
	async create_pub_room(client: any, payload: any): Promise<void> {

		console.log("reached create pub room - backend websockets");
		const { channel_name, password } = payload;
		const user = this.chatService.find_user_with_id(client.id);
		const chan = await this.chatService.create_chan(channel_name, user, password, "pub", client);
		if (chan) {
			client.join(channel_name);
			const data_to_send = {
				chan_name: channel_name,
				isPublic: true,
				isPrivate: false,
				isProtected: false,
				user: user.userName,
				id: chan.id,
				severity: "success",
				summary: "Channel Created",
				detail: `Public Channel ${channel_name} created successfully.`

			};
			client.emit('create_room_success', data_to_send);
			client.emit('notify', data_to_send);
			this.server.emit('update_chan_list', data_to_send);
		}
	}

	@SubscribeMessage('create_prot_room')
	async create_prot_room(client: any, payload: any): Promise<void> {
		const { channel_name, password } = payload;
		if (password.length > 20)
		{
			const data_to_send = {
				severity: "error",
				summary: "Cannot Create Channel",
				detail: `Password too long.`
			}
			client.emit('notify', data_to_send);
		}
		const user = this.chatService.find_user_with_id(client.id);
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const chan = await this.chatService.create_chan(channel_name, user, hashedPassword, "prot", client);
		if (chan) {
			client.join(channel_name);
			const data_to_send = {
				chan_name: channel_name,
				isPublic: false,
				isPrivate: false,
				isProtected: true,
				user: user.userName,
				id: chan.id,
				severity: "success",
				summary: "Channel Created",
				detail: `Protected Channel ${channel_name} created successfully.`
			};
			client.emit('create_room_success', data_to_send);
			client.emit('notify', data_to_send);
			this.server.emit('update_chan_list', data_to_send);
		}
		else
		{
			const data_to_send = {
				severity: "error",
				summary: "Cannot Create Channel",
				detail: `Channel ${channel_name} already exists.`
			}
			client.emit('notify', data_to_send);
		}
	}

	@SubscribeMessage('create_priv_room')
	async create_priv_room(client: any, chan_name: string): Promise<void> {
		const user = this.chatService.find_user_with_id(client.id);
		const chan = await this.chatService.create_chan(chan_name, user, "", "priv", client);
		if (chan) {
			client.join(chan_name);
			const data_to_send = {
				chan_name: chan_name,
				isPublic: false,
				isPrivate: true,
				isProtected: false,
				user: user.userName,
				id: chan.id,
				severity: "success",
				summary: "Channel Created",
				detail: `Private Channel ${chan_name} created successfully.`
			};
			client.emit('create_room_success', data_to_send);
			client.emit('notify', data_to_send);
		}
		else
		{
			const data_to_send = {
				severity: "error",
				summary: "Cannot Create Channel",
				detail: `Channel ${chan_name} already exists.`
			}
			client.emit('notify', data_to_send);
		}
	}

	// ----------------------------------- JOIN / LEAVE ---------------------------------
	@SubscribeMessage('join_room')
	async join_room(client: any, payload: any) {
		const reason = "";
		const { room_name, arg } = payload;
		const user = this.chatService.find_user_with_id(client.id);
		const room = await this.chatService.chan_by_name(room_name);
		if (await this.chatService.can_join(user, room, arg, client)) {
			this.chatService.add_chan_mem(user, room_name);
			client.join(room_name);
			if (room.is_protected === true) {
				const data_to_send = {
					chan_name: room_name,
					isPublic: false,
					isPrivate: false,
					isProtected: true,
					user: user.userName,
					id: room.id,
					severity: "success",
					summary: "Joined Channe",
					detail: `Joined Channel ${room_name} successfully.`
				};
				client.emit('join_room_success', data_to_send);
				client.emit('notify', data_to_send);
				this.server.emit('update_mem_list', data_to_send);
			}
			else if(room.is_public === true) {
				const data_to_send = {
					chan_name: room_name,
					isPublic: true,
					isPrivate: false,
					isProtected: false,
					user: user.userName,
					id: room.id,
					severity: "success",
					summary: "Joined Channe",
					detail: `Joined Channel ${room_name} successfully.`
				};
				client.emit('join_room_success', data_to_send);
				client.emit('notify', data_to_send);
				this.server.emit('update_mem_list', data_to_send);
			}
			else if (room.is_private === true) {
				const data_to_send = {
					chan_name: room_name,
					isPublic: false,
					isPrivate: true,
					isProtected: false,
					user: user.userName,
					id: room.id,
					severity: "success",
					summary: "Joined Channe",
					detail: `Joined Channel ${room_name} successfully.`
				};
				client.emit('join_room_success', data_to_send);
				client.emit('notify', data_to_send);
				this.server.emit('update_mem_list', data_to_send);
			}
		}
	}

	@SubscribeMessage('add_user_to_priv')
	add_priv_user(client: any, payload: any) {
		const { user_to_add, room_name } = payload;
		const user = this.chatService.find_user_with_id(client.id);
		if (this.chatService.is_admin(user.userName, room_name) || this.chatService.is_owner(user.userName, room_name)) {
			const add_user = this.chatService.find_user_with_name(user_to_add);
			if (add_user)
			{
				const user_id = this.chatService.find_id(add_user.userName);
				console.log(user_id);
				this.server.to(user_id).emit('join_priv_room', room_name);
			}
			else
			{
				const data_to_send = {
					severity: "error",
					summary: "Cannot Add Member",
					detail: `User ${user_to_add} does not exist.`
				}
				client.emit('notify', data_to_send);
			}
		}
		else{
			const data_to_send = {
				severity: "error",
				summary: "Action Restricted",
				detail: `You are not an owner or an admin of the channel ${room_name}.`
			}
			client.emit('notify', data_to_send);
		}
	}

	@SubscribeMessage('leave_chan')
	async leave_room(client: any, room_name: string) {
		console.log('reached leave room in backend');
		const user = this.chatService.find_user_with_id(client.id);
		await this.chatService.rem_chan_mem(user, room_name);
		client.leave(room_name);
		const data_to_send = {
			chan_name: room_name,
			user: user.userName,
			severity: "info",
			summary: "Leave Channel",
			detail: `You Left the channel ${room_name}.`
		};
		this.server.to(room_name).emit('leave_room_update', data_to_send);
		client.emit('notify', data_to_send);
		client.emit('leave_room_success', room_name);
	}

	// ----------------------------------- ACTIONS ---------------------------------

	@SubscribeMessage('set_admin')
	async set_admin(client: any, payload: any) {
		const { admin_to_add, room_name } = payload;
		const user = this.chatService.find_user_with_id(client.id);
		if (await this.chatService.is_admin(user.userName, room_name) || await this.chatService.is_owner(user.userName, room_name)) {
			await this.chatService.add_chan_admin(admin_to_add, room_name);
			const data_to_send = {
				chan_name: room_name,
				admin: admin_to_add,
			};
			this.server.emit('update_admin', data_to_send);
			this.server.to(room_name).emit('update_admin', data_to_send)
		}
		else{
			const data_to_send = {
				severity: "error",
				summary: "Action Restricted",
				detail: `You are not an owner or an admin of the channel ${room_name}.`
			}
			client.emit('notify', data_to_send);
		}
	}

	@SubscribeMessage('mute_user')
	async mute_user(client: any, payload: any): Promise<void> {
		const { user_to_mute, room_name } = payload;
		const user = this.chatService.find_user_with_id(client.id); // the one who id muting the other person
		const user1 = this.chatService.find_user_with_name(user_to_mute); // the one being muted
		const id_to_mute = this.chatService.find_id(user1.userName); // id of the one being muted // the channel
		if (await this.chatService.is_admin(user.userName, room_name) || await this.chatService.is_owner(user.userName, room_name)) {
			await this.chatService.add_chan_mute(user1, room_name); // add the mute to the channel
			this.server.to(id_to_mute).emit('muted', user1.userName);
			console.log("client muted");
			setTimeout(async () => {
				await this.chatService.rem_chan_mute(user1, room_name);
				this.server.to(id_to_mute).emit('unmuted', user1.userName);
			}, 300000);
			console.log("client muted");
		}
		else{
			client.emit('not_admin');
		}
	}

	@SubscribeMessage('kick_user')
	async kick_user(client: any, payload: any) {
		const { user_to_rem, room_name } = payload;
		const user = this.chatService.find_user_with_id(client.id);
		const user1 = this.chatService.find_user_with_name(user_to_rem);
		const id_to_rem = this.chatService.find_id(user1.userName);
		if (await this.chatService.is_admin(user.userName, room_name) || await this.chatService.is_owner(user.userName, room_name)) {
			await this.chatService.rem_chan_mem(user1, room_name)
			const data_to_send = {
				chan_name: room_name,
				user: user1.userName,
				severity: "info",
				summary: "Kicked from Channel",
				detail: `You have been kicked from the channel ${room_name}.`
			};
			this.server.to(room_name).emit('leave_room_update', data_to_send);
			this.server.to(id_to_rem).emit('kicked', room_name);
			this.server.to(id_to_rem).emit('notify', data_to_send);
		}
		else{
			const data_to_send = {
				severity: "error",
				summary: "Action Restricted",
				detail: `You are not an owner or an admin of the channel ${room_name}.`
			}
			client.emit('notify', data_to_send);
		}

	}

	@SubscribeMessage('ban_user')
	async ban_user(client: any, payload: any) {
		const { user_to_ban, room_name } = payload;
		const user = this.chatService.find_user_with_id(client.id);
		const user1 = this.chatService.find_user_with_name(user_to_ban);
		const id_to_rem = this.chatService.find_id(user1.userName);
		if (await this.chatService.is_admin(user.userName, room_name) || await this.chatService.is_owner(user.userName, room_name)) {
			await this.chatService.rem_chan_mem(user1, room_name);
			await this.chatService.add_chan_ban(user1, room_name);
			const data_to_send = {
				chan_name: room_name,
				user: user1.userName,
				severity: "info",
				summary: "Banned from Channel",
				detail: `You have been banned from the channel ${room_name}.`
			};
			this.server.to(room_name).emit('leave_room_update', data_to_send);
			this.server.to(id_to_rem).emit('kicked', room_name);
			this.server.to(id_to_rem).emit('notify', data_to_send);
		}
		else{
			const data_to_send = {
				severity: "error",
				summary: "Action Restricted",
				detail: `You are not an owner or an admin of the channel ${room_name}.`
			}
			client.emit('notify', data_to_send);
		}
	}

	@SubscribeMessage('change_pass')
	async change_pass(client: any, payload: any ) {
		const { new_pass, room_name } = payload;
		const user = this.chatService.find_user_with_id(client.id);
		if (new_pass.length > 20 || new_pass == "" || !new_pass){
			if (new_pass.length > 20){
				const data_to_send = {
					severity: "error",
					summary: "Cannot Create Channel",
					detail: `Password too long.`
				}
				client.emit('notify', data_to_send);
			}
			else
			{
				const data_to_send = {
					severity: "error",
					summary: "Cannot Create Channel",
					detail: `Password cannot be empty.`
				}
				client.emit('notify', data_to_send);

			}
			return null;
		}
		if (await this.chatService.is_admin(user.userName, room_name) || await this.chatService.is_owner(user.userName, room_name)) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(new_pass, salt);
			this.chatService.change_chan_pass(room_name, hashedPassword);
			const data_to_send = {
				severity: "success",
				summary: "Password Changed",
				detail: `Password of the channel ${room_name} was changed successfully.`
			}
			client.emit('notify', data_to_send);
		}
		else{
			const data_to_send = {
				severity: "error",
				summary: "Action Restricted",
				detail: `You are not an owner or an admin of the channel ${room_name}.`
			}
			client.emit('notify', data_to_send);
		}
	}

	@SubscribeMessage('block_frnd')
	async block_frnd(client: any, friend: string) {
		const user = this.chatService.find_user_with_id(client.id);
		// const user_frnds = await this.userService.getFriends(user.id);
		this.userService.add_blocked(friend, user.userName);
		const data_to_send = {
			severity: "info",
			summary: "Friend Blocked",
			detail: `You blocked ${friend}.`
		}
		client.emit('notify', data_to_send);
	}

	@SubscribeMessage('unblock_frnd')
	async unblock_frnd(client: any, friend: string) {
		const user = this.chatService.find_user_with_id(client.id);
		this.userService.rem_blocked(friend, user.userName);
		const data_to_send = {
			severity: "info",
			summary: "Friend Unblocked",
			detail: `You unblocked ${friend}.`
		}
		client.emit('notify', data_to_send);
	}

	@SubscribeMessage('rem_admin')
	rem_admin(client: any, payload) {
		const { admin_to_rem, room_name } = payload;
		const user = this.chatService.find_user_with_id(client.id);
		if (this.chatService.is_admin(user.userName, room_name) || this.chatService.is_owner(user.userName, room_name)) {
			this.chatService.rem_chan_admin(admin_to_rem, room_name);
			// send to admin_to_add that they are an admin
		}
		// else
		// send to user that they are not an admin or owner
	}

}
