import { AuthService } from './auth.service';
<<<<<<< HEAD
import { User } from '../users/user.entity';
=======
import { JwtService } from '@nestjs/jwt';
>>>>>>> origin/backend
export declare class AuthController {
    private authService;
    private jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    login(): Promise<void>;
<<<<<<< HEAD
    callback(req: any, res: any): Promise<any>;
    generate2FA(req: any, body: any): Promise<void>;
    enable2FA(req: any, body: User): Promise<void>;
=======
    callback(req: any, res: any): Promise<string>;
    generateQr(req: any, res: any): Promise<any>;
    authenticate2fa(req: any, body: any): Promise<string>;
>>>>>>> origin/backend
}
