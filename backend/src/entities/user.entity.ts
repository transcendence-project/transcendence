import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
// import { Exclude } from "class-transformer";
import { Match } from "./match.entity";
import { Achievement } from "./achievement.entity";
import { FriendRequest } from "./friend-request.entity";
// import { Friend } from "./friend.entity";
import { Channel } from "./channel.entity";
// import { Invitation } from "./invitations.entity";

@Entity()
export class User {
  //@PrimaryGeneratedColumn() - to mark as the primary key
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column()
  userName: string;

  @Column()
  image: string;

  @Column()
  email: string;
  
  @Column({default: 50})
  points: number;

  @Column({ nullable: true })
  is2FAEnabled: boolean;

  @Column({ nullable: true })
  // @Exclude()
  twoFactorSecret: string;

  @Column({ default: false })
  isTwoFactorAuthenticated: boolean;

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable({
    name: "friends",
    joinColumn: {
      name: "user",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "friend",
      referencedColumnName: "id",
    },
  })
  friends: User[];

  @OneToMany(() => User, (user) => user.friendRequestsSent)
  friendRequestsSent: FriendRequest[];

  @OneToMany(() => User, (user) => user.friendRequestsReceived)
  friendRequestsReceived: FriendRequest[];

  @OneToMany(() => Match, (match) => match.playerOne)
  matchesAsPlayerOne: Match[];
  
  @OneToMany(() => Match, (match) => match.playerTwo)
  matchesAsPlayerTwo: Match[];  

  @ManyToMany(() => Achievement, (achievement) => achievement.users)
  @JoinTable({
    name: "user_achievements_user",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "achievement_id",
      referencedColumnName: "id",
    },
  })
  achievements: Achievement[];

  @ManyToMany(() => Channel, (channel) => channel.members)
  @JoinTable({ name: "my_channels" })
  channels: Channel[];

  @Column({ default: false })
  isOnline: boolean;
}
