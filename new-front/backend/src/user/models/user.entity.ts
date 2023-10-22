import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	first_name: string

	@Column()
	last_name: string

	@Column()
	email: string

	@Column()
	status: string

	@Column()
	win: number

	@Column()
	lose: number

	@Column()
	draw: number

	@Column()
	rank: number
}