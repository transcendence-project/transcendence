import { createUserDTO } from 'users/dtos/createUser.dto';
import { User } from 'users/user.entity';
import { UsersService } from 'users/users.service';
import { ConfigService } from '@nestjs/config';

export declare class AuthService {
    private userService;
    private configService;
    constructor(userService: UsersService, configService: ConfigService);
    validate(user: createUserDTO): Promise<User>;
    configurePassport(): void;
}
