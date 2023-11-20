import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendRequest } from "entities/friend-request.entity";
import { Repository } from "typeorm";
import { UsersService } from "users/users.service";

@Injectable()
export class FriendRequestService {
	constructor(@InjectRepository(FriendRequest) private friendRequestRepository: Repository<FriendRequest>,
				private userService: UsersService) {}

	async sendFriendRequest(senderId: number, receiverId: number): Promise<FriendRequest> {
		const friendRequest = this.friendRequestRepository.create({
			sender: { id: senderId },
			receiver: { id: receiverId }
		});
		return await this.friendRequestRepository.save(friendRequest);
	}

    async acceptRequest(requestId: number){
		const request = await this.friendRequestRepository.findOne({where: {id: requestId},
		relations: ['sender', 'receiver']});
		if (!request) {
			throw new NotFoundException("Request not found");
		}
		
		// add sender to receiver's friends
		await this.userService.addFriend(request.sender.id, request.receiver);
		await this.userService.addFriend(request.receiver.id, request.sender);
		this.friendRequestRepository.delete(requestId);
    }

	async rejectRequest(requestId: number) {
		return await this.friendRequestRepository.delete(requestId);
	}

	async getFriendRequests(userId: number): Promise<FriendRequest[]> {
		return await this.friendRequestRepository.find({where: {receiver: {id: userId}, status: 'PENDING'}});
	}

	async getSentRequests(userId: number): Promise<FriendRequest[]> {
		return await this.friendRequestRepository.find({where: {sender: {id: userId}, status: 'PENDING'}});
	}
}