import { DebtsService } from './debts.service';
export declare class DebtsController {
    private readonly debtsService;
    constructor(debtsService: DebtsService);
    getActiveDebts(req: any): Promise<{
        id: number;
        description: string;
        amount: number;
        currency: string;
        debtorPhone: string;
        isPaid: boolean;
        userId: number;
        createdAt: Date;
        dueDate: Date;
        currentInstallment: number;
        totalInstallments: number;
    }[]>;
    createDebt(req: any, createDebtDto: any): Promise<{
        id: number;
        description: string;
        amount: number;
        currency: string;
        debtorPhone: string;
        isPaid: boolean;
        userId: number;
        createdAt: Date;
        dueDate: Date;
        currentInstallment: number;
        totalInstallments: number;
    }[]>;
    generateWhatsAppLink(req: any, id: number): Promise<{
        link: string;
    }>;
    updateDebt(req: any, id: number, updateDebtDto: any): Promise<{
        id: number;
        description: string;
        amount: number;
        currency: string;
        debtorPhone: string;
        isPaid: boolean;
        userId: number;
        createdAt: Date;
        dueDate: Date;
        currentInstallment: number;
        totalInstallments: number;
    }>;
    deleteDebt(req: any, id: number): Promise<{
        id: number;
        description: string;
        amount: number;
        currency: string;
        debtorPhone: string;
        isPaid: boolean;
        userId: number;
        createdAt: Date;
        dueDate: Date;
        currentInstallment: number;
        totalInstallments: number;
    }>;
}
