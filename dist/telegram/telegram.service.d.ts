import { OnModuleInit } from '@nestjs/common';
import { DebtsService } from '../debts/debts.service';
export declare class TelegramService implements OnModuleInit {
    private readonly debtsService;
    private bot;
    constructor(debtsService: DebtsService);
    onModuleInit(): void;
}
