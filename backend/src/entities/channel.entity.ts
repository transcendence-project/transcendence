import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne, JoinTable } from "typeorm";
import { Message } from "./message.entity";
import { User } from "./user.entity";

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    room_name: string;

    @OneToMany(() => Message, message => message.channel, {onDelete: 'CASCADE'})
    messages: Message[];

	//   @JoinColumn()
	@ManyToOne(() => User) // meaning each channel has one owner (a user), and each user can own multiple channels.
	owner: User;

	@ManyToMany(type => User)
	@JoinTable()
	admins: User[];

    @ManyToMany(() => User, user => user.channels)
    members: User[];

    @Column({default: false})
    isGroupChannel: boolean;

	@Column({ nullable: true})
	password: string;

	@Column({nullable: true, default: false})
	is_private: boolean;

	@Column({nullable: true, default: false})
	is_protected: boolean;

	@Column({nullable: true, default: false})
	is_public: boolean;

	@ManyToMany(type => User)
	@JoinTable()
  	banned: User[];

	@ManyToMany(type => User)
	@JoinTable()
	muted: User[];
}

/* The @JoinTable() decorator in TypeORM is used to specify 
the details of a join table when defining a Many-to-Many 
relationship between two entities. It is typically applied 
to the property that represents the relationship 
between the owning entity and the target entity. */