"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users/users.service");
const mailer_1 = require("@nestjs-modules/mailer");
let AppService = exports.AppService = class AppService {
    constructor(userService, mailerService) {
        this.userService = userService;
        this.mailerService = mailerService;
        this.code = Math.floor(Math.random() * 1000000);
    }
    async sendConfirmationEmail(email) {
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
    async sendConfirmedEmail(email) {
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
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, mailer_1.MailerService])
], AppService);
//# sourceMappingURL=app.service.js.map