import { createUserDTO } from '../dtos/createUser.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private userService;
    constructor(userService: UsersService);
    createUser(body: createUserDTO): void;
    findUser(id: string): Promise<import("./user.entity").User>;
    findAllUsers(userName: string): Promise<import("./user.entity").User[]>;
    deleteUser(id: string): Promise<typeof import("@nestjs/common").NotFoundException | import("typeorm").DeleteResult>;
}
