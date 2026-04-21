import { PrismaService } from '../prisma/prisma.service';
import { Debt, Prisma } from '@prisma/client';
export declare class DebtsService {
    private prisma;
    constructor(prisma: PrismaService);
    createDebt(userId: number, data: Prisma.DebtCreateWithoutUserInput): Promise<Debt[]>;
    getActiveDebts(userId: number): Promise<Debt[]>;
    generateWhatsAppLink(debtId: number, userId: number): Promise<string>;
    updateDebt(id: number, userId: number, data: Prisma.DebtUpdateInput): Promise<Debt>;
    deleteDebt(id: number, userId: number): Promise<Debt>;
}
