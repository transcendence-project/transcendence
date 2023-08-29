import { createUserDTO } from 'users/dtos/createUser.dto';
import { User } from 'users/user.entity';
import { UsersService } from 'users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UsersService, jwtService: JwtService);
    validate(user: createUserDTO): Promise<User>;
}
