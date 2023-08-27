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
exports.FortyTwoStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
const auth_service_1 = require("./auth.service");
const config_1 = require("@nestjs/config");
let FortyTwoStrategy = exports.FortyTwoStrategy = class FortyTwoStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, '42') {
    constructor(authService, configService) {
        super({
            clientID: configService.getOrThrow('CLIENT_ID'),
            clientSecret: configService.getOrThrow('CLIENT_SECRET'),
            callbackURL: configService.getOrThrow('CALL_BACK_URL'),
        });
        this.authService = authService;
        this.configService = configService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const user = await this.authService.validate({
            email: profile._json.email,
            username: profile.username,
        });
        console.log(user);
        if (!user) {
            return done(new common_1.UnauthorizedException(), false);
        }
        done(null, user);
    }
};
exports.FortyTwoStrategy = FortyTwoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService, config_1.ConfigService])
], FortyTwoStrategy);
//# sourceMappingURL=strategy.42.js.map