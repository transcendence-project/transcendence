import { UsersService } from '../users/users.service';
declare const Jwt2faStrategy_base: new (...args: any[]) => any;
export declare class Jwt2faStrategy extends Jwt2faStrategy_base {
    private readonly userService;
    constructor(userService: UsersService);
    validate(payload: any): Promise<import("../users/user.entity").User>;
}
export {};
