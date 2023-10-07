import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Channel } from "./channel.entity";;


@Entity()
export class Message {

	@PrimaryGeneratedColumn()
	id: number

	@Column()
	senderID: number

	@ManyToOne(() => User)
	sender: User

	@ManyToOne(() => Channel, channel	=> channel.messages)
	channel: Channel

	@Column()
	content: string

	@Column()
	createdAt: Date

}