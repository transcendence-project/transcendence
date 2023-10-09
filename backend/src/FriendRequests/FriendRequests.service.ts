import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendRequest } from "entities/friend-request.entity";
import { Repository } from "typeorm";

@Injectable()
export class FriendRequestService {
	constructor(@InjectRepository(FriendRequest) private friendRequestRepository: Repository<FriendRequest> ) {}

	async sendFriendRequest(senderId: number, receiverId: number): Promise<FriendRequest> {
		const friendRequest = this.friendRequestRepository.create({
			sender: { id: senderId },
			receiver: { id: receiverId }
		});
		return await this.friendRequestRepository.save(friendRequest);
	}

    async acceptRequest(requestId: number): Promise<FriendRequest> {
        await this.friendRequestRepository.update(requestId, { status: 'ACCEPTED' });
        return await this.friendRequestRepository.findOne({where: {id: requestId}});
    }

	async rejectRequest(requestId: number): Promise<FriendRequest> {
		await this.friendRequestRepository.update(requestId, { status: 'REJECTED' });
		return await this.friendRequestRepository.findOne({where: {id: requestId}});
	}

	async getFriendRequests(userId: number): Promise<FriendRequest[]> {
		return await this.friendRequestRepository.find({where: {receiver: {id: userId}, status: 'PENDING'}});
	}

	async getSentRequests(userId: number): Promise<FriendRequest[]> {
		return await this.friendRequestRepository.find({where: {sender: {id: userId}, status: 'PENDING'}});
	}
}