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
import { MatchesService } from 'game/matches/matches.service';
import { Match } from 'entities/match.entity';
@Module({
	imports: [TypeOrmModule.forFeature([User, FriendRequest, Achievement, Match])],
	providers: [UsersService, FriendRequestService, SeederService, MatchesService],
	controllers: [UsersController, FriendRequestController],
	exports: [UsersService, SeederService]
})
export class UsersModule {}
