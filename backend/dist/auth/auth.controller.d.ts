import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(): Promise<void>;
    callback(req: any, res: any): Promise<any>;
}
