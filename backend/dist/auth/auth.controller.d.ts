import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private authService;
    private jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    login(): Promise<void>;
    callback(req: any, res: any): Promise<string>;
    generateQr(req: any, res: any): Promise<any>;
    authenticate2fa(req: any, body: any): Promise<string>;
}
