import { Module, forwardRef } from '@nestjs/common';
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
// import { MatchesService } from 'matches/matches.service';
// import { Match } from 'entities/match.entity';
import { MatchModule } from 'matches/matches.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Module({
	imports: [TypeOrmModule.forFeature([User, FriendRequest, Achievement]), forwardRef(() => MatchModule), 
		MulterModule.register({
			storage: diskStorage({
				destination: (req, file, cb) => {
					console.log('in multer destination, file: ', file);
					cb(null, './uploads')},
				filename: (req, file, cb) => {
					console.log('in multer filename, file: ', file);
					cb(null, file.originalname);
				}
			}),
		})],
	providers: [UsersService, FriendRequestService, SeederService],
	controllers: [UsersController, FriendRequestController],
	exports: [UsersService, SeederService]
})
export class UsersModule {}
