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
const passport_42_1 = require("passport-42");
const users_service_1 = require("../users/users.service");
let AuthService = exports.AuthService = class AuthService {
    constructor(userService) {
        this.userService = userService;
        this.configurePassport();
    }
    configurePassport() {
        passport_1.default.use(new passport_42_1.Strategy({
            clientID: "u-s4t2ud-d71d93ae1ed7236dccb8c56127a16205ca6fc7aca52c8dfe81f61aaf0ec7a31a",
            clientSecret: "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",
            callbackURL: "http://localhost:3000/auth/42/callback",
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
                email: profile.emails.toString()
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
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map