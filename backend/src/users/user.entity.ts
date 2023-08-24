import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
	//@PrimaryGeneratedColumn() - to mark as the primary key
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	userName: string

	@Column()
	password: string

	@Column()
	email: string
}