import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
// import { Exclude } from "class-transformer";
import { Match } from "./match.entity";
import { Achievement } from "./achievement.entity";
// import { Friend } from "./friend.entity";
import { Channel } from "./channel.entity";


@Entity()
export class User {
	//@PrimaryGeneratedColumn() - to mark as the primary key
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	userName: string

	@Column()
	email: string
	
	@Column()
	is2FAEnabled: boolean

	@Column({ nullable: true })
	// @Exclude()
	twoFactorSecret: string

	@ManyToMany(() => User, user => user.friends)
	@JoinTable({
		name: "friends",
		joinColumn: {
			name: "user",
			referencedColumnName: "id"
		},
		inverseJoinColumn: {
			name: "friend",
			referencedColumnName: "id"
		}
	})
	friends: User[]

	@OneToMany(() => User, user => user.matches)
	matches: Match[]

	@OneToMany(() => User, user => user.achievements)
	achievements: Achievement[]

	@ManyToMany(() => Channel, channel => channel.members)
	@JoinTable({ name: "my_channels"})
	channels: Channel[]
}
