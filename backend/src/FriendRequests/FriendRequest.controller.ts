import { Controller, Param, Patch, Post } from "@nestjs/common";
import { FriendRequestService } from "./FriendRequests.service";
import { FriendRequest } from "entities/friend-request.entity";

@Controller('friend-requests')
export class FriendRequestController {
	constructor(private friendRequestService: FriendRequestService) {}

	@Post()
	async sendFriendRequest(senderId: number, receiverId: number): Promise<FriendRequest> {
		return await this.friendRequestService.sendFriendRequest(senderId, receiverId);
	}

	@Patch('/:id/accept')
	async acceptRequest(@Param("id") requestId: number): Promise<FriendRequest> {
		return await this.friendRequestService.acceptRequest(requestId);
	}

	@Patch('/:id/reject')
	async rejectRequest(@Param("id") requestId: number): Promise<FriendRequest> {
		return await this.friendRequestService.rejectRequest(requestId);
	}
}