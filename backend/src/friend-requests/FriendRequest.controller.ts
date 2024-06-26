import { Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { FriendRequestService } from "./FriendRequests.service";
import { FriendRequest } from "entities/friend-request.entity";
import { JwtAuthGuard } from "auth/jwt.guard";
import { User } from "entities/user.entity";

@Controller('friend-requests')
export class FriendRequestController {
	constructor(private friendRequestService: FriendRequestService) {}

	@Post('/:receiverId')
	@UseGuards(JwtAuthGuard)
	async sendFriendRequest(@Param("receiverId") receiverID: number, @Req() req): Promise<FriendRequest> {
		return await this.friendRequestService.sendFriendRequest(req.user.id, receiverID);
	}

	@Patch('/accept/:id')
	@UseGuards(JwtAuthGuard)
	async acceptRequest(@Param("id") requestId: number): Promise<User> {
		return await this.friendRequestService.acceptRequest(requestId);
	}

	@Patch('/:id/reject')
	@UseGuards(JwtAuthGuard)
	async rejectRequest(@Param("id") requestId: number){
		this.friendRequestService.rejectRequest(requestId);
	}

	@Get('/my-friend-requests')
	@UseGuards(JwtAuthGuard)
	async getFriendRequest(@Req() req): Promise<FriendRequest[]> {
		return await this.friendRequestService.getFriendRequests(req.user.id);
	}
}