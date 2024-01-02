import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Socket } from "dgram";

@Entity()
export class Match {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, user => user.matchesAsPlayerOne)
	playerOne: User

	@ManyToOne(() => User, user => user.matchesAsPlayerTwo)
	playerTwo: User

	@Column()
	winnerScore: number

	@Column()
	loserScore: number

	@Column()
	opponentID: number

	@Column()
	winnerID: number

    
}