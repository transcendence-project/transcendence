import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private repo;
    constructor(repo: Repository<User>);
    create(email: string, userName: string): Promise<User>;
    findOne(id: number): Promise<User>;
    findOneByUserName(userName: string): Promise<User>;
    findAll(userName: string): Promise<User[]>;
    update(id: number, attrs: Partial<User>): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<typeof NotFoundException | import("typeorm").DeleteResult>;
}
