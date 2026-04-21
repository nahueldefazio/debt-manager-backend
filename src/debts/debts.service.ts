import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Debt, Prisma } from '@prisma/client';

@Injectable()
export class DebtsService {
  constructor(private prisma: PrismaService) {}

  async createDebt(userId: number, data: Prisma.DebtCreateWithoutUserInput): Promise<Debt[]> {
    // Create user 1 if not exists just for the mock demo
    await this.prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email: 'demo@demo.com', isPro: false }
    });
    
    const installments = data.totalInstallments || 1;
    const amountPerInstallment = data.amount / installments;
    const startDate = data.dueDate ? new Date(data.dueDate) : new Date();

    const newDebts: Debt[] = [];
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

  async getActiveDebts(userId: number): Promise<Debt[]> {
    return this.prisma.debt.findMany({
      where: { userId, isPaid: false },
      orderBy: { createdAt: 'desc' }
    });
  }

  async generateWhatsAppLink(debtId: number, userId: number): Promise<string> {
    const debt = await this.prisma.debt.findFirst({ 
      where: { id: debtId, userId } 
    });
    
    if (!debt) throw new NotFoundException('Deuda no encontrada o no te pertenece.');

    const message = `Hola! Te recuerdo que tienes una deuda pendiente por "${debt.description}" de $${debt.amount} ${debt.currency}. Por favor, contáctame para coordinar el pago.`;
    const encodedMessage = encodeURIComponent(message);
    
    const cleanPhone = debt.debtorPhone.replace(/\D/g, '');
    
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  async updateDebt(id: number, userId: number, data: Prisma.DebtUpdateInput): Promise<Debt> {
    const debt = await this.prisma.debt.findFirst({ where: { id, userId } });
    if (!debt) throw new NotFoundException('Deuda no encontrada o no te pertenece.');
    
    return this.prisma.debt.update({
      where: { id },
      data
    });
  }

  async deleteDebt(id: number, userId: number): Promise<Debt> {
    const debt = await this.prisma.debt.findFirst({ where: { id, userId } });
    if (!debt) throw new NotFoundException('Deuda no encontrada o no te pertenece.');

    return this.prisma.debt.delete({
      where: { id }
    });
  }
}
