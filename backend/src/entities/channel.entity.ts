
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Message } from "./message.entity";
import { User } from "./user.entity";

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => Message, message => message.channel)
    messages: Message[];

    @ManyToMany(() => User, user => user.channels)
    users: User[];

    @Column()
    isGroupChannel: boolean;
}
