import { ConfigService } from '@nestjs/config';
import { UsersService } from 'users/users.service';
export declare class AuthService {
    private userService;
    private configService;
    constructor(userService: UsersService, configService: ConfigService);
    configurePassport(): void;
}
