import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { AuthModule } from 'auth/auth.module';
import { FriendRequestController } from 'friend-requests/FriendRequest.controller';
import { FriendRequestService } from 'friend-requests/FriendRequests.service';
import { FriendRequest } from 'entities/friend-request.entity';
import { Achievement } from 'entities/achievement.entity';
import { SeederService } from '../achievements/achievement.seed';
@Module({
	imports: [TypeOrmModule.forFeature([User, FriendRequest, Achievement])],
	providers: [UsersService, FriendRequestService, SeederService],
	controllers: [UsersController, FriendRequestController],
	exports: [UsersService, SeederService]
})
export class UsersModule {}
