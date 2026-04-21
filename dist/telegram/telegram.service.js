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
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const telegraf_1 = require("telegraf");
const debts_service_1 = require("../debts/debts.service");
let TelegramService = class TelegramService {
    debtsService;
    bot;
    constructor(debtsService) {
        this.debtsService = debtsService;
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (token) {
            this.bot = new telegraf_1.Telegraf(token);
        }
        else {
            console.warn('⚠️ TELEGRAM_BOT_TOKEN no está definido en tu .env. El bot de Telegram no se iniciará.');
        }
    }
    onModuleInit() {
        if (!this.bot)
            return;
        this.bot.start((ctx) => {
            ctx.reply('¡Hola! Soy tu asistente de cobranzas. Envíame un mensaje con el siguiente formato para agregar una deuda:\n\n' +
                '"Monto, Concepto, Teléfono"\n\n' +
                'Ejemplo: 15000, Diseño de Logo, 5491123456789');
        });
        this.bot.on('text', async (ctx) => {
            const text = ctx.message.text;
            const parts = text.split(',').map(p => p.trim());
            if (parts.length === 3) {
                const amount = parseFloat(parts[0]);
                const description = parts[1];
                const debtorPhone = parts[2];
                if (isNaN(amount)) {
                    return ctx.reply('⚠️ El monto debe ser un número válido. (Ej: 15000)');
                }
                try {
                    await this.debtsService.createDebt(1, {
                        description,
                        amount,
                        currency: 'ARS',
                        debtorPhone,
                        isPaid: false,
                        totalInstallments: 1
                    });
                    ctx.reply(`✅ Deuda guardada con éxito:\n\nConcepto: ${description}\nMonto: $${amount}\nTeléfono: ${debtorPhone}\n\nYa puedes verla en tu Panel Web.`);
                }
                catch (error) {
                    console.error(error);
                    ctx.reply('❌ Hubo un error al guardar la deuda en la base de datos.');
                }
            }
            else {
                ctx.reply('⚠️ Formato incorrecto.\nPor favor, utiliza estrictamente: Monto, Concepto, Teléfono\n\nEjemplo: 1500, Juan Perez, 5491123456789');
            }
        });
        this.bot.launch();
        console.log('🤖 Bot de Telegram inicializado y escuchando mensajes...');
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [debts_service_1.DebtsService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map