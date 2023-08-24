"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
exports.typeOrmConfig = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123',
    database: 'postgres',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true
};
//# sourceMappingURL=ormconfig.js.map