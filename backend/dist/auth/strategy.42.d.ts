import { Profile } from 'passport-42';
import { AuthService } from './auth.service';
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: Profile, done: any): Promise<any>;
}
export {};
