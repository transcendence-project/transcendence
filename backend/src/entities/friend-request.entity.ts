import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'sender' }) // column name in the table
    sender: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'receiver' }) // column name in the table
    receiver: User;

    @Column({ type: 'enum', enum: ['PENDING', 'ACCEPTED', 'DECLINED'], default: 'PENDING' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
