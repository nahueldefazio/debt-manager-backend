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
exports.DebtsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DebtsService = class DebtsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createDebt(userId, data) {
        await this.prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: { id: userId, email: 'demo@demo.com', isPro: false }
        });
        const installments = data.totalInstallments || 1;
        const amountPerInstallment = data.amount / installments;
        const startDate = data.dueDate ? new Date(data.dueDate) : new Date();
        const newDebts = [];
        for (let i = 1; i <= installments; i++) {
            const dueDate = new Date(startDate);
            dueDate.setMonth(dueDate.getMonth() + (i - 1));
            const debt = await this.prisma.debt.create({
                data: {
                    ...data,
                    userId,
                    amount: amountPerInstallment,
                    currentInstallment: i,
                    totalInstallments: installments,
                    dueDate: dueDate
                },
            });
            newDebts.push(debt);
        }
        return newDebts;
    }
    async getActiveDebts(userId) {
        return this.prisma.debt.findMany({
            where: { userId, isPaid: false },
            orderBy: { createdAt: 'desc' }
        });
    }
    async generateWhatsAppLink(debtId, userId) {
        const debt = await this.prisma.debt.findFirst({
            where: { id: debtId, userId }
        });
        if (!debt)
            throw new common_1.NotFoundException('Deuda no encontrada o no te pertenece.');
        const message = `Hola! Te recuerdo que tienes una deuda pendiente por "${debt.description}" de $${debt.amount} ${debt.currency}. Por favor, contáctame para coordinar el pago.`;
        const encodedMessage = encodeURIComponent(message);
        const cleanPhone = debt.debtorPhone.replace(/\D/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    }
    async updateDebt(id, userId, data) {
        const debt = await this.prisma.debt.findFirst({ where: { id, userId } });
        if (!debt)
            throw new common_1.NotFoundException('Deuda no encontrada o no te pertenece.');
        return this.prisma.debt.update({
            where: { id },
            data
        });
    }
    async deleteDebt(id, userId) {
        const debt = await this.prisma.debt.findFirst({ where: { id, userId } });
        if (!debt)
            throw new common_1.NotFoundException('Deuda no encontrada o no te pertenece.');
        return this.prisma.debt.delete({
            where: { id }
        });
    }
};
exports.DebtsService = DebtsService;
exports.DebtsService = DebtsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DebtsService);
//# sourceMappingURL=debts.service.js.map