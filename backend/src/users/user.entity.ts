import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Exclude } from "class-transformer";
@Entity()
export class User {
	//@PrimaryGeneratedColumn() - to mark as the primary key
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	userName: string

	// @Column()
	// @Exclude()
	// password: string

	twoFactorAuthenticationSecret: string

	@Column()
	email: string
}