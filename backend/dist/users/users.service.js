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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const typeorm_2 = require("@nestjs/typeorm");
let UsersService = exports.UsersService = class UsersService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(email, userName) {
        const user = await this.findAll(userName);
        if (user.length)
            return (null);
        const user2 = this.repo.create({ email, userName });
        return (this.repo.save(user2));
    }
    findOne(id) {
        return (this.repo.findOneBy({ id }));
    }
    findOneByUserName(userName) {
        return (this.repo.findOneBy({ userName }));
    }
    findAll(userName) {
        return (this.repo.find({ where: { userName } }));
    }
    update(id, attrs) {
        return (this.repo.update(id, attrs));
    }
    async remove(id) {
        const user = await this.findOne(id);
        if (!user)
            return (common_1.NotFoundException);
        console.log(user);
        return (this.repo.delete(id));
    }
};
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map