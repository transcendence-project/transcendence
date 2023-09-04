import { Injectable } from '@nestjs/common';
import { UsersService } from 'users/users.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}
}
