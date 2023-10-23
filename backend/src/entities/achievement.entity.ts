import { Entity, PrimaryGeneratedColumn, Column, ManyToMany} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class  Achievement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

	@ManyToMany(() => User, user => user.achievements)
	users: User[];
    // maybe add more properties here
}
