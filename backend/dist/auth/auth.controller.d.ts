import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(): Promise<void>;
    callback(req: any, res: any): Promise<any>;
    generate2FA(req: any, body: any): Promise<void>;
    enable2FA(req: any, body: User): Promise<void>;
}
