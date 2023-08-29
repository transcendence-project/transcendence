import { UsersService } from 'users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
export declare class AppService {
    private userService;
    private mailerService;
    private code;
    constructor(userService: UsersService, mailerService: MailerService);
    sendConfirmationEmail(email: string): Promise<{
        message: string;
    }>;
    sendConfirmedEmail(email: string): Promise<{
        message: string;
    }>;
    getHello(): string;
}
