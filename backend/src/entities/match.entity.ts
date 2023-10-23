import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Match {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, user => user.matches)
	user: User

	@Column()
	score: string

	@Column()
	opponentID: number

	@Column()
	winnerID: number
}