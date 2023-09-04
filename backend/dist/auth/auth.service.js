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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const otplib_1 = require("otplib");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const qrcode_1 = require("qrcode");
let AuthService = exports.AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validate(user) {
        const token = this.jwtService.sign({ username: user.username });
        return await this.userService.create(user.email, user.username);
    }
    async generate2FA(user) {
        const secret = otplib_1.authenticator.generateSecret();
        const otpAuthUrl = otplib_1.authenticator.keyuri(user.email, 'Transcendence', secret);
        await this.userService.set2FA(user.id, secret);
        return {
            secret,
            otpAuthUrl
        };
    }
    async is2FAEnabled(twoFactorSecret, user) {
        return otplib_1.authenticator.verify({
            token: twoFactorSecret,
            secret: user.twoFactorSecret
        });
    }
    async generateQrCode(otpAuthUrl) {
        return ((0, qrcode_1.toDataURL)(otpAuthUrl));
    }
    async loginwith2FA(user) {
        const payload = {
            email: user.email,
            is2FAEnabled: true
        };
        return {
            email: payload.email,
            access_token: this.jwtService.sign(payload)
        };
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map