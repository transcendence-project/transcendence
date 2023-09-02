import { createUserDTO } from 'users/dtos/createUser.dto';
import { User } from 'users/user.entity';
import { UsersService } from 'users/users.service';
import { iUser } from 'users/users.inteface';
export declare class AuthService {
    private userService;
    constructor(userService: UsersService);
    validate(user: createUserDTO): Promise<User>;
    generateTwoFactorAuthenticationSecret(user: iUser): Promise<{
        secret: string;
        otpauthUrl: string;
    }>;
    generateQrCodeDataURL(otpAuthUrl: string): Promise<string>;
    is2faCodeValid(twoFactorAuthenticationCode: string, user: iUser): boolean;
}
