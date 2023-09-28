import { Entity,JoinTable, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room_name: string;

  //   @JoinColumn()
  @ManyToOne(() => User) // meaning each channel has one owner (a user), and each user can own multiple channels.
  owner: User;

  @ManyToMany(type => User, { eager: true })
  admins: User[];

  @ManyToMany(type => User, { eager: true })
  @JoinTable()
  members: User [];

//   @Column('text', { array: true, nullable: true  })
//   banned: string[];

//   @Column('text', { array: true })
//   muted: string[];

  @Column({ nullable: true })
  password: string;
}

/* { eager: true } option is used when defining a relationship 
between entities to specify that the related data 
should be loaded eagerly, meaning it should be 
automatically fetched and populated when querying the entity. */

/* The @JoinTable() decorator in TypeORM is used to specify 
the details of a join table when defining a Many-to-Many 
relationship between two entities. It is typically applied 
to the property that represents the relationship 
between the owning entity and the target entity. */