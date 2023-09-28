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

	// twoFactorAuthenticationSecret: string

	@Column()
	email: string

	@Column({ nullable: true })
	profileImage: string
	
	@Column({ nullable: true })
	@Exclude()
	twoFactorSecret: string

	@Column({ default: false})
	@Exclude()
	is2FAEnabled: boolean
}