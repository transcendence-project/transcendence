import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Channel } from "./channel.entity";;


@Entity()
export class Message {

	@PrimaryGeneratedColumn()
	id: number

	@Column()
	senderID: number

	@Column()
	sendername: string

	@ManyToOne(() => User)
	sender: User

	@ManyToOne(() => Channel, channel	=> channel.messages)
	channel: Channel

	@Column()
	content: string

	@Column({nullable: true})
	createdAt: Date

}