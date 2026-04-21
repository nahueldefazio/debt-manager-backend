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
exports.DebtsController = void 0;
const common_1 = require("@nestjs/common");
const debts_service_1 = require("./debts.service");
const pro_limit_guard_1 = require("../guards/pro-limit.guard");
let DebtsController = class DebtsController {
    debtsService;
    constructor(debtsService) {
        this.debtsService = debtsService;
    }
    getActiveDebts(req) {
        const userId = req.user?.id || 1;
        return this.debtsService.getActiveDebts(userId);
    }
    createDebt(req, createDebtDto) {
        const userId = req.user?.id || 1;
        return this.debtsService.createDebt(userId, createDebtDto);
    }
    generateWhatsAppLink(req, id) {
        const userId = req.user?.id || 1;
        return this.debtsService.generateWhatsAppLink(id, userId)
            .then(link => ({ link }));
    }
    updateDebt(req, id, updateDebtDto) {
        const userId = req.user?.id || 1;
        return this.debtsService.updateDebt(id, userId, updateDebtDto);
    }
    deleteDebt(req, id) {
        const userId = req.user?.id || 1;
        return this.debtsService.deleteDebt(id, userId);
    }
};
exports.DebtsController = DebtsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DebtsController.prototype, "getActiveDebts", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(pro_limit_guard_1.ProLimitGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DebtsController.prototype, "createDebt", null);
__decorate([
    (0, common_1.Get)(':id/whatsapp-link'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], DebtsController.prototype, "generateWhatsAppLink", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", void 0)
], DebtsController.prototype, "updateDebt", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], DebtsController.prototype, "deleteDebt", null);
exports.DebtsController = DebtsController = __decorate([
    (0, common_1.Controller)('debts'),
    __metadata("design:paramtypes", [debts_service_1.DebtsService])
], DebtsController);
//# sourceMappingURL=debts.controller.js.map