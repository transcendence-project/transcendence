import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chan_name: string;

  @Column()
  owner: string;

  @Column('text', { array: true })
  admin: string[];

  @Column('text', { array: true })
  members: string [];

  @Column('text', { array: true, nullable: true  })
  banned: string[];

  @Column('text', { array: true })
  muted: string[];

  @Column({ nullable: true })
  password: string;
}