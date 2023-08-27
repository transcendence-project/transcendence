import { createUserDTO } from 'users/dtos/createUser.dto';
import { User } from 'users/user.entity';
import { UsersService } from 'users/users.service';
export declare class AuthService {
    private userService;
    constructor(userService: UsersService);
    validate(user: createUserDTO): Promise<User>;
}
