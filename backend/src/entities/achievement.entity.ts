import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Achievement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

	@ManyToOne(() => User, user => user.achievements)
	users: User;
    // maybe add more properties here
}
