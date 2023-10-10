import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { AuthModule } from 'auth/auth.module';
import { FriendRequestController } from 'friend-requests/FriendRequest.controller';
import { FriendRequestService } from 'friend-requests/FriendRequests.service';
import { FriendRequest } from 'entities/friend-request.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, FriendRequest])],
	providers: [UsersService, FriendRequestService],
	controllers: [UsersController, FriendRequestController],
	exports: [UsersService]
})
export class UsersModule {}
