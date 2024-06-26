import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendRequest } from "entities/friend-request.entity";
import { Repository } from "typeorm";
import { UsersService } from "users/users.service";
import { ChatService } from "chat/chat.service";
import { User } from "entities/user.entity";

@Injectable()
export class FriendRequestService {
	constructor(@InjectRepository(FriendRequest) private friendRequestRepository: Repository<FriendRequest>,
				private userService: UsersService, 	private chatService: ChatService,) {}

	async sendFriendRequest(senderId: number, receiverId: number): Promise<FriendRequest> {
		// console.log("senderId: " + senderId);
		// console.log("receiverId: " + receiverId);
		if (senderId == receiverId) {
			throw new NotFoundException("Cannot send friend request to yourself");
		}
		if (await this.userService.isFriend(senderId, receiverId)) {
			throw new NotFoundException("Users are already friends");
		}
		// check if request already exists
		const request = await this.friendRequestRepository.findOne({where: {sender: {id: senderId}, receiver: {id: receiverId}}});
		if (request) {
			throw new NotFoundException("Friend request already exists");
		}
		const friendRequest = this.friendRequestRepository.create({
			sender: await this.userService.findOne(senderId),
			receiver: await this.userService.findOne(receiverId),
			status: 'PENDING'
		});
		return await this.friendRequestRepository.save(friendRequest);
	}

    async acceptRequest(requestId: number): Promise<User>{
		const request = await this.friendRequestRepository.findOne({where: {id: requestId},
		relations: ['sender', 'receiver']});
		if (!request) {
			throw new NotFoundException("Request not found");
		}
		
		// add sender to receiver's friends
		// console.log("in acceptRequest")
		await this.userService.addFriend(request.sender.id, request.receiver);
		await this.userService.addFriend(request.receiver.id, request.sender);
		await this.chatService.create_friend_chan(request.sender, request.receiver);
		this.friendRequestRepository.delete(requestId);
		return request.receiver;
    }

	async rejectRequest(requestId: number) {
		return await this.friendRequestRepository.delete(requestId);
	}

async getFriendRequests(userId: number): Promise<FriendRequest[]> {
    const friendRequests = await this.friendRequestRepository.find({
        where: { receiver: { id: userId }, status: 'PENDING' },
        relations: ['sender', 'receiver']
    });
    return friendRequests;
}


	async getSentRequests(userId: number): Promise<FriendRequest[]> {
		return await this.friendRequestRepository.find({where: {sender: {id: userId}, status: 'PENDING'}});
	}
}