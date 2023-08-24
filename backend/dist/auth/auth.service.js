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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = __importDefault(require("passport"));
const config_1 = require("@nestjs/config");
const passport_42_1 = require("passport-42");
const users_service_1 = require("../users/users.service");
let AuthService = exports.AuthService = class AuthService {
    constructor(userService, configService) {
        this.userService = userService;
        this.configService = configService;
        this.configurePassport();
    }
    configurePassport() {
        passport_1.default.use(new passport_42_1.Strategy({
            clientID: this.configService.get('CLIENT_ID'),
            clientSecret: this.configService.get('CLIENT_SECRET'),
            callbackURL: this.configService.get('CALL_BACK_URL'),
            profileFields: {
                'id': function (obj) { return String(obj.id); },
                'username': 'login',
                'displayName': 'displayname',
                'emails': 'email',
            }
        }, async (accessToken, refreshToken, profile, done) => {
            const user = {
                id: parseInt(profile.id),
                name: profile.displayName,
                login: profile.username,
                email: profile.emails.toString(),
            };
            console.log(`User ID: ${user.id}`);
            console.log(`User Name: ${user.name}`);
            console.log(`User login: ${user.login}`);
            console.log(`User e-mail: ${user.email}`);
            this.userService.create(user.email, user.login, user.name);
            return done(null, user);
        }));
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map