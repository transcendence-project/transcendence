import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from '../entities/achievement.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
  ) {}

  async onModuleInit() {
    await this.seedAchievements();
  }

  private async seedAchievements() {
    const achievements = [
      { title: 'First Match' },
      { title: 'First Win' },
      { title: 'Played 3 Matches' },
    ];

    for (const achievementData of achievements) {
      const existingAchievement = await this.achievementRepository.findOne({ 
		where: { title: achievementData.title }
      });

      if (!existingAchievement) {
        const achievement = this.achievementRepository.create(achievementData);
        await this.achievementRepository.save(achievement);
      }
    }
  }

  async getAchievementByTitle(title: string): Promise<Achievement> {
	return await this.achievementRepository.findOne({ where: { title } });
  }

  async getAchievements(): Promise<Achievement[]> {
	return await this.achievementRepository.find();
  }
}
