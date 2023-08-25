"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const passport_1 = __importDefault(require("passport"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(passport_1.default.initialize());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true
    }));
    app.listen(3000, () => {
        console.log('Server started on http://localhost:3000');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map