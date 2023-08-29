"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const ormconfig_1 = require("./ormconfig");
const auth_module_1 = require("./auth/auth.module");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const mailer_2 = require("@nestjs-modules/mailer");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule,
            typeorm_1.TypeOrmModule.forRoot(ormconfig_1.typeOrmConfig),
            auth_module_1.AuthModule, config_1.ConfigModule.forRoot(),
            mailer_2.MailerModule.forRoot({
                transport: {
                    service: 'gmail',
                    secure: false,
                    auth: {
                        user: process.env.MAILER_USER,
                        pass: process.env.MAILER_PASSWORD,
                    },
                },
                defaults: {
                    from: '"No Reply" <oabushar@student.42abudhabi.ae>',
                },
                template: {
                    dir: __dirname + '/templates',
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            })],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, mailer_1.MailerService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map