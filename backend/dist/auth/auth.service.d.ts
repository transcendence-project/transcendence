import { UsersService } from 'users/users.service';
export declare class AuthService {
    private userService;
    constructor(userService: UsersService);
    configurePassport(): void;
}
