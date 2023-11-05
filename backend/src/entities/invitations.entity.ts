import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Invitation {

	@PrimaryGeneratedColumn()
	id: number;


	@Column({type: 'enum', enum: ['GAME', 'FRIEND']})
	type: 'GAME' | 'FRIEND';

	@Column()
	@ManyToOne(() => User, user => user.sentInvites)
	@JoinColumn({referencedColumnName: 'id'})
	sender: User;

	@Column()
	@ManyToOne(type => User, user => user.receivedInvites)
	@JoinColumn({referencedColumnName: 'id'})
	receiver: User;

	@Column()
	state: string;

	@Column()
	createdAt: Date;
}