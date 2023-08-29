import { Injectable } from '@nestjs/common';
import { UsersService } from 'users/users.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AppService {
	private code: number;

	constructor(private userService: UsersService, private mailerService: MailerService) {
		this.code = Math.floor(Math.random() * 1000000);
	}

	async sendConfirmationEmail(email: string) {
		const user = await this.userService.findOneByEmail(email);
		if (!user) {
			return { message: 'User not found' };
		}
		await this.mailerService.sendMail({
			to: email,
			subject: '2FA Code',
			template: 'confirm',
			context: {
				code: this.code,
			},
		});
	}
	async sendConfirmedEmail(email: string) {
		const user = await this.userService.findOneByEmail(email);
		if (!user) {
			return { message: 'User not found' };
		}
		await this.mailerService.sendMail({
			to: email,
			subject: 'Account Confirmed',
			template: 'confirmed',
		});
	}

	getHello(): string {
		return 'Hello World!';
	}
}
