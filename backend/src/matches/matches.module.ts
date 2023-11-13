import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../entities/match.entity';
import { MatchesService } from './matches.service';
import { MatchController } from './matches.controller';
import { UsersModule } from 'users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), UsersModule],
  controllers: [MatchController],
  providers: [MatchesService],
  exports: [MatchesService]
})
export class MatchModule {}
